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
    const { text } = await req.json();
    
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

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid text provided" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Performing semantic analysis on text:", text.substring(0, 100));

    const toolDefinition = [{
      type: "function",
      function: {
        name: "semantic_analysis",
        description: "Extract semantic analysis from text",
        parameters: {
          type: "object",
          properties: {
            sentiment: { 
              type: "string",
              enum: ["positive", "negative", "neutral"]
            },
            key_themes: {
              type: "array",
              items: { type: "string" },
              maxItems: 5
            },
            word_count: { type: "number" }
          },
          required: ["sentiment", "key_themes", "word_count"],
          additionalProperties: false
        }
      }
    }];

    const systemPrompt = "You are a semantic analysis expert. Analyze the given text and extract: 1) sentiment (positive/negative/neutral), 2) up to 5 key themes as an array, 3) word count. Return ONLY valid JSON with these exact fields: sentiment, key_themes (array of strings), word_count (number).";

    const result = await callAIProvider(config, {
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Analyze this text:\n\n${text}` }
      ],
      tools: toolDefinition,
      toolChoice: { type: "function", function: { name: "semantic_analysis" } }
    });

    console.log(`Analysis completed using ${result.provider}`);

    // Extract the tool call result
    if (result.toolCalls && result.toolCalls.length > 0) {
      const toolCall = result.toolCalls[0];
      const analysis = JSON.parse(toolCall.function.arguments);
      return new Response(
        JSON.stringify(analysis),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fallback: try to parse content as JSON
    const analysis = JSON.parse(result.content);
    return new Response(
      JSON.stringify(analysis),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error in semantic-analysis function:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error occurred"
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
