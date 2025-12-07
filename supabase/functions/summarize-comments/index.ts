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
    const { comments } = await req.json();

    console.log("Generating summary for", comments.length, "comments");

    if (!comments || comments.length === 0) {
      return new Response(
        JSON.stringify({ summary: "No comments yet. Be the first to share your thoughts!" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
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

    // Prepare comments text for summarization
    const commentsText = comments.map((c: any) => 
      `${c.user_nickname} (${new Date(c.created_at).toLocaleString()}): ${c.comment_text}`
    ).join("\n\n");

    const systemPrompt = "You are a helpful assistant that creates concise summaries of user comments. Summarize the main themes, common topics, and overall sentiment in 2-3 sentences.";
    const userPrompt = `Please summarize these comments from the Academic Phrasebank exercises page:\n\n${commentsText}`;

    const result = await callAIProvider(config, {
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
    });

    console.log(`Summary generated successfully using ${result.provider}`);

    return new Response(
      JSON.stringify({ summary: result.content }),
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
