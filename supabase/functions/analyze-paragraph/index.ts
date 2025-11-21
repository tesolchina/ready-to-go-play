import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-platform-session, x-user-kimi-key, x-user-deepseek-key',
};

// Available phrasebank categories
const MOVES_CATEGORIES = [
  "Introducing work",
  "Referring to sources", 
  "Describing methods",
  "Reporting results",
  "Discussing findings",
  "Writing conclusions"
];

const GENERAL_CATEGORIES = [
  "Being cautious",
  "Being critical",
  "Classifying and listing",
  "Compare and contrast",
  "Defining terms",
  "Describing trends",
  "Describing quantities",
  "Explaining causality",
  "Giving examples",
  "Signalling transition",
  "Writing about the past"
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { paragraph } = await req.json();

    if (!paragraph || paragraph.trim().length < 50) {
      return new Response(
        JSON.stringify({ error: 'Paragraph must be at least 50 characters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get API keys from environment variables (platform keys)
    let KIMI_API_KEY = Deno.env.get('KIMI_API_KEY');
    let DEEPSEEK_API_KEY = Deno.env.get('DEEPSEEK_API_KEY');

    // Check for platform session in headers
    const platformSession = req.headers.get("x-platform-session");
    const hasPlatformAccess = !!platformSession;

    // If no platform access, use user-provided keys from headers
    if (!hasPlatformAccess) {
      const userKimiKey = req.headers.get("x-user-kimi-key");
      const userDeepseekKey = req.headers.get("x-user-deepseek-key");
      
      if (userKimiKey) KIMI_API_KEY = userKimiKey;
      if (userDeepseekKey) DEEPSEEK_API_KEY = userDeepseekKey;
    }

    if (!KIMI_API_KEY && !DEEPSEEK_API_KEY) {
      return new Response(
        JSON.stringify({ 
          error: "AI services not configured. Please configure your API key in the Lessons page.",
          needsConfiguration: true 
        }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log('Analyzing paragraph:', paragraph.substring(0, 100) + '...');

    const systemPrompt = `You are an expert in academic writing. Analyze the paragraph and identify ALL academic patterns present.

Categories:
MOVES: ${MOVES_CATEGORIES.join(', ')}
GENERAL: ${GENERAL_CATEGORIES.join(', ')}

Instructions:
1. Find ALL patterns (typically 2-5)
2. For each pattern:
   - Type: "moves" or "general"
   - Category & subcategory
   - 3-5 templates from the text
   - 3-5 practice exercises

Return using the analyze_academic_paragraph function.`;

    const toolDefinition = [{
      type: "function",
      function: {
        name: "analyze_academic_paragraph",
        description: "Analyze paragraph and return ALL patterns found with structured analysis",
        parameters: {
          type: "object",
          required: ["patterns"],
          properties: {
            patterns: {
              type: "array",
              description: "All patterns identified in the paragraph",
              items: {
                type: "object",
                required: ["categoryType", "category", "subcategory", "templates", "exercises"],
                properties: {
                  categoryType: { 
                    type: "string", 
                    enum: ["moves", "general"],
                    description: "Whether this is a moves/steps or general language function"
                  },
                  category: { 
                    type: "string",
                    description: "The main category from the available categories"
                  },
                  subcategory: { 
                    type: "string",
                    description: "The specific subcategory or function within the main category"
                  },
                  templates: {
                    type: "array",
                    description: "3-5 extracted sentence templates",
                    items: {
                      type: "object",
                      required: ["original", "template", "explanation"],
                      properties: {
                        original: { type: "string", description: "The original sentence from the paragraph" },
                        template: { type: "string", description: "Template with placeholders" },
                        explanation: { type: "string", description: "How to use this template" }
                      }
                    }
                  },
                  exercises: {
                    type: "array",
                    description: "3-5 practice exercises",
                    items: {
                      type: "object",
                      required: ["instruction", "template", "hints"],
                      properties: {
                        instruction: { type: "string", description: "What the user should write about" },
                        template: { type: "string", description: "The template to use (with blanks if needed)" },
                        hints: { 
                          type: "array", 
                          items: { type: "string" },
                          description: "2-3 hints to help the user"
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }];

    // Try Kimi first
    let response;
    let responseData;
    let apiUsed = 'Kimi';

    try {
      console.log("Attempting analysis with Kimi API");
      response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${KIMI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'moonshot-v1-32k',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Analyze this academic paragraph:\n\n${paragraph}` }
          ],
          tools: toolDefinition,
          tool_choice: { type: "function", function: { name: "analyze_academic_paragraph" } },
        }),
      });

      if (!response.ok) {
        throw new Error(`Kimi API failed: ${response.status}`);
      }

      responseData = await response.json();
      console.log('Successfully analyzed with Kimi API');
    } catch (kimiError) {
      console.error('Kimi API failed, falling back to DeepSeek:', kimiError);
      apiUsed = 'DeepSeek';

      response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Analyze this academic paragraph:\n\n${paragraph}` }
          ],
          tools: toolDefinition,
          tool_choice: { type: "function", function: { name: "analyze_academic_paragraph" } },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('DeepSeek API error:', errorText);
        throw new Error(`Both APIs failed. DeepSeek status: ${response.status}`);
      }

      responseData = await response.json();
      console.log('Successfully analyzed with DeepSeek API');
    }

    console.log(`API response from ${apiUsed}:`, JSON.stringify(responseData));

    // Extract the tool call result
    const toolCall = responseData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error('No tool call in response');
    }

    const analysisResult = JSON.parse(toolCall.function.arguments);
    
    console.log('Analysis complete, found', analysisResult.patterns?.length || 0, 'patterns');

    return new Response(
      JSON.stringify(analysisResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-paragraph function:', error);
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
