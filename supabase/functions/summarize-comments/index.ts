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

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Prepare comments text for summarization
    const commentsText = comments.map((c: any) => 
      `${c.user_nickname} (${new Date(c.created_at).toLocaleString()}): ${c.comment_text}`
    ).join("\n\n");

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
            content: "You are a helpful assistant that creates concise summaries of user comments. Summarize the main themes, common topics, and overall sentiment in 2-3 sentences." 
          },
          { 
            role: "user", 
            content: `Please summarize these comments from the Academic Phrasebank exercises page:\n\n${commentsText}` 
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to generate summary");
    }

    const data = await response.json();
    const summary = data.choices[0].message.content;

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
