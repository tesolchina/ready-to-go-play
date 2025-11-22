// Blog post metadata structure
export interface BlogPostMetadata {
  title: string;
  excerpt: string;
  author: string;
  category: string;
  published_date: string;
  slug: string;
}

export interface BlogPost extends BlogPostMetadata {
  content: string;
}

// Import all blog posts
const blogModules = import.meta.glob('/src/content/blog/*.md', { 
  eager: true,
  as: 'raw'
});

// Parse frontmatter from markdown
function parseFrontmatter(markdown: string): { metadata: BlogPostMetadata; content: string } {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = markdown.match(frontmatterRegex);
  
  if (!match) {
    throw new Error('Invalid markdown format: missing frontmatter');
  }
  
  const [, frontmatterStr, content] = match;
  const metadata: any = {};
  
  frontmatterStr.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length) {
      const value = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
      metadata[key.trim()] = value;
    }
  });
  
  return { 
    metadata: metadata as BlogPostMetadata, 
    content: content.trim() 
  };
}

// Load all blog posts
export function getAllBlogPosts(): BlogPost[] {
  const posts: BlogPost[] = [];
  
  for (const path in blogModules) {
    const markdown = blogModules[path] as string;
    const { metadata, content } = parseFrontmatter(markdown);
    posts.push({ ...metadata, content });
  }
  
  // Sort by published date (newest first)
  return posts.sort((a, b) => 
    new Date(b.published_date).getTime() - new Date(a.published_date).getTime()
  );
}

// Get a single blog post by slug
export function getBlogPostBySlug(slug: string): BlogPost | null {
  const posts = getAllBlogPosts();
  return posts.find(post => post.slug === slug) || null;
}
