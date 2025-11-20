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
    const { comments } = await req.json();

    console.log("Generating summary for", comments.length, "comments");

    if (!comments || comments.length === 0) {
      return new Response(
        JSON.stringify({ summary: "No comments yet. Be the first to share your thoughts!" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const KIMI_API_KEY = Deno.env.get("KIMI_API_KEY");
    const DEEPSEEK_API_KEY = Deno.env.get("DEEPSEEK_API_KEY");
    
    if (!KIMI_API_KEY || !DEEPSEEK_API_KEY) {
      throw new Error("API keys not configured");
    }

    // Prepare comments text for summarization
    const commentsText = comments.map((c: any) => 
      `${c.user_nickname} (${new Date(c.created_at).toLocaleString()}): ${c.comment_text}`
    ).join("\n\n");

    const systemPrompt = "You are a helpful assistant that creates concise summaries of user comments. Summarize the main themes, common topics, and overall sentiment in 2-3 sentences.";
    const userPrompt = `Please summarize these comments from the Academic Phrasebank exercises page:\n\n${commentsText}`;

    // Try Kimi first
    let response;
    let data;
    let apiUsed = 'Kimi';

    try {
      console.log("Attempting summary with Kimi API");
      response = await fetch("https://api.moonshot.cn/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${KIMI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "moonshot-v1-32k",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Kimi API failed: ${response.status}`);
      }

      data = await response.json();
      console.log("Successfully generated summary with Kimi API");
    } catch (kimiError) {
      console.error("Kimi API failed, falling back to DeepSeek:", kimiError);
      apiUsed = 'DeepSeek';

      response = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("DeepSeek API error:", response.status, errorText);
        throw new Error(`Both APIs failed. DeepSeek status: ${response.status}`);
      }

      data = await response.json();
      console.log("Successfully generated summary with DeepSeek API");
    }

    const summary = data.choices[0].message.content;
    console.log(`Summary generated successfully using ${apiUsed}`);

    console.log("Summary generated successfully");

    return new Response(
      JSON.stringify({ summary }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in summarize-comments function:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to generate summary";

    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
