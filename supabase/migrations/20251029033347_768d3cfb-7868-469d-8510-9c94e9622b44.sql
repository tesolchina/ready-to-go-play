-- Fix search_path for generate_slug function
CREATE OR REPLACE FUNCTION public.generate_slug(input_title text)
RETURNS text
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
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

-- Fix search_path for set_lesson_slug function
CREATE OR REPLACE FUNCTION public.set_lesson_slug()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := public.generate_slug(NEW.title);
  END IF;
  RETURN NEW;
END;
$$;