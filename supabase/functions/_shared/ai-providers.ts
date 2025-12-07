// Shared AI provider configuration and utilities

export interface AIProviderConfig {
  hasPlatformAccess: boolean;
  poeApiKey?: string;
  kimiApiKey?: string;
  deepseekApiKey?: string;
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatCompletionOptions {
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  tools?: any[];
  toolChoice?: any;
  stream?: boolean;
}

// Get AI provider configuration from request headers and environment
export function getAIProviderConfig(req: Request): AIProviderConfig {
  const platformSession = req.headers.get("x-platform-session");
  const hasPlatformAccess = !!platformSession;

  const poeApiKey = Deno.env.get("POE_API_KEY");
  let kimiApiKey = Deno.env.get("KIMI_API_KEY");
  let deepseekApiKey = Deno.env.get("DEEPSEEK_API_KEY");

  // If no platform access, use user-provided keys from headers
  if (!hasPlatformAccess) {
    const userKimiKey = req.headers.get("x-user-kimi-key");
    const userDeepseekKey = req.headers.get("x-user-deepseek-key");
    
    if (userKimiKey) kimiApiKey = userKimiKey;
    if (userDeepseekKey) deepseekApiKey = userDeepseekKey;
  }

  return {
    hasPlatformAccess,
    poeApiKey,
    kimiApiKey,
    deepseekApiKey,
  };
}

// Check if any AI provider is available
export function hasAIProvider(config: AIProviderConfig): boolean {
  if (config.hasPlatformAccess && config.poeApiKey) return true;
  if (config.kimiApiKey || config.deepseekApiKey) return true;
  return false;
}

// Call AI provider with automatic fallback
export async function callAIProvider(
  config: AIProviderConfig,
  options: ChatCompletionOptions
): Promise<{ content: string; provider: string; toolCalls?: any[] }> {
  const { messages, temperature = 0.7, maxTokens, tools, toolChoice } = options;

  // Platform users get Poe API
  if (config.hasPlatformAccess && config.poeApiKey) {
    console.log("Using Poe API for platform user");
    return await callPoeAPI(config.poeApiKey, messages, temperature, maxTokens, tools, toolChoice);
  }

  // Try user-provided Kimi first, then DeepSeek
  if (config.kimiApiKey) {
    try {
      console.log("Attempting to use Kimi API (user key)");
      return await callKimiAPI(config.kimiApiKey, messages, temperature, maxTokens, tools, toolChoice);
    } catch (error) {
      console.error("Kimi API failed:", error);
      if (config.deepseekApiKey) {
        console.log("Falling back to DeepSeek API");
        return await callDeepSeekAPI(config.deepseekApiKey, messages, temperature, maxTokens, tools, toolChoice);
      }
      throw error;
    }
  }

  if (config.deepseekApiKey) {
    console.log("Using DeepSeek API (user key)");
    return await callDeepSeekAPI(config.deepseekApiKey, messages, temperature, maxTokens, tools, toolChoice);
  }

  throw new Error("No AI provider available");
}

// Poe API call (OpenAI-compatible)
async function callPoeAPI(
  apiKey: string,
  messages: ChatMessage[],
  temperature: number,
  maxTokens?: number,
  tools?: any[],
  toolChoice?: any
): Promise<{ content: string; provider: string; toolCalls?: any[] }> {
  const body: any = {
    model: "Claude-3.5-Sonnet", // Poe's Claude model
    messages,
    temperature,
  };

  if (maxTokens) body.max_tokens = maxTokens;
  if (tools) body.tools = tools;
  if (toolChoice) body.tool_choice = toolChoice;

  const response = await fetch("https://api.poe.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Poe API error:", response.status, errorText);
    throw new Error(`Poe API failed: ${response.status}`);
  }

  const data = await response.json();
  const message = data.choices[0].message;
  
  return {
    content: message.content || "",
    provider: "Poe",
    toolCalls: message.tool_calls,
  };
}

// Kimi API call
async function callKimiAPI(
  apiKey: string,
  messages: ChatMessage[],
  temperature: number,
  maxTokens?: number,
  tools?: any[],
  toolChoice?: any
): Promise<{ content: string; provider: string; toolCalls?: any[] }> {
  const body: any = {
    model: "moonshot-v1-8k",
    messages,
    temperature,
  };

  if (maxTokens) body.max_tokens = maxTokens;
  if (tools) body.tools = tools;
  if (toolChoice) body.tool_choice = toolChoice;

  const response = await fetch("https://api.moonshot.cn/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Kimi API error:", response.status, errorText);
    throw new Error(`Kimi API failed: ${response.status}`);
  }

  const data = await response.json();
  const message = data.choices[0].message;
  
  return {
    content: message.content || "",
    provider: "Kimi",
    toolCalls: message.tool_calls,
  };
}

// DeepSeek API call
async function callDeepSeekAPI(
  apiKey: string,
  messages: ChatMessage[],
  temperature: number,
  maxTokens?: number,
  tools?: any[],
  toolChoice?: any
): Promise<{ content: string; provider: string; toolCalls?: any[] }> {
  const body: any = {
    model: "deepseek-chat",
    messages,
    temperature,
  };

  if (maxTokens) body.max_tokens = maxTokens;
  if (tools) body.tools = tools;
  if (toolChoice) body.tool_choice = toolChoice;

  const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("DeepSeek API error:", response.status, errorText);
    throw new Error(`DeepSeek API failed: ${response.status}`);
  }

  const data = await response.json();
  const message = data.choices[0].message;
  
  return {
    content: message.content || "",
    provider: "DeepSeek",
    toolCalls: message.tool_calls,
  };
}
