import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-platform-session, x-user-kimi-key, x-user-deepseek-key",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Build comprehensive system prompt with knowledge of all publisher guidelines
const buildSystemPrompt = () => {
  return `You are an expert assistant specializing in AI guidelines for academic publishing. You have comprehensive knowledge of AI policies from major academic publishers including Wiley, Elsevier, Oxford University Press, Sage, Springer Nature, and Taylor & Francis, as well as insights from recent research papers on AI in academic publishing (including the 2025 Moorhouse et al. paper on applied linguistics journal editors' perspectives).

Your knowledge base includes:

**WILEY AI GUIDELINES - Key Principles:**
- Review terms and conditions of AI tools before use
- AI Technology should be a companion, not a replacement
- Full disclosure of AI use is required when submitting manuscripts
- Authors must protect their intellectual property rights
- Human oversight is mandatory - authors remain fully accountable
- AI cannot be listed as an author
- Transparency in acknowledgments, methods sections, and figure captions

**ELSEVIER AI POLICY - Key Points:**
- Authors must review AI tool terms and conditions for privacy, confidentiality, and IP protection
- Careful review and verification of all AI-generated output required
- Disclosure statement required upon submission
- AI Tools must never be used as a substitute for human critical thinking
- Generative AI or AI-assisted tools not permitted for creating/altering images (with research exceptions)
- Enterprise versions recommended for unpublished/sensitive material

**OXFORD UNIVERSITY PRESS - Key Guidelines:**
- Authorship: Gen AI does not qualify as an author
- Accountability: Authors remain fully accountable for accuracy and integrity
- Transparency: Must disclose use of Gen AI tools clearly
- IP Protection: Must carefully review terms of service to protect content
- Enterprise versions offer better content protection

**SAGE AI POLICY - Important Points:**
- AI assistance (language, grammar, structure improvement) does not require disclosure
- Generative AI (producing content) must be disclosed
- Verify accuracy and check for plagiarism in AI-generated content
- Reviewers and editors must maintain confidentiality - cannot use AI for editorial work
- Undisclosed or inappropriate use may result in rejection

**SPRINGER NATURE - Key Principles:**
- LLMs do not satisfy authorship criteria
- AI use should be documented in Methods section
- AI-assisted copy editing (grammar, spelling, readability) does not need declaration
- Generative AI images generally not permitted (exceptions for research methods)
- Peer reviewers should not upload manuscripts into generative AI tools

**TAYLOR & FRANCIS - Guidelines:**
- Support responsible use for idea generation, language improvement, literature classification
- Authors remain accountable for originality, validity, and integrity
- Must clearly acknowledge use of Generative AI tools with tool name, version, purpose
- Cannot replace core researcher responsibilities
- Generative AI not permitted for images/figures or original research data
- Must always have human oversight

**MOORHOUSE 2025 RESEARCH INSIGHTS:**
- Applied linguistics journal editors are cautious about GenAI use
- Only use for improving writing quality is universally acceptable
- Transparency is seen as essential
- Current publisher policies are often ambiguous
- Discipline-specific guidance is needed
- Editors face challenges in detecting and evaluating AI use

When answering questions:
1. Provide accurate information based on the guidelines above
2. Compare policies across publishers when relevant
3. Emphasize the importance of transparency and disclosure
4. Highlight that authors remain accountable regardless of AI use
5. Recommend checking specific publisher policies when preparing submissions
6. Note that policies may evolve, so checking official sources is important

Always maintain a helpful, professional tone and prioritize accuracy and ethical use of AI in academic publishing.`;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userMessage, chatHistory } = await req.json();

    console.log("Processing chat message for Wiley AI Guidelines");

    if (!userMessage) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get API keys from environment variables (platform keys)
    let KIMI_API_KEY = Deno.env.get("KIMI_API_KEY");
    let DEEPSEEK_API_KEY = Deno.env.get("DEEPSEEK_API_KEY");

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
          error: "AI services not configured. Please configure your API key.",
          needsConfiguration: true 
        }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = buildSystemPrompt();

    // Build messages array with chat history
    const messages = [
      { role: "system", content: systemPrompt },
      ...(chatHistory || []).map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: "user", content: userMessage },
    ];

    let feedback: string;
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
          messages,
          temperature: 0.7,
        }),
      });

      if (!kimiResponse.ok) {
        const errorText = await kimiResponse.text();
        console.error("Kimi API error:", errorText);
        throw new Error(`Kimi API failed: ${kimiResponse.status}`);
      }

      const kimiData = await kimiResponse.json();
      feedback = kimiData.choices[0].message.content;
      console.log("Successfully used Kimi API");
    } catch (kimiError) {
      console.error("Kimi API failed, falling back to DeepSeek:", kimiError);
      usedModel = "DeepSeek";

      if (!DEEPSEEK_API_KEY) {
        throw new Error("Kimi API failed and DeepSeek API key not available");
      }

      const deepseekResponse = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages,
          temperature: 0.7,
        }),
      });

      if (!deepseekResponse.ok) {
        const errorText = await deepseekResponse.text();
        console.error("DeepSeek API error:", errorText);
        throw new Error(`Both Kimi and DeepSeek APIs failed`);
      }

      const deepseekData = await deepseekResponse.json();
      feedback = deepseekData.choices[0].message.content;
      console.log("Successfully used DeepSeek API");
    }

    console.log(`Chat response received using ${usedModel}`);

    return new Response(
      JSON.stringify({ feedback, response: feedback }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in wiley-ai-guidelines-chat function:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to process chat message";

    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

