-- Create table for tracking section visits
CREATE TABLE IF NOT EXISTS public.section_visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_slug TEXT NOT NULL,
  section_id TEXT NOT NULL,
  visited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.section_visits ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view section visits"
ON public.section_visits
FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert section visits"
ON public.section_visits
FOR INSERT
WITH CHECK (true);

-- Create table for semantic analysis of responses
CREATE TABLE IF NOT EXISTS public.response_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_slug TEXT NOT NULL,
  section_id TEXT NOT NULL,
  response_text TEXT NOT NULL,
  sentiment TEXT,
  key_themes TEXT[],
  word_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.response_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view response analytics"
ON public.response_analytics
FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert response analytics"
ON public.response_analytics
FOR INSERT
WITH CHECK (true);