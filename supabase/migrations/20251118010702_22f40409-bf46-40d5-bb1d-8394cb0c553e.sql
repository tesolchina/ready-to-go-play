-- Add user_id column to pdf_documents table for ownership tracking
ALTER TABLE public.pdf_documents
ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update existing records to have null user_id (for backwards compatibility)
-- New records will require a user_id

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Anyone can create PDF documents" ON public.pdf_documents;
DROP POLICY IF EXISTS "Anyone can update PDF documents" ON public.pdf_documents;
DROP POLICY IF EXISTS "Anyone can delete PDF documents" ON public.pdf_documents;
DROP POLICY IF EXISTS "Anyone can view PDF documents" ON public.pdf_documents;

-- Create secure RLS policies

-- Allow everyone to view PDF documents (public read access)
CREATE POLICY "Anyone can view PDF documents"
ON public.pdf_documents
FOR SELECT
USING (true);

-- Only authenticated users can create PDF documents (and they must own them)
CREATE POLICY "Authenticated users can create their own PDF documents"
ON public.pdf_documents
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Only owners can update their PDF documents
CREATE POLICY "Users can update their own PDF documents"
ON public.pdf_documents
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Only owners can delete their PDF documents
CREATE POLICY "Users can delete their own PDF documents"
ON public.pdf_documents
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);