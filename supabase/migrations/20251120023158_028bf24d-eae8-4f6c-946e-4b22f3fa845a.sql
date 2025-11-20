-- Create table for pre-generated paragraph analysis
CREATE TABLE public.paragraph_analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  paragraph_text TEXT NOT NULL UNIQUE,
  analysis_result JSONB NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for user template submissions
CREATE TABLE public.template_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  paragraph_text TEXT NOT NULL,
  pattern_category TEXT NOT NULL,
  pattern_subcategory TEXT NOT NULL,
  template_text TEXT NOT NULL,
  user_answer TEXT NOT NULL,
  ai_feedback JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.paragraph_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_submissions ENABLE ROW LEVEL SECURITY;

-- RLS policies for paragraph_analyses (public read)
CREATE POLICY "Anyone can view paragraph analyses"
  ON public.paragraph_analyses
  FOR SELECT
  USING (true);

CREATE POLICY "Only authenticated users can insert analyses"
  ON public.paragraph_analyses
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- RLS policies for template_submissions
CREATE POLICY "Anyone can view their own submissions"
  ON public.template_submissions
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create submissions"
  ON public.template_submissions
  FOR INSERT
  WITH CHECK (true);

-- Create trigger for updated_at
CREATE TRIGGER update_paragraph_analyses_updated_at
  BEFORE UPDATE ON public.paragraph_analyses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_paragraph_analyses_text ON public.paragraph_analyses(paragraph_text);
CREATE INDEX idx_paragraph_analyses_default ON public.paragraph_analyses(is_default);
CREATE INDEX idx_template_submissions_user ON public.template_submissions(user_id);
CREATE INDEX idx_template_submissions_created ON public.template_submissions(created_at DESC);