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
    const { selectedExample, studentSentence, discipline, category } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Providing feedback on student sentence:', {
      category,
      discipline,
      sentenceLength: studentSentence?.length
    });

    const feedbackPrompt = `You are an academic writing instructor providing feedback on a student's sentence.

ORIGINAL EXAMPLE (from Academic Phrasebank):
"${selectedExample}"

STUDENT'S SENTENCE:
"${studentSentence}"

CONTEXT:
- Category: ${category}
- Discipline: ${discipline}

Provide constructive feedback:

1. STRENGTHS: What the student did well (2-3 specific points)

2. AREAS FOR IMPROVEMENT: Specific suggestions with examples (2-3 points)

3. REVISED VERSION: Provide an improved version if needed, otherwise return null if the sentence is already good

4. ACADEMIC REGISTER: Comment on whether it maintains appropriate academic tone and formality

Format response as JSON:
{
  "strengths": "specific praise with examples",
  "improvements": "specific suggestions",
  "revisedVersion": "improved sentence or null",
  "registerComment": "comment on academic tone"
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
            content: 'You are an expert academic writing instructor. Provide constructive, specific feedback in valid JSON format only.'
          },
          {
            role: 'user',
            content: feedbackPrompt
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
    
    console.log('AI feedback response received, parsing...');
    
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
    console.error('Error in provide-student-feedback function:', error);
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
