-- Create validation_reports table for shareable reports
CREATE TABLE IF NOT EXISTS public.validation_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  references_input TEXT NOT NULL,
  validation_results JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS but allow public read access for shared reports
ALTER TABLE public.validation_reports ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read reports (public sharing)
CREATE POLICY "Anyone can view validation reports"
ON public.validation_reports
FOR SELECT
USING (true);

-- Allow anyone to create reports (no auth required for this tool)
CREATE POLICY "Anyone can create validation reports"
ON public.validation_reports
FOR INSERT
WITH CHECK (true);

-- Create index for faster lookups
CREATE INDEX idx_validation_reports_created_at ON public.validation_reports(created_at DESC);