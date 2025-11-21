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
    const { category, subcategory, discipline, templates } = await req.json();

    if (!category || !templates || templates.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Category and templates are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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

    // Prepare the prompt
    const disciplineContext = discipline && discipline !== 'none' 
      ? `The examples should be relevant to ${discipline}.` 
      : 'The examples should be general academic examples.';

    const subcategoryContext = subcategory && subcategory !== '__all__'
      ? ` focusing on ${subcategory}`
      : '';

    const templatesText = templates.slice(0, 10).join('\n- ');

    const systemPrompt = `You are an expert in academic writing and the Academic Phrasebank from the University of Manchester. Your task is to generate 5 realistic, discipline-specific examples using Academic Phrasebank templates.`;

    const userPrompt = `Generate 5 academic sentence examples for the category "${category}"${subcategoryContext}.
${disciplineContext}

Use these Academic Phrasebank templates as inspiration:
- ${templatesText}

Requirements:
1. Each example should be a complete, realistic academic sentence
2. Examples should demonstrate proper usage of the phrasebank patterns
3. Make the examples relevant to ${discipline || 'general academic writing'}
4. Vary the examples to show different ways to use the templates
5. Make the examples authentic and suitable for actual academic papers

Return ONLY a JSON object with this exact structure:
{
  "examples": [
    "Example sentence 1",
    "Example sentence 2",
    "Example sentence 3",
    "Example sentence 4",
    "Example sentence 5"
  ]
}`;

    console.log('Generating examples with prompt:', userPrompt);

    let content: string;
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
            { role: 'user', content: userPrompt }
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
      content = kimiData.choices?.[0]?.message?.content;
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
            { role: 'user', content: userPrompt }
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
      content = deepseekData.choices?.[0]?.message?.content;
      console.log("Successfully used DeepSeek API");
    }

    if (!content) {
      throw new Error('No content in AI response');
    }

    console.log(`AI response generated using ${usedModel}:`, content);

    // Parse the JSON response
    let result;
    try {
      // Try to extract JSON if it's wrapped in markdown
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      result = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      // Fallback: try to extract sentences
      const sentences = content.split('\n').filter((line: string) => line.trim().length > 0);
      result = { examples: sentences.slice(0, 5) };
    }

    if (!result.examples || !Array.isArray(result.examples)) {
      throw new Error('Invalid response format from AI');
    }

    return new Response(
      JSON.stringify({ examples: result.examples.slice(0, 5) }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating examples:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate examples';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
