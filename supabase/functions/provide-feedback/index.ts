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
    const { userPrompt, userInputs, conversationHistory, systemPrompt } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const defaultSystemPrompt = 'You are an expert educational AI assistant providing thoughtful, constructive feedback on student work. Be encouraging while offering specific suggestions for improvement.';
    const actualSystemPrompt = systemPrompt || defaultSystemPrompt;
    
    // Build messages array
    let messages;
    if (conversationHistory && conversationHistory.length > 0) {
      // This is a follow-up conversation
      messages = [
        { role: 'system', content: actualSystemPrompt },
        ...conversationHistory,
        { role: 'user', content: userPrompt }
      ];
    } else if (userInputs) {
      // Initial submission with structured inputs
      const formattedInput = Object.entries(userInputs)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n\n');
      
      messages = [
        { role: 'system', content: actualSystemPrompt },
        { role: 'user', content: formattedInput }
      ];
    } else {
      // Fallback for legacy format
      messages = [
        { role: 'system', content: actualSystemPrompt },
        { role: 'user', content: userPrompt }
      ];
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to get AI feedback" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const feedback = data.choices?.[0]?.message?.content || "Unable to generate feedback";

    return new Response(
      JSON.stringify({ feedback }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in provide-feedback function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
