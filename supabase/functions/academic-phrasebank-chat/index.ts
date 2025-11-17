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
    const { messages, category, subcategory, discipline, examples, model = "aliyun" } = await req.json();
    
    const KIMI_API_KEY = Deno.env.get("KIMI_API_KEY");
    const ALIYUN_API_KEY = Deno.env.get("ALIYUN_API_KEY");
    const SPARK_APPID = Deno.env.get("SPARK_APPID");
    const SPARK_API_SECRET = Deno.env.get("SPARK_API_SECRET");
    const SPARK_API_KEY = Deno.env.get("SPARK_API_KEY");

    if (model === "kimi" && !KIMI_API_KEY) {
      throw new Error("KIMI_API_KEY is not configured");
    }
    
    if (model === "aliyun" && !ALIYUN_API_KEY) {
      throw new Error("ALIYUN_API_KEY is not configured");
    }
    
    if (model === "spark" && (!SPARK_APPID || !SPARK_API_SECRET || !SPARK_API_KEY)) {
      throw new Error("SPARK credentials are not configured");
    }

    // Build system prompt based on category and discipline
    let systemPrompt = `You are an Academic PhraseBank assistant. Your role is to help students and researchers with academic writing by providing appropriate phrases, sentence structures, and language patterns commonly used in academic contexts.

You specialize in:
- Introducing ideas and research
- Describing methods and procedures
- Presenting results and findings
- Discussing implications and conclusions
- Citing and referencing
- Hedging and cautious language
- Transitions and signposting

IMPORTANT: Keep your responses concise and focused. Limit each response to approximately 100 words maximum. Be direct and provide only the most relevant information. Format your responses using markdown for better readability (use **bold** for emphasis, - for lists, etc.).`;

    // Enhance system prompt with category and discipline context
    if (category) {
      systemPrompt += `\n\nFocus specifically on: ${category}`;
    }

    if (subcategory) {
      systemPrompt += `\n\nWithin this category, emphasize: ${subcategory}`;
    }

    if (discipline) {
      systemPrompt += `\n\nProvide examples relevant to the discipline of: ${discipline}`;
    }

    // Include actual PhraseBank examples if provided
    if (subcategory && examples && Array.isArray(examples) && examples.length > 0) {
      const examplesText = examples.slice(0, 10).join('\n- ');
      systemPrompt += `\n\nHere are example phrases from the Academic PhraseBank for "${subcategory}":\n- ${examplesText}\n\nUse these as reference and provide similar, contextually appropriate phrases.`;
    }

    // Configure API endpoint and parameters based on selected model
    let apiUrl: string;
    let apiKey: string;
    let modelName: string;
    let headers: Record<string, string>;
    
    if (model === "aliyun") {
      apiUrl = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";
      apiKey = ALIYUN_API_KEY!;
      modelName = "qwen-plus";
      headers = {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      };
      console.log("Calling Aliyun API with streaming, messages:", messages?.length || 0, "category:", category);
    } else if (model === "spark") {
      apiUrl = "https://spark-api-open.xf-yun.com/v1/chat/completions";
      apiKey = SPARK_API_KEY!;
      modelName = "generalv3.5";
      headers = {
        Authorization: `Bearer ${SPARK_APPID}:${SPARK_API_SECRET}:${apiKey}`,
        "Content-Type": "application/json",
      };
      console.log("Calling Spark API with streaming, messages:", messages?.length || 0, "category:", category);
    } else {
      apiUrl = "https://api.moonshot.cn/v1/chat/completions";
      apiKey = KIMI_API_KEY!;
      modelName = "moonshot-v1-8k";
      headers = {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      };
      console.log("Calling Kimi API with streaming, messages:", messages?.length || 0, "category:", category);
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: modelName,
        messages: [
          { role: "system", content: systemPrompt },
          ...(messages || [])
        ],
        temperature: 0.7,
        max_tokens: 150, // Limit to ~100 words (approximately 1.5 tokens per word)
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`${model} API error:`, response.status, errorText);
      return new Response(
        JSON.stringify({ error: `Failed to get response from ${model} API` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create a readable stream to forward the response
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          controller.close();
          return;
        }

        try {
          let buffer = '';
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              // Process any remaining buffer
              if (buffer) {
                const lines = buffer.split('\n');
                for (const line of lines) {
                  if (line.startsWith('data: ')) {
                    const data = line.slice(6).trim();
                    if (data && data !== '[DONE]') {
                      try {
                        const json = JSON.parse(data);
                        const content = json.choices?.[0]?.delta?.content || '';
                        const finishReason = json.choices?.[0]?.finish_reason;
                        if (content) {
                          controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ content })}\n\n`));
                        }
                        if (finishReason) {
                          controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ done: true })}\n\n`));
                        }
                      } catch (e) {
                        // Skip invalid JSON
                      }
                    }
                  }
                }
              }
              controller.close();
              break;
            }

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || ''; // Keep incomplete line in buffer

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6).trim();
                if (data === '[DONE]') {
                  controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ done: true })}\n\n`));
                  controller.close();
                  return;
                }

                if (data) {
                  try {
                    const json = JSON.parse(data);
                    const content = json.choices?.[0]?.delta?.content || '';
                    const finishReason = json.choices?.[0]?.finish_reason;
                    
                    if (content) {
                      controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ content })}\n\n`));
                    }
                    
                    // Handle finish_reason to properly close the stream
                    if (finishReason) {
                      controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ done: true })}\n\n`));
                      controller.close();
                      return;
                    }
                  } catch (e) {
                    // Skip invalid JSON
                    console.log("Skipping invalid JSON:", data);
                  }
                }
              }
            }
          }
        } catch (error) {
          console.error("Stream error:", error);
          controller.error(error);
        } finally {
          // Ensure stream is closed
          try {
            controller.close();
          } catch (e) {
            // Already closed
          }
        }
      },
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error("Error in academic-phrasebank-chat function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
