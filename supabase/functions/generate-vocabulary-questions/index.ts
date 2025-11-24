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
    const { text, difficulty, previousWords } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const difficultyContext = difficulty === 'easy' ? 'simple, common vocabulary' :
                            difficulty === 'medium' ? 'intermediate vocabulary with word families' :
                            'advanced vocabulary, word families, and complex usage';

    const systemPrompt = `You are a vocabulary development expert. Generate questions from the provided text focusing on ${difficultyContext}.

Rules:
1. Identify key vocabulary words and their word families (e.g., "create" → "creation", "creative", "creator")
2. Generate 5 questions in this exact JSON format:
{
  "questions": [
    {
      "type": "multiple_choice",
      "word": "target word",
      "wordFamily": ["related", "words"],
      "question": "question text with _____ for the blank",
      "options": ["correct answer", "distractor 1", "distractor 2", "distractor 3"],
      "correctAnswer": "correct answer",
      "difficulty": "easy|medium|hard",
      "explanation": "brief explanation of the word and its family"
    },
    {
      "type": "fill_blank",
      "word": "target word",
      "wordFamily": ["related", "words"],
      "question": "sentence with _____ for the blank",
      "correctAnswer": "target word",
      "difficulty": "easy|medium|hard",
      "explanation": "brief explanation"
    },
    {
      "type": "short_answer",
      "word": "target word",
      "wordFamily": ["related", "words"],
      "question": "Define the word in context",
      "correctAnswer": "sample answer",
      "difficulty": "easy|medium|hard",
      "explanation": "brief explanation"
    }
  ]
}

3. Avoid these words: ${previousWords?.join(', ') || 'none'}
4. Start with simple words if difficulty is easy, progress to harder vocabulary
5. Use context from the provided text`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Generate vocabulary questions from this text:\n\n${text}` }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      return new Response(JSON.stringify({ error: 'Failed to generate questions' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    // Parse JSON from response
    let questions;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      questions = JSON.parse(jsonMatch ? jsonMatch[0] : content);
    } catch (e) {
      console.error('Failed to parse AI response:', e);
      return new Response(JSON.stringify({ error: 'Invalid AI response format' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(questions), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
