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
            content: `You are an expert educational content creator. Generate a comprehensive, engaging lesson based on the provided framework.`
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
        tools: [
          {
            type: "function",
            function: {
              name: "create_lesson",
              description: "Create a structured educational lesson",
              parameters: {
                type: "object",
                properties: {
                  title: { type: "string", description: "A compelling lesson title" },
                  subject: { type: "string", description: "The subject area (e.g., Education, Technology, Science)" },
                  grade_level: { type: "string", description: "Target grade level or education level" },
                  learning_objectives: { type: "string", description: "Clear learning objectives for this lesson" },
                  sections: {
                    type: "array",
                    description: "Lesson sections with detailed content",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        content: { type: "string" },
                        type: { type: "string", enum: ["content", "demo", "practice", "reflection"] }
                      },
                      required: ["title", "content", "type"]
                    }
                  }
                },
                required: ["title", "subject", "grade_level", "learning_objectives", "sections"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "create_lesson" } }
      }),
    });

    if (!aiResponse.ok) {
      throw new Error(`AI API error: ${aiResponse.statusText}`);
    }

    const aiData = await aiResponse.json();
    
    // Extract the tool call result
    const toolCall = aiData.choices[0].message.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== 'create_lesson') {
      throw new Error('AI did not return expected tool call');
    }
    
    const lessonStructure = JSON.parse(toolCall.function.arguments);

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
