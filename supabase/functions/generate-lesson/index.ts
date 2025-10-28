import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const lessonData = await req.json();
    
    // Validate lesson data
    const requiredFields = ['problem', 'audience', 'undesirableSolutions', 'framework', 'howItWorks', 'practice', 'reflection'];
    for (const field of requiredFields) {
      if (!lessonData[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Use Lovable AI to generate a structured lesson
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are an expert educational content creator. Generate a comprehensive, engaging lesson based on the provided framework. 
            
Structure the lesson with:
- A compelling title
- Clear learning objectives
- Detailed sections covering the problem, framework, demonstration, and practice
- Interactive elements and examples
- Reflection prompts

Return a JSON object with this structure:
{
  "title": "string",
  "description": "string",
  "sections": [
    {
      "title": "string",
      "content": "string (can include markdown)",
      "type": "content" | "demo" | "practice"
    }
  ]
}`
          },
          {
            role: 'user',
            content: `Create a lesson based on this information:

Problem & Context: ${lessonData.problem}

Audience: ${lessonData.audience}

Common Undesirable Solutions: ${lessonData.undesirableSolutions}

Framework/Solution: ${lessonData.framework}

How It Works: ${lessonData.howItWorks}

Practice Activities: ${lessonData.practice}

Reflection: ${lessonData.reflection}

Generate a complete, engaging lesson that follows best practices in instructional design.`
          }
        ],
      }),
    });

    if (!aiResponse.ok) {
      throw new Error(`AI API error: ${aiResponse.statusText}`);
    }

    const aiData = await aiResponse.json();
    const generatedLesson = aiData.choices[0].message.content;
    
    // Parse the JSON response
    let lessonStructure;
    try {
      const jsonMatch = generatedLesson.match(/\{[\s\S]*\}/);
      lessonStructure = JSON.parse(jsonMatch ? jsonMatch[0] : generatedLesson);
    } catch (e) {
      console.error('Failed to parse AI response:', e);
      throw new Error('Failed to generate lesson structure');
    }

    // Return the generated lesson (will be stored on the frontend)
    return new Response(
      JSON.stringify({ 
        lesson: lessonStructure,
        sourceData: lessonData
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in generate-lesson:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
