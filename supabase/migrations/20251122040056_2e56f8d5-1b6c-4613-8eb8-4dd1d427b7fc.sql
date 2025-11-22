-- Fix Critical Security Issues in RLS Policies

-- ============================================
-- 1. FIX PHRASEBANK_POSTS: Restrict to owner only
-- ============================================
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Anyone can view phrasebank posts" ON public.phrasebank_posts;

-- Create new secure policy: users can only view their own posts
CREATE POLICY "Users can view their own phrasebank posts"
ON public.phrasebank_posts
FOR SELECT
USING (auth.uid() = user_id);

-- Optional: Allow viewing of explicitly public posts (if is_featured means public)
-- Uncomment if you want featured posts to be publicly viewable
-- CREATE POLICY "Anyone can view featured phrasebank posts"
-- ON public.phrasebank_posts
-- FOR SELECT
-- USING (is_featured = true);

-- ============================================
-- 2. FIX LESSONS: Require authentication and ownership
-- ============================================
-- Drop the dangerous "anyone can" policies
DROP POLICY IF EXISTS "Anyone can create lessons" ON public.lessons;
DROP POLICY IF EXISTS "Anyone can update lessons" ON public.lessons;
DROP POLICY IF EXISTS "Anyone can delete lessons" ON public.lessons;

-- Create secure policies: only authenticated users can create, and only owners can modify/delete
CREATE POLICY "Authenticated users can create lessons"
ON public.lessons
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = teacher_id);

CREATE POLICY "Lesson owners can update their lessons"
ON public.lessons
FOR UPDATE
USING (auth.uid() = teacher_id)
WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Lesson owners can delete their lessons"
ON public.lessons
FOR DELETE
USING (auth.uid() = teacher_id);

-- Keep public viewing of lessons (or restrict with is_public flag)
-- The existing "Anyone can view lessons" SELECT policy should remain for public access

-- ============================================
-- 3. FIX TEMPLATE_SUBMISSIONS: Handle NULL user_id properly
-- ============================================
-- Drop existing policy
DROP POLICY IF EXISTS "Users can only view their own submissions" ON public.template_submissions;

-- Create policy that properly handles both authenticated and NULL user_id cases
-- For authenticated users, they can only see their own submissions
-- NULL user_id submissions should NOT be viewable by anyone (security by default)
CREATE POLICY "Users can view their authenticated submissions"
ON public.template_submissions
FOR SELECT
USING (user_id IS NOT NULL AND auth.uid() = user_id);

-- If you need anonymous submissions to be viewable by their creators,
-- implement a session token system instead of relying on NULL user_id

-- Drop the overly permissive anonymous creation policy
DROP POLICY IF EXISTS "Anyone can create submissions" ON public.template_submissions;

-- Create policy requiring authentication for submissions
CREATE POLICY "Authenticated users can create submissions"
ON public.template_submissions
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);