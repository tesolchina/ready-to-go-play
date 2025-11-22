-- Ensure no duplicate RLS policies exist
-- This migration is idempotent and safe to run multiple times

-- Drop any remaining permissive phrasebank_posts policies
DROP POLICY IF EXISTS "Anyone can view posts" ON public.phrasebank_posts;
DROP POLICY IF EXISTS "Anyone can view phrasebank posts" ON public.phrasebank_posts;

-- Ensure the secure policy exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'phrasebank_posts' 
    AND policyname = 'Users can view their own phrasebank posts'
  ) THEN
    CREATE POLICY "Users can view their own phrasebank posts"
    ON public.phrasebank_posts
    FOR SELECT
    USING (auth.uid() = user_id);
  END IF;
END $$;