-- Add slug column to lessons table
ALTER TABLE public.lessons 
ADD COLUMN slug text UNIQUE;

-- Create function to generate slug from title
CREATE OR REPLACE FUNCTION public.generate_slug(input_title text)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  result_slug text;
  counter integer := 0;
  base_slug text;
BEGIN
  -- Convert title to lowercase, replace spaces with hyphens, remove special characters
  base_slug := lower(trim(regexp_replace(input_title, '[^a-zA-Z0-9\s-]', '', 'g')));
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  base_slug := regexp_replace(base_slug, '-+', '-', 'g');
  result_slug := base_slug;
  
  -- Check if slug exists and append counter if needed
  WHILE EXISTS (SELECT 1 FROM public.lessons WHERE slug = result_slug) LOOP
    counter := counter + 1;
    result_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN result_slug;
END;
$$;

-- Generate slugs for existing lessons
UPDATE public.lessons 
SET slug = public.generate_slug(title)
WHERE slug IS NULL;

-- Make slug not nullable after populating existing rows
ALTER TABLE public.lessons 
ALTER COLUMN slug SET NOT NULL;

-- Create trigger to auto-generate slug on insert if not provided
CREATE OR REPLACE FUNCTION public.set_lesson_slug()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := public.generate_slug(NEW.title);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER lesson_slug_trigger
BEFORE INSERT OR UPDATE OF title ON public.lessons
FOR EACH ROW
EXECUTE FUNCTION public.set_lesson_slug();