-- Update existing lessons to be publicly accessible
UPDATE public.lessons SET is_public = true;

-- Change default value for new lessons to be public by default
ALTER TABLE public.lessons ALTER COLUMN is_public SET DEFAULT true;