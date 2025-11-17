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
    const { text, action, topic, outputType } = await req.json();
    const ALIYUN_API_KEY = Deno.env.get('ALIYUN_API_KEY');

    if (!ALIYUN_API_KEY) {
      throw new Error('ALIYUN_API_KEY not configured');
    }

    let systemPrompt = '';
    let userPrompt = '';

    if (action === 'analyze') {
      systemPrompt = `You are an expert writing analyst. Analyze the given text and identify ONLY its overall structure and organization WITHOUT discussing the specific content or topic. 

Focus exclusively on:
- Overall structure and organization (how many main sections, how they connect)
- How the sections are arranged and flow from one to another
- The logical progression of the text
- How ideas are introduced, developed, and concluded at a structural level
- Thematic connections between sections

Provide a clear, structured analysis with:
1. A brief introductory statement about the organizational approach
2. A numbered list of the main structural sections
3. A concluding statement about how the sections connect

Use markdown formatting for better readability. Do NOT analyze rhetorical devices, sentence structure, tone, or voice.`;
      userPrompt = `Analyze ONLY the overall structure and organization of this text:\n\n${text}`;
    } else if (action === 'generate') {
      systemPrompt = `You are a creative writing assistant. Generate ${outputType === 'essay' ? 'a complete essay' : 'a detailed outline'} on the given topic using the identified patterns. Maintain the same structure, rhetorical devices, and organizational approach, but apply them to the new topic.`;
      userPrompt = `Using these identified patterns:\n\n${text}\n\nGenerate ${outputType === 'essay' ? 'a complete essay' : 'a detailed outline'} on the topic: "${topic}"`;
    }

    console.log('Pattern analyzer action (Aliyun AI):', action);

    const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ALIYUN_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'qwen-plus',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Aliyun API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw new Error(`Aliyun API request failed: ${response.status}`);
    }

    const data = await response.json();
    const result = data.choices[0].message.content;

    console.log('Pattern analyzer result generated successfully (Aliyun AI)');

    return new Response(
      JSON.stringify({ result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in pattern-analyzer function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});