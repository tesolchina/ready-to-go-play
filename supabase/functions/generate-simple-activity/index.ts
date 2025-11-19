import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestStart = Date.now();
    const { nickname, argument, feedbackGuidance } = await req.json();

    console.log("Generating activity for participant:", nickname);

    // Input validation
    if (!nickname?.trim() || !argument?.trim()) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (nickname.length > 50 || argument.length > 1000) {
      return new Response(
        JSON.stringify({ error: "Input too long" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const timeoutMs = 120000;
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Request timeout")), timeoutMs);
    });

    const prompt = `You are an expert educational designer. Create a system prompt for an AI teaching assistant that will provide feedback on student counter-arguments.

Activity created by: ${nickname}

The argument students will respond to:
"${argument}"

Feedback guidance: ${feedbackGuidance || "Be encouraging and specific"}

Create a comprehensive system prompt (200-300 words) that:
1. Defines the AI's role as a supportive teaching assistant
2. Explains how to evaluate counter-arguments (logic, evidence, clarity)
3. Specifies the tone (encouraging, constructive, specific)
4. Includes the feedback guidance provided
5. Instructs the AI to point out both strengths and areas for improvement

Respond ONLY with the system prompt text, no JSON formatting or code blocks.`;

    const KIMI_API_KEY = Deno.env.get("KIMI_API_KEY");
    const DEEPSEEK_API_KEY = Deno.env.get("DEEPSEEK_API_KEY");

    let result: string | undefined;
    let usedModel = "Kimi";

    const generateWithTimeout = async () => {
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
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
          }),
        });

        if (!kimiResponse.ok) {
          const errorText = await kimiResponse.text();
          console.error("Kimi API error:", errorText);
          throw new Error(`Kimi API failed: ${kimiResponse.status}`);
        }

        const kimiData = await kimiResponse.json();
        result = kimiData.choices[0].message.content;
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
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
          }),
        });

        if (!deepseekResponse.ok) {
          const errorText = await deepseekResponse.text();
          console.error("DeepSeek API error:", errorText);
          throw new Error(`DeepSeek API failed: ${deepseekResponse.status}`);
        }

        const deepseekData = await deepseekResponse.json();
        result = deepseekData.choices[0].message.content;
        console.log("Successfully used DeepSeek API");
      }
    };

    await Promise.race([generateWithTimeout(), timeoutPromise]);

    if (!result) {
      throw new Error("No result received from AI");
    }

    const requestTime = Date.now() - requestStart;
    console.log(`Successfully generated system prompt using ${usedModel} in ${requestTime}ms`);

    return new Response(
      JSON.stringify({ systemPrompt: result.trim() }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "X-Processing-Time": requestTime.toString(),
        },
      }
    );
  } catch (error) {
    console.error("Error in generate-simple-activity function:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to generate system prompt";

    let status = 500;
    if (errorMessage.includes("timeout") || errorMessage.includes("Request timeout")) {
      status = 504;
    } else if (errorMessage.includes("rate limit") || errorMessage.includes("429")) {
      status = 429;
    }

    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
