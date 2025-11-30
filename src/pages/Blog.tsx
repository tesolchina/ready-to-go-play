import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Calendar, User } from "lucide-react";
import { Link } from "react-router-dom";
import { getAllBlogPosts } from "@/lib/blogLoader";
import { useMemo } from "react";

const Blog = () => {
  const blogPosts = useMemo(() => getAllBlogPosts(), []);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 bg-background">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 lg:hidden">
            <SidebarTrigger />
            <h2 className="text-lg font-semibold">Blog</h2>
          </header>
          <div className="p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight">博客与资源</h1>
              <p className="text-xl text-muted-foreground">
                EAP教育者的见解、技巧和更新 | Insights, tips, and updates for EAP educators
              </p>
            </div>

            {blogPosts && blogPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {blogPosts.map((post) => (
                  <Link to={`/blog/${post.slug}`} key={post.slug}>
                    <Card className="hover:shadow-lg transition-all hover:scale-[1.02] h-full overflow-hidden group">
                      {post.content.includes('<video') && post.content.match(/src="([^"]+\.mp4)"/) && (
                        <div className="aspect-video bg-muted relative overflow-hidden">
                          <video 
                            className="w-full h-full object-cover"
                            src={post.content.match(/src="([^"]+\.mp4)"/)?.[1]}
                            preload="metadata"
                          />
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="bg-white/90 rounded-full p-3">
                              <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                            </div>
                          </div>
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          {post.category && (
                            <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium">
                              {post.category}
                            </span>
                          )}
                        </div>
                        <CardTitle className="text-2xl">{post.title}</CardTitle>
                        {post.excerpt && (
                          <CardDescription className="text-base">{post.excerpt}</CardDescription>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(post.published_date).toLocaleDateString('zh-CN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>{post.author}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">暂无博客文章</p>
              </div>
            )}
          </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Blog;
