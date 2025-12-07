import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { schemas, validateRequest } from "../_shared/validation.ts";
import { getAIProviderConfig, hasAIProvider, callAIProvider } from "../_shared/ai-providers.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-platform-session, x-user-kimi-key, x-user-deepseek-key',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    
    // Validate input with zod schema
    const validation = validateRequest(schemas.templateFeedback, body);
    if (!validation.success) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { 
      paragraphText, 
      patternCategory, 
      patternSubcategory, 
      templateText, 
      userAnswer 
    } = validation.data;

    const config = getAIProviderConfig(req);

    if (!hasAIProvider(config)) {
      return new Response(
        JSON.stringify({ 
          error: "AI services not configured. Please configure your API key in the Lessons page.",
          needsConfiguration: true 
        }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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

    const result = await callAIProvider(config, {
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'Please provide feedback on my answer.' }
      ],
      maxTokens: 2000,
    });

    console.log(`Feedback generated using ${result.provider}`);

    const feedbackContent = result.content;
    if (!feedbackContent) {
      throw new Error('No feedback content in response');
    }

    // Parse JSON, handling markdown code blocks
    let jsonContent = feedbackContent;
    const jsonMatch = feedbackContent.match(/```json\n([\s\S]*?)\n```/) || feedbackContent.match(/```\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      jsonContent = jsonMatch[1];
    }

    const feedback = JSON.parse(jsonContent);

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
