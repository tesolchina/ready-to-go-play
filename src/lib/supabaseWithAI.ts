import { supabase } from "@/integrations/supabase/client";
import { getAIHeaders } from "./aiServiceGuard";

/**
 * Wrapper for supabase.functions.invoke that automatically includes AI service headers
 */
export const invokeWithAI = async <T = any>(
  functionName: string,
  options?: {
    body?: any;
    headers?: Record<string, string>;
  }
): Promise<{ data: T | null; error: any }> => {
  const aiHeaders = getAIHeaders();
  
  return supabase.functions.invoke<T>(functionName, {
    ...options,
    headers: {
      ...aiHeaders,
      ...options?.headers,
    },
  });
};
