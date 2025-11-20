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
    const KIMI_API_KEY = Deno.env.get('KIMI_API_KEY');
    const DEEPSEEK_API_KEY = Deno.env.get('DEEPSEEK_API_KEY');

    const systemPrompt = `You are an educational content extraction assistant. Extract lesson information from documents and structure it according to these fields:
1. problem: What is the problem to solve and in what context?
2. audience: Who are the audience and learners?
3. undesirableSolutions: What are common undesirable solutions or behaviors?
4. framework: What is the framework for the new solution or supporting concepts?
5. howItWorks: How it works - step by step demo
6. practice: How should students practice?
7. reflection: How should students reflect?

Return ONLY a valid JSON object with these exact field names. If information for a field is not found, use an empty string.`;

    const userContent = `Extract lesson content from this document. File type: ${file.type}, File name: ${file.name}. Here is the content (base64): ${base64Content.substring(0, 10000)}`;

    let extractedContent: string;
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
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userContent }
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
      extractedContent = kimiData.choices[0].message.content;
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
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userContent }
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
      extractedContent = deepseekData.choices[0].message.content;
      console.log("Successfully used DeepSeek API");
    }

    console.log(`Extracted content using ${usedModel}`);
    
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
