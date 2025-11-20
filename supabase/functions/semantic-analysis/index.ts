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
    const { text } = await req.json();
    const KIMI_API_KEY = Deno.env.get("KIMI_API_KEY");
    const DEEPSEEK_API_KEY = Deno.env.get("DEEPSEEK_API_KEY");

    if (!KIMI_API_KEY || !DEEPSEEK_API_KEY) {
      throw new Error("API keys not configured");
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

    // Try Kimi first
    let response;
    let data;
    let apiUsed = 'Kimi';

    try {
      console.log("Attempting analysis with Kimi API");
      response = await fetch("https://api.moonshot.cn/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${KIMI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "moonshot-v1-32k",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Analyze this text:\n\n${text}` }
          ],
          tools: toolDefinition,
          tool_choice: { type: "function", function: { name: "semantic_analysis" } }
        }),
      });

      if (!response.ok) {
        throw new Error(`Kimi API failed: ${response.status}`);
      }

      data = await response.json();
      console.log("Successfully analyzed with Kimi API");
    } catch (kimiError) {
      console.error("Kimi API failed, falling back to DeepSeek:", kimiError);
      apiUsed = 'DeepSeek';

      response = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Analyze this text:\n\n${text}` }
          ],
          tools: toolDefinition,
          tool_choice: { type: "function", function: { name: "semantic_analysis" } }
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("DeepSeek API error:", response.status, errorText);
        throw new Error(`Both APIs failed. DeepSeek status: ${response.status}`);
      }

      data = await response.json();
      console.log("Successfully analyzed with DeepSeek API");
    }

    console.log(`AI response from ${apiUsed}:`, JSON.stringify(data));

    // Extract the tool call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error("No tool call in response");
    }

    const analysis = JSON.parse(toolCall.function.arguments);

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