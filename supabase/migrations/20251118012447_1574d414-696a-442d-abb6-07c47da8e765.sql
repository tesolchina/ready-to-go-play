-- Make teacher_id nullable since we're allowing anonymous lesson creation
ALTER TABLE public.lessons ALTER COLUMN teacher_id DROP NOT NULL;

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Teachers can create their own lessons" ON public.lessons;
DROP POLICY IF EXISTS "Teachers can update their own lessons" ON public.lessons;
DROP POLICY IF EXISTS "Teachers can update lesson visibility" ON public.lessons;
DROP POLICY IF EXISTS "Teachers can delete their own lessons" ON public.lessons;
DROP POLICY IF EXISTS "Teachers can view their own lessons" ON public.lessons;

-- Create permissive policies for public access (keep existing view policy)
CREATE POLICY "Anyone can create lessons"
ON public.lessons
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update lessons"
ON public.lessons
FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Anyone can delete lessons"
ON public.lessons
FOR DELETE
USING (true);