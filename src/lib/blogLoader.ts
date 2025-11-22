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
function parseFrontmatter(markdown: string): { metadata: BlogPostMetadata; content: string } | null {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = markdown.match(frontmatterRegex);
  
  if (!match) {
    return null; // Skip files without frontmatter (like README.md)
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
  
  console.log('Loading blog posts. Found modules:', Object.keys(blogModules).length);
  
  for (const path in blogModules) {
    const markdown = blogModules[path] as string;
    const result = parseFrontmatter(markdown);
    
    // Skip files without proper frontmatter (like README.md)
    if (result) {
      console.log('Loaded post:', result.metadata.title, 'slug:', result.metadata.slug);
      posts.push({ ...result.metadata, content: result.content });
    } else {
      console.log('Skipped file without frontmatter:', path);
    }
  }
  
  console.log('Total posts loaded:', posts.length);
  
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
