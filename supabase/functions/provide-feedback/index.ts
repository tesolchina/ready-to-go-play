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
    const KIMI_API_KEY = Deno.env.get("KIMI_API_KEY");
    const DEEPSEEK_API_KEY = Deno.env.get("DEEPSEEK_API_KEY");

    const defaultSystemPrompt = 'You are an expert educational AI assistant providing thoughtful, constructive feedback on student work. Be encouraging while offering specific suggestions for improvement. Keep your response concise - maximum 500 characters.';
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

    let feedback: string;
    let usedModel = "Kimi";

    try {
      console.log("Attempting to use Kimi API");
      const kimiResponse = await fetch("https://api.moonshot.cn/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${KIMI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "moonshot-v1-8k",
          messages,
          temperature: 0.7,
        }),
      });

      if (!kimiResponse.ok) {
        const errorText = await kimiResponse.text();
        console.error("Kimi API error:", errorText);
        throw new Error(`Kimi API failed: ${kimiResponse.status}`);
      }

      const kimiData = await kimiResponse.json();
      feedback = kimiData.choices?.[0]?.message?.content || "Unable to generate feedback";
      console.log("Successfully used Kimi API");
    } catch (kimiError) {
      console.error("Kimi API failed, falling back to DeepSeek:", kimiError);
      usedModel = "DeepSeek";

      const deepseekResponse = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages,
          temperature: 0.7,
        }),
      });

      if (!deepseekResponse.ok) {
        const errorText = await deepseekResponse.text();
        console.error("DeepSeek API error:", errorText);
        throw new Error(`Both Kimi and DeepSeek APIs failed`);
      }

      const deepseekData = await deepseekResponse.json();
      feedback = deepseekData.choices?.[0]?.message?.content || "Unable to generate feedback";
      console.log("Successfully used DeepSeek API");
    }

    console.log(`Generated feedback using ${usedModel}`);
    
    // Truncate to 500 characters if needed
    if (feedback.length > 500) {
      feedback = feedback.substring(0, 497) + "...";
    }

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
