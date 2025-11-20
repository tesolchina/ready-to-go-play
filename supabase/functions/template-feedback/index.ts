import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const KIMI_API_KEY = Deno.env.get('KIMI_API_KEY');
const DEEPSEEK_API_KEY = Deno.env.get('DEEPSEEK_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      paragraphText, 
      patternCategory, 
      patternSubcategory, 
      templateText, 
      userAnswer 
    } = await req.json();

    if (!userAnswer || userAnswer.trim().length < 10) {
      return new Response(
        JSON.stringify({ error: 'Answer must be at least 10 characters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Generating feedback for template answer');

    const systemPrompt = `You are an expert academic writing coach. Provide constructive feedback on the student's use of an academic writing template.

Context:
- Pattern Category: ${patternCategory}
- Pattern Subcategory: ${patternSubcategory}
- Template: ${templateText}
- Student's Answer: ${userAnswer}

Provide detailed feedback in the following JSON structure:
{
  "overall_score": <number 1-10>,
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<improvement 1>", "<improvement 2>"],
  "revised_suggestion": "<your revised version>",
  "explanation": "<brief explanation of key improvements>"
}

Focus on:
1. How well they followed the template structure
2. Academic tone and vocabulary
3. Clarity and coherence
4. Grammar and mechanics`;

    let responseData: any;
    let usedModel = "Kimi";

    try {
      console.log("Attempting to use Kimi API");
      const kimiResponse = await fetch('https://api.moonshot.cn/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${KIMI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'moonshot-v1-8k',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: 'Please provide feedback on my answer.' }
          ],
          response_format: { type: "json_object" },
          max_tokens: 2000
        }),
      });

      if (!kimiResponse.ok) {
        const errorText = await kimiResponse.text();
        console.error('Kimi API error:', errorText);
        throw new Error(`Kimi API failed: ${kimiResponse.status}`);
      }

      responseData = await kimiResponse.json();
      console.log('Successfully used Kimi API');
    } catch (kimiError) {
      console.error('Kimi API failed, falling back to DeepSeek:', kimiError);
      usedModel = "DeepSeek";

      const deepseekResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: 'Please provide feedback on my answer.' }
          ],
          response_format: { type: "json_object" },
          max_tokens: 2000
        }),
      });

      if (!deepseekResponse.ok) {
        const errorText = await deepseekResponse.text();
        console.error('DeepSeek API error:', errorText);
        throw new Error('Both Kimi and DeepSeek APIs failed');
      }

      responseData = await deepseekResponse.json();
      console.log('Successfully used DeepSeek API');
    }

    console.log(`Feedback generated using ${usedModel}`);

    const feedbackContent = responseData.choices?.[0]?.message?.content;
    if (!feedbackContent) {
      throw new Error('No feedback content in response');
    }

    const feedback = JSON.parse(feedbackContent);

    // Store in database
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { error: dbError } = await supabaseClient
      .from('template_submissions')
      .insert({
        paragraph_text: paragraphText,
        pattern_category: patternCategory,
        pattern_subcategory: patternSubcategory,
        template_text: templateText,
        user_answer: userAnswer,
        ai_feedback: feedback,
        user_id: null // Will be set by RLS if user is authenticated
      });

    if (dbError) {
      console.error('Database error:', dbError);
    }

    return new Response(
      JSON.stringify(feedback),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in template-feedback function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
