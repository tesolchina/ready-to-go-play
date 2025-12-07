import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getAIProviderConfig, hasAIProvider, callAIProvider } from "../_shared/ai-providers.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-platform-session, x-user-kimi-key, x-user-deepseek-key",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { systemPrompt, userMessage, chatHistory } = await req.json();

    console.log("Processing chat message for simple activity");

    if (!systemPrompt || !userMessage) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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

    // Build messages array with chat history
    const messages = [
      { role: "system" as const, content: systemPrompt },
      ...chatHistory.map((msg: any) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
      { role: "user" as const, content: userMessage },
    ];

    const result = await callAIProvider(config, {
      messages,
      temperature: 0.7,
    });

    console.log(`Chat response received using ${result.provider}`);

    return new Response(
      JSON.stringify({ feedback: result.content }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in simple-activity-chat function:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to process chat message";

    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
