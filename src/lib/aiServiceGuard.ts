export const checkAIServiceAvailable = (): { available: boolean; reason?: string } => {
  // Check for platform access code
  const storedSession = localStorage.getItem("platform_secret_session");
  
  if (storedSession) {
    try {
      const session = JSON.parse(storedSession);
      const sessionAge = Date.now() - session.timestamp;
      if (sessionAge < 24 * 60 * 60 * 1000) {
        return { available: true };
      }
    } catch (e) {
      localStorage.removeItem("platform_secret_session");
    }
  }

  // Check for user API keys
  const kimiKey = localStorage.getItem("user_kimi_api_key");
  const deepseekKey = localStorage.getItem("user_deepseek_api_key");
  
  if (kimiKey || deepseekKey) {
    return { available: true };
  }

  return { 
    available: false, 
    reason: "AI services not configured. Please configure your API key in the Lessons page." 
  };
};

export const getAIHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {};
  
  // Add platform session if available
  const storedSession = localStorage.getItem("platform_secret_session");
  if (storedSession) {
    try {
      const session = JSON.parse(storedSession);
      headers['X-Platform-Session'] = session.token;
    } catch (e) {
      console.error("Invalid session data:", e);
    }
  }
  
  // Add user keys if available
  const kimiKey = localStorage.getItem("user_kimi_api_key");
  const deepseekKey = localStorage.getItem("user_deepseek_api_key");
  
  if (kimiKey) {
    headers['X-User-Kimi-Key'] = kimiKey;
  }
  if (deepseekKey) {
    headers['X-User-Deepseek-Key'] = deepseekKey;
  }
  
  return headers;
};
