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
    const { messages, category, subcategory, discipline } = await req.json();
    const DEEPSEEK_API_KEY = Deno.env.get("DEEPSEEK_API_KEY");

    if (!DEEPSEEK_API_KEY) {
      throw new Error("DEEPSEEK_API_KEY is not configured");
    }

    // Build system prompt based on category and discipline
    let systemPrompt = `You are an Academic PhraseBank assistant. Your role is to help students and researchers with academic writing by providing appropriate phrases, sentence structures, and language patterns commonly used in academic contexts.

You specialize in:
- Introducing ideas and research
- Describing methods and procedures
- Presenting results and findings
- Discussing implications and conclusions
- Citing and referencing
- Hedging and cautious language
- Transitions and signposting

Provide clear, contextual examples and explain when certain phrases are most appropriate. Always maintain an academic, professional tone.`;

    // Enhance system prompt with category and discipline context
    if (category) {
      systemPrompt += `\n\nFocus specifically on: ${category}`;
    }

    if (subcategory) {
      systemPrompt += `\n\nWithin this category, emphasize: ${subcategory}`;
    }

    if (discipline) {
      systemPrompt += `\n\nProvide examples relevant to the discipline of: ${discipline}`;
    }

    console.log("Calling DeepSeek API with messages:", messages?.length || 0, "category:", category);

    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          ...(messages || [])
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("DeepSeek API error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to get response from DeepSeek API" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content || "Unable to generate response";

    console.log("DeepSeek response received successfully");

    return new Response(
      JSON.stringify({ message: assistantMessage }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in academic-phrasebank-chat function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
