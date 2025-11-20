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
    const { responses, question } = await req.json();

    if (!responses || !Array.isArray(responses) || responses.length === 0) {
      return new Response(
        JSON.stringify({ error: "No responses provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const KIMI_API_KEY = Deno.env.get("KIMI_API_KEY");
    const DEEPSEEK_API_KEY = Deno.env.get("DEEPSEEK_API_KEY");

    // Prepare responses summary (limit to prevent token overflow)
    const responseSample = responses.slice(0, 50).join("\n- ");
    const totalCount = responses.length;

    const prompt = `You are analyzing student reflections for the question: "${question}"

Total responses: ${totalCount}

Sample responses:
- ${responseSample}

Provide a thematic analysis (maximum 400 characters) that:
1. Identifies 2-3 main themes or patterns
2. Notes any interesting insights or common challenges
3. Highlights areas of consensus or disagreement

Be concise and focus on actionable insights for the teacher.`;

    let analysis: string;
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
          messages: [
            {
              role: "system",
              content: "You are an educational analyst providing concise thematic analysis of student reflections.",
            },
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
      analysis = kimiData.choices?.[0]?.message?.content || "Unable to generate analysis";
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
          messages: [
            {
              role: "system",
              content: "You are an educational analyst providing concise thematic analysis of student reflections.",
            },
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
        throw new Error(`Both Kimi and DeepSeek APIs failed`);
      }

      const deepseekData = await deepseekResponse.json();
      analysis = deepseekData.choices?.[0]?.message?.content || "Unable to generate analysis";
      console.log("Successfully used DeepSeek API");
    }

    console.log(`Generated analysis using ${usedModel}`);

    // Truncate if needed
    if (analysis.length > 400) {
      analysis = analysis.substring(0, 397) + "...";
    }

    return new Response(
      JSON.stringify({ analysis }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in analyze-reflections function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
