import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

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

    console.log('Analyzing paragraph:', paragraph.substring(0, 100) + '...');

    const systemPrompt = `You are an expert in academic writing analysis. Your task is to comprehensively analyze the provided paragraph and identify EVERY academic writing pattern present.

Available Categories:
MOVES/STEPS: ${MOVES_CATEGORIES.join(', ')}
GENERAL FUNCTIONS: ${GENERAL_CATEGORIES.join(', ')}

CRITICAL INSTRUCTIONS:
1. You MUST identify ALL patterns present in the paragraph, not just one or the dominant pattern
2. A single paragraph typically contains MULTIPLE patterns - look for ALL of them
3. Examine the text thoroughly for different writing functions that may overlap
4. For each distinct pattern you identify:
   - Specify whether it's a "moves" or "general" category type
   - Identify the specific category from the lists above
   - Determine the precise subcategory
   - Extract 3-5 sentence templates showing how this pattern is used
   - Create 3-5 practice exercises for this pattern
5. Return a comprehensive array with ALL patterns found - aim for 2-5 patterns typically

EXAMPLE: A paragraph discussing research findings might contain:
- "Reporting results" (moves) - describing what was found
- "Describing quantities" (general) - numerical data presentation  
- "Being cautious" (general) - hedging language
- "Explaining causality" (general) - cause-effect relationships

Return your complete analysis using the analyze_academic_paragraph function with ALL patterns found.`;

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
          { role: 'user', content: `Analyze this academic paragraph:\n\n${paragraph}` }
        ],
        tools: [{
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
        }],
        tool_choice: { type: "function", function: { name: "analyze_academic_paragraph" } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI API error:', errorText);
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('Lovable AI response:', JSON.stringify(data));

    // Extract the tool call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error('No tool call in response');
    }

    const analysisResult = JSON.parse(toolCall.function.arguments);
    
    console.log('Analysis result:', JSON.stringify(analysisResult));

    return new Response(
      JSON.stringify(analysisResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-paragraph function:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});