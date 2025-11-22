import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

// Common validation schemas for edge functions
export const schemas = {
  references: z.object({
    references: z.string()
      .min(1, "References cannot be empty")
      .max(100000, "References text too large (max 100KB)")
      .refine(
        (val) => val.split('\n').length <= 500,
        "Too many references (max 500)"
      ),
  }),

  lessonData: z.object({
    problem: z.string().min(10).max(5000),
    audience: z.string().min(5).max(1000),
    undesirableSolutions: z.string().min(10).max(5000),
    framework: z.string().min(10).max(5000),
    howItWorks: z.string().min(10).max(5000),
    practice: z.string().min(10).max(5000),
    reflection: z.string().min(10).max(5000),
  }),

  chatMessages: z.object({
    messages: z.array(
      z.object({
        role: z.enum(['system', 'user', 'assistant']),
        content: z.string().min(1).max(10000),
      })
    ).max(100, "Too many messages in history"),
    category: z.string().optional(),
    subcategory: z.string().optional(),
    discipline: z.string().optional(),
    examples: z.array(z.string()).max(50).optional(),
    model: z.enum(['kimi', 'aliyun', 'spark']).optional(),
  }),

  templateFeedback: z.object({
    paragraphText: z.string().min(10).max(10000),
    patternCategory: z.string().min(1).max(200),
    patternSubcategory: z.string().min(1).max(200),
    templateText: z.string().min(1).max(5000),
    userAnswer: z.string().min(10).max(5000),
  }),
};

export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
      return { success: false, error: messages.join(', ') };
    }
    return { success: false, error: 'Invalid request data' };
  }
}
