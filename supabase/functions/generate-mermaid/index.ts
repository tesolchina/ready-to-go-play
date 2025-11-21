import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-platform-session, x-user-kimi-key, x-user-deepseek-key',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { description } = await req.json();
    
    // Get API keys from environment variables (platform keys)
    let KIMI_API_KEY = Deno.env.get('KIMI_API_KEY');
    let DEEPSEEK_API_KEY = Deno.env.get('DEEPSEEK_API_KEY');

    // Check for platform session in headers
    const platformSession = req.headers.get("x-platform-session");
    const hasPlatformAccess = !!platformSession;

    // If no platform access, use user-provided keys from headers
    if (!hasPlatformAccess) {
      const userKimiKey = req.headers.get("x-user-kimi-key");
      const userDeepseekKey = req.headers.get("x-user-deepseek-key");
      
      if (userKimiKey) KIMI_API_KEY = userKimiKey;
      if (userDeepseekKey) DEEPSEEK_API_KEY = userDeepseekKey;
    }

    if (!KIMI_API_KEY && !DEEPSEEK_API_KEY) {
      return new Response(
        JSON.stringify({ 
          error: "AI services not configured. Please configure your API key in the Lessons page.",
          needsConfiguration: true 
        }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = `You are an expert at creating diverse and insightful mermaid diagrams for academic and conceptual visualization. 

When analyzing text:
- Focus on HIGH-LEVEL structure, relationships, and organization
- Identify connections, hierarchies, sequences, and parallel concepts
- Consider the BEST diagram type for the content structure
- Use simple, clear node labels (avoid long text in nodes)
- Keep diagrams focused and readable (8-12 nodes for complex topics, 5-8 for simple ones)

Choose the BEST diagram type based on content:
- **Flowchart (graph TD/LR)**: For sequential processes, linear workflows, or step-by-step procedures
- **Mind map (graph TD with central node)**: For concepts with sub-topics radiating from a central idea
- **Tree structure (graph TD)**: For hierarchies, taxonomies, or nested categories
- **Branching flowchart**: For decision trees, conditional paths, or multiple outcomes
- **Cycle diagram**: For circular processes or feedback loops
- **Parallel flows**: For comparing multiple approaches or showing simultaneous processes

Examples:
- Learning process → branching flowchart with decision points
- Concept breakdown → mind map with central node and branches
- Classification system → tree structure
- Workflow with options → flowchart with multiple paths

Only return the raw mermaid code (no markdown blocks, no "mermaid" prefix)`;


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
