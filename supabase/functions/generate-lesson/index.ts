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
    const { title, subject, gradeLevel, learningObjectives, studentContext, challenges } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert educational content creator. Generate comprehensive lesson content based on teacher inputs. Structure your response as JSON with the following sections:

For EACH section (problem, commonBehaviors, framework, howItWorks, practice, reflection), include:
- keyPoints: array of 3-5 concise bullet points for presentation
- detailedContent: full paragraphs for additional reading
- comprehensionCheck: object with { question: string, options: string[], correctAnswer: number (0-based index) }

Additional fields:
- problem: { keyPoints, detailedContent, comprehensionCheck, visualizationData?: { type: "bar"|"line"|"pie", data: array of {label: string, value: number} } }
- commonBehaviors: { items: array of strings, comprehensionCheck }
- framework: { keyPoints, detailedContent, comprehensionCheck, visualizationData?: same format }
- howItWorks: { keyPoints, detailedContent, steps: array of {title: string, description: string}, comprehensionCheck }
- practice: { activities: array of { title: string, instructions: string, isInteractive: boolean }, comprehensionCheck }
- reflection: { prompts: array of strings, comprehensionCheck }
- feedback: string (teacher guidance)

Make content engaging, age-appropriate, and aligned with learning objectives. Include visualization data where it helps explain concepts.`;

    const userPrompt = `Create a lesson for:
Title: ${title}
Subject: ${subject}
Grade Level: ${gradeLevel}
Learning Objectives: ${learningObjectives}
${studentContext ? `Student Context: ${studentContext}` : ''}
${challenges ? `Specific Challenges: ${challenges}` : ''}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const generatedContent = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify({ generatedContent }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-lesson function:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});