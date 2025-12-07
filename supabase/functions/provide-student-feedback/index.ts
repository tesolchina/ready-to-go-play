import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
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
    const { selectedExample, studentSentence, discipline, category } = await req.json();
    
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

    const result = await callAIProvider(config, {
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
    });

    console.log(`AI feedback response received using ${result.provider}, parsing...`);
    
    // Extract JSON from markdown code blocks if present
    let jsonContent = result.content;
    const jsonMatch = result.content.match(/```json\n([\s\S]*?)\n```/) || result.content.match(/```\n([\s\S]*?)\n```/);
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
