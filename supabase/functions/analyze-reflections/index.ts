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

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

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

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
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
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to generate analysis");
    }

    const data = await response.json();
    let analysis = data.choices?.[0]?.message?.content || "Unable to generate analysis";

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
