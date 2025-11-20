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
    const { description } = await req.json();
    const KIMI_API_KEY = Deno.env.get('KIMI_API_KEY');
    const DEEPSEEK_API_KEY = Deno.env.get('DEEPSEEK_API_KEY');

    const systemPrompt = `You are an expert at creating mermaid diagrams for academic writing structure analysis. 

When analyzing text:
- Focus on HIGH-LEVEL structure and organization, not minute details
- Identify PARALLEL and COMPARABLE themes or sections
- Show how major ideas relate and flow to each other
- For essays: identify main sections, thesis, body themes, and conclusion
- For paragraphs: show topic sentence, supporting ideas, and concluding statement
- Use simple, clear node labels (avoid long text in nodes)
- Keep the diagram focused on structure, not content details

Diagram guidelines:
- Use flowchart (graph TD or graph LR) for structure visualization
- Maximum 8-12 nodes for essay level, 5-8 nodes for paragraph level
- Show relationships between parallel themes
- Only return the raw mermaid code (no markdown blocks, no "mermaid" prefix)`;


    let mermaidCode: string;
    let usedModel = "DeepSeek";

    try {
      console.log("Attempting to use DeepSeek API");
      const deepseekResponse = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: description }
          ],
          temperature: 0.7,
        }),
      });

      if (!deepseekResponse.ok) {
        const errorText = await deepseekResponse.text();
        console.error("DeepSeek API error:", errorText);
        throw new Error(`DeepSeek API failed: ${deepseekResponse.status}`);
      }

      const deepseekData = await deepseekResponse.json();
      mermaidCode = deepseekData.choices[0].message.content.trim();
      console.log("Successfully used DeepSeek API");
    } catch (deepseekError) {
      console.error("DeepSeek API failed, falling back to Kimi:", deepseekError);
      usedModel = "Kimi";

      const kimiResponse = await fetch("https://api.moonshot.cn/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${KIMI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "moonshot-v1-8k",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: description }
          ],
          temperature: 0.7,
        }),
      });

      if (!kimiResponse.ok) {
        const errorText = await kimiResponse.text();
        console.error("Kimi API error:", errorText);
        throw new Error(`Both DeepSeek and Kimi APIs failed`);
      }

      const kimiData = await kimiResponse.json();
      mermaidCode = kimiData.choices[0].message.content.trim();
      console.log("Successfully used Kimi API");
    }

    // Clean up the mermaid code - remove markdown code blocks and "mermaid" prefix if present
    mermaidCode = mermaidCode
      .replace(/```mermaid\n?/g, '')
      .replace(/```\n?$/g, '')
      .replace(/^mermaid\s*\n/i, '')  // Remove "mermaid" word at the start
      .trim();
    
    console.log(`Generated mermaid code using ${usedModel}:`, mermaidCode.substring(0, 100));

    return new Response(
      JSON.stringify({ mermaidCode }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-mermaid function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
