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
    const { userMessage, chatHistory } = await req.json();
    
    const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');
    if (!OPENROUTER_API_KEY) {
      throw new Error('OPENROUTER_API_KEY is not configured');
    }

    const systemPrompt = `You are an expert AI assistant helping workshop participants explore how they can leverage API technology to automate repetitive tasks in their teaching and research.

Your role is to help participants think through their use cases using the Input-Process-Output framework:
- **Input**: What files, documents, or data will be processed?
- **Process**: What should the AI do with each item? (analyze, summarize, extract, categorize, generate, etc.)
- **Output**: What format and structure should the results be in? (CSV, documents, reports, etc.)

When participants describe their use case:
1. Ask clarifying questions if needed to understand their specific context
2. Suggest a concrete Input-Process-Output workflow
3. Recommend what kind of prompt they might use
4. Estimate potential time savings compared to manual work
5. Mention any considerations or limitations

Keep responses concise but helpful. Use bullet points and structured formatting for clarity.
Be encouraging and practical - focus on achievable automation workflows.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(chatHistory || []),
      { role: 'user', content: userMessage }
    ];

    console.log('Calling OpenRouter with Claude Sonnet 4...');
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://eapteacher.smartutor.me',
        'X-Title': 'AI Agent Workshop'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-sonnet-4',
        messages: messages,
        max_tokens: 1500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, errorText);
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';

    console.log('Successfully received response from Claude Sonnet 4');

    return new Response(JSON.stringify({ 
      response: assistantMessage,
      model: 'anthropic/claude-sonnet-4'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in workshop-use-case-chat:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
