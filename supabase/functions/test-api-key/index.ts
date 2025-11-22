import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { provider, apiKey } = await req.json();

    if (!provider || !apiKey) {
      return new Response(
        JSON.stringify({ valid: false, error: "Provider and API key are required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const endpoint = provider === "kimi" 
      ? "https://api.moonshot.cn/v1/chat/completions"
      : "https://api.deepseek.com/v1/chat/completions";
    
    const model = provider === "kimi" ? "moonshot-v1-8k" : "deepseek-chat";

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey.trim()}`
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: "test" }],
        max_tokens: 5
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`${provider} API test failed:`, response.status, errorText);
      
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: `API key validation failed: ${response.status}`,
          details: errorText
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    await response.json(); // Consume response

    return new Response(
      JSON.stringify({ valid: true, provider }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error testing API key:', error);
    return new Response(
      JSON.stringify({ 
        valid: false, 
        error: error instanceof Error ? error.message : "Unknown error"
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
