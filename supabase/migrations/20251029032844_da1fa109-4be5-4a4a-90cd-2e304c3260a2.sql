-- Add is_public column to lessons table
ALTER TABLE public.lessons 
ADD COLUMN is_public boolean NOT NULL DEFAULT false;

-- Create index for better performance on public lessons queries
CREATE INDEX idx_lessons_is_public ON public.lessons(is_public) WHERE is_public = true;

-- Update RLS policy to allow public access to public lessons
CREATE POLICY "Anyone can view public lessons" 
ON public.lessons 
FOR SELECT 
USING (is_public = true);

-- Add policy for teachers to update visibility of their own lessons
CREATE POLICY "Teachers can update lesson visibility"
ON public.lessons
FOR UPDATE
USING (auth.uid() = teacher_id)
WITH CHECK (auth.uid() = teacher_id);