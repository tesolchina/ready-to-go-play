-- Create table for community bulletin board posts
CREATE TABLE public.phrasebank_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  chat_history jsonb NOT NULL,
  category_type text,
  category text,
  subcategory text,
  discipline text,
  upvotes integer DEFAULT 0,
  view_count integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Add trigger for updated_at
CREATE TRIGGER set_phrasebank_posts_updated_at
  BEFORE UPDATE ON public.phrasebank_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.phrasebank_posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Anyone can view posts
CREATE POLICY "Anyone can view phrasebank posts"
  ON public.phrasebank_posts
  FOR SELECT
  USING (true);

-- Authenticated users can create posts
CREATE POLICY "Authenticated users can create phrasebank posts"
  ON public.phrasebank_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Users can update their own posts
CREATE POLICY "Users can update their own phrasebank posts"
  ON public.phrasebank_posts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own posts
CREATE POLICY "Users can delete their own phrasebank posts"
  ON public.phrasebank_posts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);