-- Create table for workshop interest submissions
CREATE TABLE public.workshop_interest_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  institution TEXT,
  interests JSONB NOT NULL DEFAULT '{}',
  additional_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.workshop_interest_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit interest (public form)
CREATE POLICY "Anyone can submit interest" 
ON public.workshop_interest_submissions 
FOR INSERT 
WITH CHECK (true);

-- Only admins can view submissions
CREATE POLICY "Admins can view submissions" 
ON public.workshop_interest_submissions 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));