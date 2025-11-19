import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Calendar, User } from "lucide-react";

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Getting Started with AI in EAP Teaching",
      excerpt: "Learn how to integrate AI tools into your EAP classroom effectively and ethically.",
      date: "2024-01-15",
      author: "Dr. Sarah Johnson",
      category: "Teaching Tips"
    },
    {
      id: 2,
      title: "The Future of Academic Writing Support",
      excerpt: "Exploring how AI is transforming the way we teach academic writing skills.",
      date: "2024-01-10",
      author: "Prof. Michael Chen",
      category: "Research"
    },
    {
      id: 3,
      title: "Best Practices for Using Academic PhraseBank",
      excerpt: "Maximize the benefits of our AI-powered phrasebank tool in your lessons.",
      date: "2024-01-05",
      author: "Dr. Emily Rodriguez",
      category: "Tool Guides"
    },
    {
      id: 4,
      title: "Pattern Analysis in Academic Writing",
      excerpt: "Understanding text patterns to help students develop stronger writing skills.",
      date: "2023-12-28",
      author: "Dr. James Wilson",
      category: "Writing Skills"
    },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight">Blog & Resources</h1>
              <p className="text-xl text-muted-foreground">
                Insights, tips, and updates for EAP educators
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blogPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium">
                        {post.category}
                      </span>
                    </div>
                    <CardTitle className="text-2xl">{post.title}</CardTitle>
                    <CardDescription className="text-base">{post.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Blog;
