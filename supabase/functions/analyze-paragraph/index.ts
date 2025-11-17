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

    const systemPrompt = `You are an expert in academic writing analysis. Analyze the provided paragraph from a journal article.

Available Categories:
MOVES/STEPS: ${MOVES_CATEGORIES.join(', ')}
GENERAL FUNCTIONS: ${GENERAL_CATEGORIES.join(', ')}

Your task:
1. Identify which category type (moves or general) and specific category best matches the paragraph's function
2. Identify the subcategory within that category
3. Extract 3-5 reusable sentence templates by replacing specific content with placeholders like [topic], [author], [finding], [method], etc.
4. Create 3-5 practice exercises where users can practice using these templates

Return your analysis using the analyze_academic_paragraph function.`;

    const response = await fetch('https://api.lovable.dev/v1/chat/completions', {
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
            description: "Analyze paragraph and return structured analysis with templates and exercises",
            parameters: {
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
                      template: { type: "string", description: "The generalized template with placeholders" },
                      explanation: { type: "string", description: "Brief explanation of when to use this template" }
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