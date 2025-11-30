import { useParams, Link } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { MermaidDiagram } from "@/components/MermaidDiagram";
import { getBlogPostBySlug } from "@/lib/blogLoader";
import { useMemo } from "react";

const BlogPost = () => {
  const { slug } = useParams();
  const post = useMemo(() => slug ? getBlogPostBySlug(slug) : null, [slug]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 bg-background">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 lg:hidden">
            <SidebarTrigger />
            <h2 className="text-lg font-semibold">Blog Post</h2>
          </header>
          <div className="p-8">
          <div className="max-w-4xl mx-auto">
            <Link to="/blog">
              <Button variant="ghost" className="mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回博客列表
              </Button>
            </Link>

            {post ? (
              <article className="space-y-6">
                <header className="space-y-4 border-b pb-6">
                  {post.category && (
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-md text-sm font-medium">
                      {post.category}
                    </span>
                  )}
                  <h1 className="text-4xl font-bold tracking-tight">{post.title}</h1>
                  
                  <div className="flex items-center gap-6 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      <span className="text-lg">{post.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      <span>{new Date(post.published_date).toLocaleDateString('zh-CN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                  </div>
                </header>

                <div className="prose prose-lg max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                      h2: ({ children }) => (
                        <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">{children}</h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-2xl font-semibold mt-6 mb-3 text-foreground">{children}</h3>
                      ),
                      p: ({ children }) => (
                        <p className="text-foreground leading-relaxed mb-4 text-lg">{children}</p>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc list-inside space-y-2 mb-4 text-foreground">{children}</ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal list-inside space-y-2 mb-4 text-foreground">{children}</ol>
                      ),
                      li: ({ children }) => (
                        <li className="text-foreground text-lg leading-relaxed">{children}</li>
                      ),
                      code: ({ children, className }) => {
                        const isMermaid = className?.includes('language-mermaid');
                        if (isMermaid) {
                          const code = String(children).trim();
                          return (
                            <div className="my-8 space-y-4">
                              <MermaidDiagram chart={code} />
                              <details className="bg-muted/50 rounded-lg p-4">
                                <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
                                  查看源代码
                                </summary>
                                <pre className="mt-3 bg-muted p-3 rounded overflow-x-auto text-xs">
                                  <code className="font-mono">{children}</code>
                                </pre>
                              </details>
                            </div>
                          );
                        }
                        return (
                          <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                            {children}
                          </code>
                        );
                      },
                      pre: ({ children }) => (
                        <pre className="bg-muted p-4 rounded-lg overflow-x-auto my-4">
                          {children}
                        </pre>
                      ),
                    }}
                  >
                    {post.content}
                  </ReactMarkdown>
                </div>
              </article>
            ) : (
              <div className="text-center py-12">
                <h2 className="text-2xl font-semibold mb-2">文章未找到</h2>
                <p className="text-muted-foreground">该博客文章不存在或已被删除</p>
              </div>
            )}
          </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default BlogPost;