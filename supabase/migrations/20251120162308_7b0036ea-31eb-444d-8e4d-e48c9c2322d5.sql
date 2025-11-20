-- Create phrasebank_comments table
CREATE TABLE public.phrasebank_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_nickname TEXT NOT NULL,
  comment_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.phrasebank_comments ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Anyone can view comments"
ON public.phrasebank_comments
FOR SELECT
USING (true);

CREATE POLICY "Anyone can create comments"
ON public.phrasebank_comments
FOR INSERT
WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_phrasebank_comments_created_at ON public.phrasebank_comments(created_at DESC);

-- Enable realtime for comments
ALTER PUBLICATION supabase_realtime ADD TABLE public.phrasebank_comments;