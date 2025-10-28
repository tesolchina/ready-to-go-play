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
            content: `Create a comprehensive 6-tab lesson based on this information:

Problem & Context: ${lessonData.problem}
Audience: ${lessonData.audience}
Common Undesirable Solutions: ${lessonData.undesirableSolutions}
Framework/Solution: ${lessonData.framework}
How It Works: ${lessonData.howItWorks}
Practice Activities: ${lessonData.practice}
Reflection: ${lessonData.reflection}

Structure the lesson with exactly 6 tabs:
1. "The Problem" - Explain the problem in context with 4 bullet points, an MC question, and additional reading
2. "Common Behaviors" - Describe undesirable approaches with 4 bullet points, MC question, and examples
3. "The Framework" - Present the new framework/solution with 4 bullet points, MC question, and structure explanation
4. "How It Works" - Step-by-step demonstration with 4 bullet points, MC question, and practical examples
5. "Practice" - This will use the PromptBuilder component (simple intro text only, no bullets needed)
6. "Reflection" - Summary and next steps (will use FeedbackForm, simple intro only)

For tabs 0-3: Include engaging bullet points with emojis, create relevant MC questions with 3 options, and add 2 collapsible sections for additional content.
For tab 4 (Practice): Just provide intro text explaining what students will practice.
For tab 5 (Reflection): Just provide a congratulatory intro text.

Make it engaging and pedagogically sound!`
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "create_lesson",
              description: "Create a structured educational lesson with 6 tabs",
              parameters: {
                type: "object",
                properties: {
                  title: { type: "string", description: "A compelling lesson title" },
                  subject: { type: "string", description: "The subject area" },
                  grade_level: { type: "string", description: "Target grade level" },
                  learning_objectives: { type: "string", description: "Clear learning objectives" },
                  tabs: {
                    type: "array",
                    description: "6 tabs for the lesson",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string", description: "Tab ID (0-5)" },
                        label: { type: "string", description: "Tab label" },
                        title: { type: "string", description: "Section title" },
                        intro: { type: "string", description: "Introduction paragraph" },
                        bulletPoints: {
                          type: "array",
                          description: "4 key bullet points with icons",
                          items: {
                            type: "object",
                            properties: {
                              icon: { type: "string", description: "Emoji icon" },
                              text: { type: "string", description: "Bullet point text" }
                            }
                          }
                        },
                        comprehensionCheck: {
                          type: "object",
                          description: "MC question for this tab",
                          properties: {
                            question: { type: "string" },
                            options: {
                              type: "array",
                              items: {
                                type: "object",
                                properties: {
                                  text: { type: "string" },
                                  correct: { type: "boolean" }
                                }
                              }
                            }
                          }
                        },
                        additionalSections: {
                          type: "array",
                          description: "Collapsible sections for additional content",
                          items: {
                            type: "object",
                            properties: {
                              title: { type: "string" },
                              icon: { type: "string" },
                              content: { type: "string" }
                            }
                          }
                        }
                      }
                    }
                  }
                },
                required: ["title", "subject", "grade_level", "learning_objectives", "tabs"]
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
