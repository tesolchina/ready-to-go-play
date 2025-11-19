-- Create table for tracking lesson visitors and responses
CREATE TABLE IF NOT EXISTS public.lesson_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_slug TEXT NOT NULL,
  section_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  response_option TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for tracking unique visitors per lesson
CREATE TABLE IF NOT EXISTS public.lesson_visitors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_slug TEXT NOT NULL,
  visited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(lesson_slug, id)
);

-- Enable Row Level Security
ALTER TABLE public.lesson_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_visitors ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (anonymous responses)
CREATE POLICY "Anyone can view lesson interactions"
  ON public.lesson_interactions
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert lesson interactions"
  ON public.lesson_interactions
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view lesson visitors"
  ON public.lesson_visitors
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert lesson visitors"
  ON public.lesson_visitors
  FOR INSERT
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_lesson_interactions_slug ON public.lesson_interactions(lesson_slug);
CREATE INDEX idx_lesson_interactions_question ON public.lesson_interactions(question_id);
CREATE INDEX idx_lesson_visitors_slug ON public.lesson_visitors(lesson_slug);