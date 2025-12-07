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
6. CRITICAL: Instructs the AI to keep all feedback responses under 500 characters

Respond ONLY with the system prompt text, no JSON formatting or code blocks.`;

    const generateWithTimeout = async () => {
      const result = await callAIProvider(config, {
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      });
      return result;
    };

    const result = await Promise.race([generateWithTimeout(), timeoutPromise]) as { content: string; provider: string };

    if (!result?.content) {
      throw new Error("No result received from AI");
    }

    const requestTime = Date.now() - requestStart;
    console.log(`Successfully generated system prompt using ${result.provider} in ${requestTime}ms`);

    return new Response(
      JSON.stringify({ systemPrompt: result.content.trim() }),
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
