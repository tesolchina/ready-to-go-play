-- Create blog_posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author TEXT NOT NULL,
  category TEXT,
  slug TEXT NOT NULL UNIQUE,
  published_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policies for blog posts
CREATE POLICY "Anyone can view blog posts" 
ON public.blog_posts 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create blog posts" 
ON public.blog_posts 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update blog posts" 
ON public.blog_posts 
FOR UPDATE 
USING (true);

CREATE POLICY "Authenticated users can delete blog posts" 
ON public.blog_posts 
FOR DELETE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();