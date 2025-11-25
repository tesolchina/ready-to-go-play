-- Add email_confirmed field to profiles if not exists
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email_confirmed boolean DEFAULT false;

-- Create email confirmation tokens table
CREATE TABLE IF NOT EXISTS public.email_confirmation_tokens (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  token text NOT NULL UNIQUE,
  expires_at timestamp with time zone NOT NULL,
  used_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.email_confirmation_tokens ENABLE ROW LEVEL SECURITY;

-- Only service role can access this table (edge functions)
CREATE POLICY "Service role only" ON public.email_confirmation_tokens
  FOR ALL USING (false);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_email_confirmation_tokens_token ON public.email_confirmation_tokens(token);
CREATE INDEX IF NOT EXISTS idx_email_confirmation_tokens_user_id ON public.email_confirmation_tokens(user_id);