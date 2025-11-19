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

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

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

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
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

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI API error:', response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    console.log('AI template response received, parsing...');
    
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
