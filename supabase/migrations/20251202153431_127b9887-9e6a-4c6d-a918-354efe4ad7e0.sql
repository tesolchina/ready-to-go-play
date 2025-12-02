-- Create table for shared workshop use case conversations
CREATE TABLE public.workshop_shared_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nickname TEXT NOT NULL,
  use_case_summary TEXT NOT NULL,
  chat_history JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.workshop_shared_conversations ENABLE ROW LEVEL SECURITY;

-- Anyone can view shared conversations
CREATE POLICY "Anyone can view shared conversations" 
ON public.workshop_shared_conversations 
FOR SELECT 
USING (true);

-- Anyone can share conversations (no auth required for workshop)
CREATE POLICY "Anyone can share conversations" 
ON public.workshop_shared_conversations 
FOR INSERT 
WITH CHECK (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.workshop_shared_conversations;