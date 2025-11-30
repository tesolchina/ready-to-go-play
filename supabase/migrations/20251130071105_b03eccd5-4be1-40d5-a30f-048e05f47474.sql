-- Create table to track workshop registration link clicks
CREATE TABLE public.workshop_registration_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id TEXT NOT NULL,
  clicked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_agent TEXT,
  referrer TEXT
);

-- Enable RLS
ALTER TABLE public.workshop_registration_clicks ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert clicks (public tracking)
CREATE POLICY "Anyone can track registration clicks"
ON public.workshop_registration_clicks
FOR INSERT
TO public
WITH CHECK (true);

-- Only allow reading for authenticated users (optional - for admin dashboard)
CREATE POLICY "Authenticated users can view click stats"
ON public.workshop_registration_clicks
FOR SELECT
TO authenticated
USING (true);

-- Create index for faster queries
CREATE INDEX idx_workshop_clicks_workshop_id ON public.workshop_registration_clicks(workshop_id);
CREATE INDEX idx_workshop_clicks_clicked_at ON public.workshop_registration_clicks(clicked_at);