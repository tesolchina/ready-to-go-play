import { Link } from "react-router-dom";
import { BookOpen, GraduationCap, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Lesson {
  id: string;
  slug: string;
  title: string;
  subject: string;
  grade_level: string;
  learning_objectives: string;
  created_at: string;
}

const Index = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const supabaseAny = supabase as any;
        const { data, error } = await supabaseAny
          .from('lessons')
          .select('id, slug, title, subject, grade_level, learning_objectives, created_at')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setLessons(data || []);
      } catch (error) {
        console.error("Error fetching lessons:", error);
        toast({
          title: "Error",
          description: "Failed to load lessons",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLessons();
  }, [toast]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5">
      <div className="container max-w-4xl mx-auto px-4 py-16">
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/80 mb-6">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Smart Lesson Builder
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create and deliver interactive, AI-powered lessons in minutes
          </p>
        </header>

        <div className="space-y-12">
          {/* Lesson Creator */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Create New Lesson</h2>
            <Link to="/lesson-creator" className="group block">
              <Card className="transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-2 hover:border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center flex-shrink-0">
                      <Plus className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2 group-hover:text-primary transition-colors">
                        Lesson Creator
                      </CardTitle>
                      <CardDescription className="text-base">
                        Create your own custom lesson using AI-powered tools and our educational framework
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                      AI-Powered
                    </span>
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                      Custom
                    </span>
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                      Document Upload
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </section>

          {/* Sample Lessons */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Sample Lesson</h2>
            <Link to="/lesson/1" className="group block">
              <Card className="transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-2 hover:border-primary/50">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2 group-hover:text-primary transition-colors">
                        AI Prompt Engineering Fundamentals
                      </CardTitle>
                      <CardDescription className="text-base">
                        Learn the essential framework for crafting effective AI prompts tailored for educational content
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                      Interactive
                    </span>
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                      7 Sections
                    </span>
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                      AI Practice
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </section>

          {/* Generated Lessons */}
          {!isLoading && lessons.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Your Generated Lessons</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {lessons.map((lesson) => (
                  <Link key={lesson.id} to={`/lesson/${lesson.slug}`} className="group">
                    <Card className="transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-2 hover:border-primary/50 h-full">
                      <CardHeader>
                        <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                          {lesson.title}
                        </CardTitle>
                        <CardDescription className="text-sm line-clamp-2">
                          {lesson.learning_objectives}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                            {lesson.subject}
                          </span>
                          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                            {lesson.grade_level}
                          </span>
                          <span className="px-3 py-1 bg-secondary/10 text-secondary-foreground rounded-full text-sm font-medium">
                            {new Date(lesson.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
