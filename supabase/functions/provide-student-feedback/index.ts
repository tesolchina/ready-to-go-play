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
    const { selectedExample, studentSentence, discipline, category } = await req.json();
    
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

    console.log('Providing feedback on student sentence:', {
      category,
      discipline,
      sentenceLength: studentSentence?.length
    });

    const feedbackPrompt = `You are an academic writing instructor providing feedback on a student's sentence.

ORIGINAL EXAMPLE (from Academic Phrasebank):
"${selectedExample}"

STUDENT'S SENTENCE:
"${studentSentence}"

CONTEXT:
- Category: ${category}
- Discipline: ${discipline}

Provide constructive feedback:

1. STRENGTHS: What the student did well (2-3 specific points)

2. AREAS FOR IMPROVEMENT: Specific suggestions with examples (2-3 points)

3. REVISED VERSION: Provide an improved version if needed, otherwise return null if the sentence is already good

4. ACADEMIC REGISTER: Comment on whether it maintains appropriate academic tone and formality

Format response as JSON:
{
  "strengths": "specific praise with examples",
  "improvements": "specific suggestions",
  "revisedVersion": "improved sentence or null",
  "registerComment": "comment on academic tone"
}`;

    let content: string;
    let usedModel = "Kimi";

    // Helper function to fetch with timeout
    const fetchWithTimeout = async (url: string, options: any, timeout = 25000) => {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);
      
      try {
        const response = await fetch(url, {
          ...options,
          signal: controller.signal
        });
        clearTimeout(id);
        return response;
      } catch (error) {
        clearTimeout(id);
        throw error;
      }
    };

    try {
      console.log("Attempting to use Kimi API");
      const kimiResponse = await fetchWithTimeout("https://api.moonshot.cn/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${KIMI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "moonshot-v1-8k",
          messages: [
            {
              role: 'system',
              content: 'You are an expert academic writing instructor. Provide constructive, specific feedback in valid JSON format only.'
            },
            {
              role: 'user',
              content: feedbackPrompt
            }
          ],
          temperature: 0.7,
        }),
      }, 25000);

      if (!kimiResponse.ok) {
        const errorText = await kimiResponse.text();
        console.error("Kimi API error:", errorText);
        throw new Error(`Kimi API failed: ${kimiResponse.status}`);
      }

      const kimiData = await kimiResponse.json();
      content = kimiData.choices[0].message.content;
      console.log("Successfully used Kimi API");
    } catch (kimiError) {
      console.error("Kimi API failed, falling back to DeepSeek:", kimiError);
      usedModel = "DeepSeek";

      const deepseekResponse = await fetchWithTimeout("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: 'system',
              content: 'You are an expert academic writing instructor. Provide constructive, specific feedback in valid JSON format only.'
            },
            {
              role: 'user',
              content: feedbackPrompt
            }
          ],
          temperature: 0.7,
        }),
      }, 25000);

      if (!deepseekResponse.ok) {
        const errorText = await deepseekResponse.text();
        console.error("DeepSeek API error:", errorText);
        throw new Error(`Both Kimi and DeepSeek APIs failed`);
      }

      const deepseekData = await deepseekResponse.json();
      content = deepseekData.choices[0].message.content;
      console.log("Successfully used DeepSeek API");
    }

    console.log(`AI feedback response received using ${usedModel}, parsing...`);
    
    // Extract JSON from markdown code blocks if present
    let jsonContent = content;
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      jsonContent = jsonMatch[1];
    }
    
    const parsedResponse = JSON.parse(jsonContent);

    return new Response(
      JSON.stringify(parsedResponse),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in provide-student-feedback function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
