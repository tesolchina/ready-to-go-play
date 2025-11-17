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
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    let systemPrompt = '';
    let userPrompt = '';

    if (action === 'analyze') {
      systemPrompt = `You are an expert writing analyst. Analyze the given text and identify its structural patterns, rhetorical devices, and organizational strategies WITHOUT discussing the specific content or topic. Focus on:
- Overall structure and organization (how many main sections, how they connect)
- Paragraph patterns (topic sentences, development, transitions)
- Rhetorical devices and techniques
- Sentence structure patterns
- How ideas are introduced, developed, and concluded
- Use of examples, explanations, or evidence
- Tone and voice patterns

Provide a clear, structured analysis that can be used as a template for writing on any topic.`;
      userPrompt = `Analyze the structural patterns and writing techniques in this text:\n\n${text}`;
    } else if (action === 'generate') {
      systemPrompt = `You are a creative writing assistant. Generate ${outputType === 'essay' ? 'a complete essay' : 'a detailed outline'} on the given topic using the identified patterns. Maintain the same structure, rhetorical devices, and organizational approach, but apply them to the new topic.`;
      userPrompt = `Using these identified patterns:\n\n${text}\n\nGenerate ${outputType === 'essay' ? 'a complete essay' : 'a detailed outline'} on the topic: "${topic}"`;
    }

    console.log('Pattern analyzer action:', action);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to your Lovable AI workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw new Error(`AI API request failed: ${response.status}`);
    }

    const data = await response.json();
    const result = data.choices[0].message.content;

    console.log('Pattern analyzer result generated successfully');

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