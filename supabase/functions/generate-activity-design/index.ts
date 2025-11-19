import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { nickname, learningObjectives, activeExploration, aiSupport, feedbackMechanisms, diverseNeeds } =
      await req.json();

    console.log("Generating activity design for:", nickname);

    const prompt = `You are an expert educational designer specializing in AI-enhanced interactive learning activities.

Given the following activity design inputs, create:
1. A detailed Mermaid flowchart showing the learning workflow
2. A comprehensive system prompt for an AI chatbot that will support this activity

Activity Details:
- Nickname: ${nickname}
- Learning Objectives: ${learningObjectives}
- Active Exploration: ${activeExploration}
- AI Support: ${aiSupport}
- Feedback Mechanisms: ${feedbackMechanisms || "Not specified"}
- Diverse Needs: ${diverseNeeds || "Not specified"}

Please provide your response in the following JSON format:
{
  "flowchart": "graph TD\\n    A[Start] --> B[Step]\\n    ...",
  "systemPrompt": "You are an AI teaching assistant for..."
}

The flowchart should:
- Use Mermaid syntax (graph TD or graph LR)
- Show the complete student learning journey
- Include decision points and feedback loops
- Highlight where AI intervention occurs

The system prompt should:
- Define the AI's role clearly
- Include specific pedagogical strategies
- Reference the learning objectives
- Specify how to provide feedback
- Include guidelines for personalization`;

    const KIMI_API_KEY = Deno.env.get("KIMI_API_KEY");
    const DEEPSEEK_API_KEY = Deno.env.get("DEEPSEEK_API_KEY");

    let result;
    let usedModel = "Kimi";

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

    // Parse the JSON response
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse JSON from AI response");
    }

    const parsedResult = JSON.parse(jsonMatch[0]);
    console.log(`Successfully generated activity design using ${usedModel}`);

    return new Response(JSON.stringify(parsedResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-activity-design function:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Failed to generate activity design",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
