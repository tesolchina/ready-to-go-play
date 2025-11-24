-- Create table for Wiley AI Guidelines chat history
CREATE TABLE IF NOT EXISTS public.wiley_chat_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_messages JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS but allow public read access for shared chats
ALTER TABLE public.wiley_chat_history ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read chat history (public sharing)
CREATE POLICY "Anyone can view wiley chat history"
ON public.wiley_chat_history
FOR SELECT
USING (true);

-- Allow anyone to create chat history (no auth required)
CREATE POLICY "Anyone can create wiley chat history"
ON public.wiley_chat_history
FOR INSERT
WITH CHECK (true);

-- Create index for faster lookups
CREATE INDEX idx_wiley_chat_history_created_at ON public.wiley_chat_history(created_at DESC);


