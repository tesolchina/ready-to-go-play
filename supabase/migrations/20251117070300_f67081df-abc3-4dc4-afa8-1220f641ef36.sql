-- Create policy to allow anyone to insert posts (both authenticated and anonymous)
CREATE POLICY "Anyone can create posts"
ON public.phrasebank_posts
FOR INSERT
TO public
WITH CHECK (true);

-- Create policy to allow anyone to view posts
CREATE POLICY "Anyone can view posts"
ON public.phrasebank_posts
FOR SELECT
TO public
USING (true);

-- Create policy to allow users to update their own posts
CREATE POLICY "Users can update their own posts"
ON public.phrasebank_posts
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to delete their own posts
CREATE POLICY "Users can delete their own posts"
ON public.phrasebank_posts
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);