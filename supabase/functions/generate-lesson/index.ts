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

    const KIMI_API_KEY = Deno.env.get('KIMI_API_KEY');
    const DEEPSEEK_API_KEY = Deno.env.get('DEEPSEEK_API_KEY');

    const systemPrompt = `You are an expert educational content creator. Generate a comprehensive, engaging lesson based on the provided framework.`;
    
    const userPrompt = `Create a comprehensive 6-tab lesson based on this information:

Problem & Context: ${lessonData.problem}
Audience: ${lessonData.audience}
Common Undesirable Solutions: ${lessonData.undesirableSolutions}
Framework/Solution: ${lessonData.framework}
How It Works: ${lessonData.howItWorks}
Practice Activities: ${lessonData.practice}
Reflection: ${lessonData.reflection}

Structure the lesson with exactly 6 tabs:
1. "The Problem" - Explain the problem in context with 4 bullet points, ONE MC question (REQUIRED), and additional reading
2. "Common Behaviors" - Describe undesirable approaches with 4 bullet points, ONE MC question (REQUIRED), and examples
3. "The Framework" - Present the new framework/solution with 4 bullet points, ONE MC question (REQUIRED), and structure explanation
4. "How It Works" - Step-by-step demonstration with 4 bullet points, ONE MC question (REQUIRED), and practical examples
5. "Practice" - Interactive practice with 2-4 custom input fields and a system prompt for AI feedback
6. "Reflection" - Summary and custom reflection question

CRITICAL REQUIREMENTS:
1. Ensure ALL bullet points have meaningful, non-empty text content. Never leave bullet text blank.
2. TABS 0-3 MUST HAVE EXACTLY ONE MULTIPLE CHOICE QUESTION EACH (comprehensionCheck field is REQUIRED)
3. Each MC question must have 3-4 options with exactly one correct answer
4. For tabs 0-3: Include 4 engaging bullet points with emojis, ONE MC question with 3 options (one correct), and 2 collapsible sections.
5. For tab 4: Provide intro text, create 2-4 practiceFields based on lesson content, and write a systemPrompt to guide AI feedback.
6. For tab 5: Provide congratulatory intro and a custom reflection question in reflectionContent.question that relates specifically to THIS lesson's content.

Make it engaging and pedagogically sound!`;

    const toolDefinition = [
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
                      description: "4 key bullet points with icons - MUST have valid text",
                      items: {
                        type: "object",
                        properties: {
                          icon: { type: "string", description: "Single emoji icon" },
                          text: { type: "string", description: "REQUIRED - Bullet point text, never empty" }
                        },
                        required: ["icon", "text"]
                      }
                    },
                    comprehensionCheck: {
                      type: "object",
                      description: "REQUIRED for tabs 0-3. MC question with exactly 3 options",
                      properties: {
                        question: { type: "string" },
                        options: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              text: { type: "string" },
                              isCorrect: { type: "boolean" }
                            },
                            required: ["text", "isCorrect"]
                          }
                        }
                      },
                      required: ["question", "options"]
                    },
                    collapsibleSections: {
                      type: "array",
                      description: "2 collapsible sections for additional content",
                      items: {
                        type: "object",
                        properties: {
                          title: { type: "string" },
                          content: { type: "string" }
                        },
                        required: ["title", "content"]
                      }
                    },
                    practiceContent: {
                      type: "object",
                      description: "For tab 4 - practice activity configuration",
                      properties: {
                        practiceFields: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              label: { type: "string" },
                              placeholder: { type: "string" }
                            },
                            required: ["label", "placeholder"]
                          }
                        },
                        systemPrompt: { type: "string", description: "Prompt to guide AI feedback" }
                      },
                      required: ["practiceFields", "systemPrompt"]
                    },
                    reflectionContent: {
                      type: "object",
                      description: "For tab 5 - reflection question",
                      properties: {
                        question: { type: "string", description: "Custom reflection question for THIS lesson" }
                      },
                      required: ["question"]
                    }
                  },
                  required: ["id", "label", "title", "intro"]
                }
              }
            },
            required: ["title", "subject", "grade_level", "learning_objectives", "tabs"]
          }
        }
      }
    ];

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
            { role: 'user', content: userPrompt }
          ],
          tools: toolDefinition,
          tool_choice: { type: "function", function: { name: "create_lesson" } }
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
            { role: 'user', content: userPrompt }
          ],
          tools: toolDefinition,
          tool_choice: { type: "function", function: { name: "create_lesson" } }
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

    console.log(`Lesson generation completed using ${usedModel}`);

    // Extract the tool call result
    const toolCall = responseData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || !toolCall.function) {
      throw new Error('No valid tool call in response');
    }

    const lessonContent = JSON.parse(toolCall.function.arguments);

    return new Response(
      JSON.stringify(lessonContent),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-lesson function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});