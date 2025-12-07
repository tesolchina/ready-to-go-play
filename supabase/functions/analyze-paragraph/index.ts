import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getAIProviderConfig, hasAIProvider, callAIProvider } from "../_shared/ai-providers.ts";

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

    const result = await callAIProvider(config, {
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Analyze this academic paragraph:\n\n${paragraph}` }
      ],
      tools: toolDefinition,
      toolChoice: { type: "function", function: { name: "analyze_academic_paragraph" } },
    });

    console.log(`Analysis completed using ${result.provider}`);

    // Extract the tool call result
    if (result.toolCalls && result.toolCalls.length > 0) {
      const toolCall = result.toolCalls[0];
      const analysisResult = JSON.parse(toolCall.function.arguments);
      console.log('Analysis complete, found', analysisResult.patterns?.length || 0, 'patterns');

      return new Response(
        JSON.stringify(analysisResult),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    throw new Error('No tool call in response');

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
