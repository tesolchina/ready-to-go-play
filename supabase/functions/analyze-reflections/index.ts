import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.76.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { lessonSlug, sectionId, questionId, question } = await req.json();

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all responses for this question from database
    const { data: responseData, error: fetchError } = await supabase
      .from("lesson_interactions")
      .select("response_option")
      .eq("lesson_slug", lessonSlug)
      .eq("section_id", sectionId)
      .eq("question_id", questionId);

    if (fetchError) {
      console.error("Error fetching responses:", fetchError);
      throw fetchError;
    }

    const responses = responseData?.map((r) => r.response_option) || [];

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

    // Store analysis in database (upsert)
    const { error: upsertError } = await supabase
      .from("reflection_analyses")
      .upsert({
        lesson_slug: lessonSlug,
        section_id: sectionId,
        question_id: questionId,
        question: question,
        analysis: analysis,
        response_count: totalCount,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: "lesson_slug,section_id,question_id"
      });

    if (upsertError) {
      console.error("Error storing analysis:", upsertError);
      // Continue anyway, return the analysis even if storage failed
    }

    return new Response(
      JSON.stringify({ analysis, response_count: totalCount }),
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
