-- Drop the overly permissive SELECT policy
DROP POLICY IF EXISTS "Anyone can view their own submissions" ON public.template_submissions;

-- Create a secure SELECT policy that only allows users to view their own submissions
CREATE POLICY "Users can only view their own submissions"
ON public.template_submissions
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Note: Anonymous submissions (user_id IS NULL) will not be retrievable via SELECT,
-- but this is acceptable since the edge function returns feedback directly to the client
-- and doesn't need to query it back from the database