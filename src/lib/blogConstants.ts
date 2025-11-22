// Blog constants for creating new blog posts

/**
 * Get today's date in YYYY-MM-DD format for blog post published_date
 * Use this when creating new blog posts to set the published_date
 */
export const getTodayDate = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

/**
 * Current date constant for quick reference
 * Update this when creating new blog posts or use getTodayDate() for automatic date
 */
export const TODAY = getTodayDate();

/**
 * Template for new blog post frontmatter
 * Copy this when creating a new blog post
 */
export const BLOG_POST_TEMPLATE = `---
title: "Your Blog Post Title"
excerpt: "Brief description of your blog post"
author: "EAP Teacher Team"
category: "Category Name"
published_date: "${getTodayDate()}"
slug: "your-blog-post-slug"
---

# Your Blog Post Title

Your content here...
`;
