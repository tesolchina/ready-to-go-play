const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestStart = Date.now();
    const { nickname, learningObjectives, activeExploration, aiSupport, feedbackMechanisms, diverseNeeds } =
      await req.json();

    console.log("Generating activity design for participant:", nickname);
    
    // Set timeout to prevent function from running too long
    const timeoutMs = 120000; // 120 seconds (before 150s edge function limit)
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Request timeout")), timeoutMs);
    });

    // Input validation
    if (!nickname?.trim() || !learningObjectives?.trim() || !activeExploration?.trim() || !aiSupport?.trim()) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (nickname.length > 50) {
      return new Response(
        JSON.stringify({ error: "Nickname too long" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const prompt = `You are an expert educational designer specializing in AI-enhanced interactive learning activities.

Create a detailed activity design for participant: ${nickname}

Activity Details:
- Learning Objectives: ${learningObjectives}
- Active Exploration: ${activeExploration}
- AI Support: ${aiSupport}
- Feedback Mechanisms: ${feedbackMechanisms || "Not specified"}
- Diverse Needs: ${diverseNeeds || "Not specified"}

IMPORTANT: Respond ONLY with valid JSON in this exact format (no markdown, no code blocks):
{
  "flowchart": "graph TD\\n    A[Start] --> B[Next Step]\\n    B --> C[End]",
  "systemPrompt": "You are an AI teaching assistant..."
}

The flowchart MUST:
- Use valid Mermaid syntax (graph TD or graph LR)
- Show 5-8 main steps in the learning journey
- Use simple node labels (no special characters that break Mermaid)
- Include where AI provides support
- Show decision points and feedback loops

The systemPrompt MUST:
- Be 200-400 words
- Define the AI's specific role
- Include the learning objectives
- Specify how to provide personalized feedback
- Include guidelines for different proficiency levels`;

    const KIMI_API_KEY = Deno.env.get("KIMI_API_KEY");
    const DEEPSEEK_API_KEY = Deno.env.get("DEEPSEEK_API_KEY");

    let result: string | undefined;
    let usedModel = "Kimi";

    // Wrap API calls with timeout
    const generateWithTimeout = async () => {
      // Try Kimi first
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
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
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

        // Fallback to DeepSeek
        const deepseekResponse = await fetch("https://api.deepseek.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
          },
          body: JSON.stringify({
            model: "deepseek-chat",
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
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

    // Race between API call and timeout
    await Promise.race([generateWithTimeout(), timeoutPromise]);

    if (!result) {
      throw new Error("No result received from AI");
    }

    // Parse the JSON response - try multiple approaches
    let parsedResult;
    
    try {
      // Try direct parse first
      parsedResult = JSON.parse(result);
    } catch {
      // Try to extract JSON from markdown code blocks
      const codeBlockMatch = result.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
      if (codeBlockMatch) {
        parsedResult = JSON.parse(codeBlockMatch[1]);
      } else {
        // Try to find any JSON object
        const jsonMatch = result.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedResult = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("Could not parse JSON from AI response");
        }
      }
    }

    // Validate the response structure
    if (!parsedResult.flowchart || !parsedResult.systemPrompt) {
      throw new Error("Invalid response structure from AI");
    }

    const requestTime = Date.now() - requestStart;
    console.log(`Successfully generated activity design using ${usedModel} in ${requestTime}ms`);

    return new Response(JSON.stringify(parsedResult), {
      headers: { 
        ...corsHeaders, 
        "Content-Type": "application/json",
        "X-Processing-Time": requestTime.toString(),
      },
    });
  } catch (error) {
    console.error("Error in generate-activity-design function:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to generate activity design";
    
    // Return 429 for rate limits, 504 for timeouts
    let status = 500;
    if (errorMessage.includes("timeout") || errorMessage.includes("Request timeout")) {
      status = 504;
    } else if (errorMessage.includes("rate limit") || errorMessage.includes("429")) {
      status = 429;
    }
    
    return new Response(
      JSON.stringify({
        error: errorMessage,
      }),
      {
        status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
