# Blog Content Folder

This folder contains all blog posts as Markdown files. Each blog post should have frontmatter metadata.

## Adding a New Blog Post

1. Create a new `.md` file in this folder with a descriptive filename (e.g., `my-new-post.md`)
2. Add frontmatter at the top of the file:

```markdown
---
title: "Your Blog Post Title"
excerpt: "A brief summary of your post (1-2 sentences)"
author: "Author Name"
category: "Category Name"
published_date: "YYYY-MM-DD"
slug: "url-friendly-slug"
---

# Your Blog Post Title

Your blog content here in Markdown format...
```

## Frontmatter Fields

- **title**: The full title of your blog post (required)
- **excerpt**: A brief summary that appears on the blog listing page (required)
- **author**: Author name (required)
- **category**: Category for filtering/organization (required)
- **published_date**: Publication date in YYYY-MM-DD format (required)
- **slug**: URL-friendly identifier used in the URL path (required, must be unique)

## Example Blog Post

See `interactive-learning.md` or `hku-scandal-reference-validator.md` for complete examples.

## Editing with Cursor

This folder structure allows you to:
1. Edit blog posts in Cursor IDE with full markdown support
2. Push changes to GitHub
3. Changes automatically sync to Lovable
4. Blog index and individual post pages update automatically

## Markdown Features

You can use standard Markdown features:
- Headers (# ## ###)
- **Bold** and *italic* text
- [Links](https://example.com)
- Lists (ordered and unordered)
- Code blocks
- Blockquotes
- And more...
