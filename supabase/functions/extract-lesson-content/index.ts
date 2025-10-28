import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      throw new Error('No file provided');
    }

    // Read file content
    const fileContent = await file.arrayBuffer();
    const base64Content = btoa(String.fromCharCode(...new Uint8Array(fileContent)));

    // Use Lovable AI to extract lesson content
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    
    const aiResponse = await fetch('https://api.lovable.app/v1/ai/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-5-mini',
        messages: [
          {
            role: 'system',
            content: `You are an educational content extraction assistant. Extract lesson information from documents and structure it according to these fields:
1. problem: What is the problem to solve and in what context?
2. audience: Who are the audience and learners?
3. undesirableSolutions: What are common undesirable solutions or behaviors?
4. framework: What is the framework for the new solution or supporting concepts?
5. howItWorks: How it works - step by step demo
6. practice: How should students practice?
7. reflection: How should students reflect?

Return ONLY a valid JSON object with these exact field names. If information for a field is not found, use an empty string.`
          },
          {
            role: 'user',
            content: `Extract lesson content from this document. File type: ${file.type}, File name: ${file.name}. Here is the content (base64): ${base64Content.substring(0, 10000)}`
          }
        ],
      }),
    });

    if (!aiResponse.ok) {
      throw new Error(`AI API error: ${aiResponse.statusText}`);
    }

    const aiData = await aiResponse.json();
    const extractedContent = aiData.choices[0].message.content;
    
    // Parse the JSON response
    let lessonData;
    try {
      // Remove markdown code blocks if present
      const jsonMatch = extractedContent.match(/\{[\s\S]*\}/);
      lessonData = JSON.parse(jsonMatch ? jsonMatch[0] : extractedContent);
    } catch (e) {
      console.error('Failed to parse AI response:', e);
      throw new Error('Failed to parse lesson content from document');
    }

    return new Response(JSON.stringify(lessonData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in extract-lesson-content:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
