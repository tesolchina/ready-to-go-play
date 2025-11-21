-- Create table to store pre-computed thematic analyses
CREATE TABLE IF NOT EXISTS public.reflection_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_slug TEXT NOT NULL,
  section_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  question TEXT NOT NULL,
  analysis TEXT NOT NULL,
  response_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(lesson_slug, section_id, question_id)
);

-- Enable RLS
ALTER TABLE public.reflection_analyses ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read analyses
CREATE POLICY "Anyone can view reflection analyses"
  ON public.reflection_analyses
  FOR SELECT
  USING (true);

-- Create index for faster lookups
CREATE INDEX idx_reflection_analyses_lookup 
  ON public.reflection_analyses(lesson_slug, section_id, question_id);

-- Add trigger for updated_at
CREATE TRIGGER update_reflection_analyses_updated_at
  BEFORE UPDATE ON public.reflection_analyses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();