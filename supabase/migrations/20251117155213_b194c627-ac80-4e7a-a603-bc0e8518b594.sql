-- Create storage bucket for PDFs
INSERT INTO storage.buckets (id, name, public)
VALUES ('pdfs', 'pdfs', true);

-- Create table for PDF metadata
CREATE TABLE public.pdf_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  custom_slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pdf_documents ENABLE ROW LEVEL SECURITY;

-- Create policies for public viewing
CREATE POLICY "Anyone can view PDF documents"
ON public.pdf_documents
FOR SELECT
USING (true);

-- Create policies for inserting (allow anyone for now since no auth)
CREATE POLICY "Anyone can create PDF documents"
ON public.pdf_documents
FOR INSERT
WITH CHECK (true);

-- Create policies for updating
CREATE POLICY "Anyone can update PDF documents"
ON public.pdf_documents
FOR UPDATE
USING (true);

-- Create policies for deleting
CREATE POLICY "Anyone can delete PDF documents"
ON public.pdf_documents
FOR DELETE
USING (true);

-- Create storage policies for PDF uploads
CREATE POLICY "Anyone can view PDFs"
ON storage.objects
FOR SELECT
USING (bucket_id = 'pdfs');

CREATE POLICY "Anyone can upload PDFs"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'pdfs');

CREATE POLICY "Anyone can update PDFs"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'pdfs');

CREATE POLICY "Anyone can delete PDFs"
ON storage.objects
FOR DELETE
USING (bucket_id = 'pdfs');

-- Add trigger for updated_at
CREATE TRIGGER update_pdf_documents_updated_at
BEFORE UPDATE ON public.pdf_documents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to generate unique slug
CREATE OR REPLACE FUNCTION public.generate_pdf_slug(input_title TEXT)
RETURNS TEXT
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result_slug TEXT;
  counter INTEGER := 0;
  base_slug TEXT;
BEGIN
  base_slug := lower(trim(regexp_replace(input_title, '[^a-zA-Z0-9\s-]', '', 'g')));
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  base_slug := regexp_replace(base_slug, '-+', '-', 'g');
  result_slug := base_slug;
  
  WHILE EXISTS (SELECT 1 FROM public.pdf_documents WHERE custom_slug = result_slug) LOOP
    counter := counter + 1;
    result_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN result_slug;
END;
$$;