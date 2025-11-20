import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { example, discipline, category } = await req.json();
    const KIMI_API_KEY = Deno.env.get('KIMI_API_KEY');
    const DEEPSEEK_API_KEY = Deno.env.get('DEEPSEEK_API_KEY');

    console.log('Generating template analysis for:', {
      category,
      discipline,
      exampleLength: example?.length
    });

    const analysisPrompt = `You are an academic writing instructor creating a practice exercise.

ORIGINAL EXAMPLE (from Academic Phrasebank):
"${example}"

CONTEXT:
- Category: ${category}
- Discipline: ${discipline}

Create a practice template for students to write their own sentence on a DIFFERENT TOPIC within ${discipline}.

Provide:

1. TEMPLATE: Extract the grammatical structure with placeholders (e.g., [SUBJECT], [VERB], [RESULT], [VARIABLE])
   - Make placeholders specific to help students (e.g., [PSYCHOLOGICAL CONSTRUCT] rather than just [THING])

2. HINT: One sentence explaining how to apply this template to a different ${discipline} topic

3. LINGUISTIC FEATURES: List EXACTLY 2 key features. Each feature must be 2 lines maximum.
   Format: "Feature name: Brief explanation (max 2 lines)"
   Example: "Passive voice: Creates objectivity by removing the actor. Commonly used in reporting results."

4. LEXICOGRAMMATICAL PATTERNS: Identify EXACTLY 2 specific patterns. Each pattern must be 2 lines maximum.
   Format: "Pattern: Brief explanation with example (max 2 lines)"
   Example: "X led to Y: Shows direct causation. Used when reporting clear cause-effect relationships."

5. SUGGESTED TOPIC: Suggest a specific, different topic within ${discipline} that students could write about using this template

Format response as JSON:
{
  "template": "string with specific placeholders",
  "hint": "one sentence hint",
  "linguisticFeatures": ["feature 1: explanation", "feature 2: explanation"],
  "patterns": ["pattern name: explanation with example"],
  "suggestedTopic": "specific topic suggestion"
}`;

    let content: string;
    let usedModel = "Kimi";

    try {
      console.log("Attempting to use Kimi API");
      const kimiResponse = await fetch("https://api.moonshot.cn/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${KIMI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "moonshot-v1-8k",
          messages: [
            {
              role: 'system',
              content: 'You are an expert academic writing instructor. Provide clear, actionable guidance in valid JSON format only.'
            },
            {
              role: 'user',
              content: analysisPrompt
            }
          ],
          temperature: 0.7,
        }),
      });

      if (!kimiResponse.ok) {
        const errorText = await kimiResponse.text();
        console.error("Kimi API error:", errorText);
        throw new Error(`Kimi API failed: ${kimiResponse.status}`);
      }

      const kimiData = await kimiResponse.json();
      content = kimiData.choices[0].message.content;
      console.log("Successfully used Kimi API");
    } catch (kimiError) {
      console.error("Kimi API failed, falling back to DeepSeek:", kimiError);
      usedModel = "DeepSeek";

      const deepseekResponse = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: 'system',
              content: 'You are an expert academic writing instructor. Provide clear, actionable guidance in valid JSON format only.'
            },
            {
              role: 'user',
              content: analysisPrompt
            }
          ],
          temperature: 0.7,
        }),
      });

      if (!deepseekResponse.ok) {
        const errorText = await deepseekResponse.text();
        console.error("DeepSeek API error:", errorText);
        throw new Error(`Both Kimi and DeepSeek APIs failed`);
      }

      const deepseekData = await deepseekResponse.json();
      content = deepseekData.choices[0].message.content;
      console.log("Successfully used DeepSeek API");
    }

    console.log(`AI template response received using ${usedModel}, parsing...`);
    
    // Extract JSON from markdown code blocks if present
    let jsonContent = content;
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      jsonContent = jsonMatch[1];
    }
    
    const parsedResponse = JSON.parse(jsonContent);

    return new Response(
      JSON.stringify(parsedResponse),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-template-analysis function:', error);
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
