import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { BookOpen, Target, GraduationCap, FileCheck, Lightbulb } from "lucide-react";

const Lessons = () => {
  const lessons = [
    { 
      id: 1, 
      title: "Prompt Engineering Basics", 
      url: "/lesson/1", 
      icon: BookOpen,
      description: "Learn the fundamentals of effective prompt engineering",
      duration: "45 minutes",
      level: "Beginner"
    },
    { 
      id: 2, 
      title: "Advanced Techniques", 
      url: "/lesson/2", 
      icon: Target,
      description: "Master complex prompting strategies and techniques",
      duration: "60 minutes",
      level: "Advanced"
    },
    { 
      id: 3, 
      title: "Subject-Specific Strategies", 
      url: "/lesson/3", 
      icon: GraduationCap,
      description: "Apply AI prompting to your specific academic field",
      duration: "50 minutes",
      level: "Intermediate"
    },
    { 
      id: 4, 
      title: "Assessment Creation", 
      url: "/lesson/4", 
      icon: FileCheck,
      description: "Build effective assessments using AI tools",
      duration: "55 minutes",
      level: "Intermediate"
    },
    { 
      id: 5, 
      title: "Content Adaptation", 
      url: "/lesson/5", 
      icon: Lightbulb,
      description: "Customize content for different student levels",
      duration: "40 minutes",
      level: "Intermediate"
    },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 p-8 bg-background">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight">All Lessons</h1>
              <p className="text-xl text-muted-foreground">
                Comprehensive courses for AI-powered teaching
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {lessons.map((lesson) => (
                <Link key={lesson.id} to={lesson.url} className="group">
                  <Card className="h-full transition-all hover:shadow-lg hover:scale-[1.02]">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                          style={{
                            background: 'linear-gradient(135deg, rgb(124, 58, 237) 0%, rgb(99, 102, 241) 100%)'
                          }}
                        >
                          <lesson.icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                            {lesson.title}
                          </CardTitle>
                          <CardDescription>{lesson.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                          {lesson.duration}
                        </span>
                        <span className="px-3 py-1 bg-secondary/10 text-secondary-foreground rounded-full text-sm font-medium">
                          {lesson.level}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <Card className="border-dashed">
              <CardHeader>
                <CardTitle>Create Your Own Lesson</CardTitle>
                <CardDescription>
                  Use our lesson creator tool to build custom lessons tailored to your needs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link 
                  to="/lesson-creator"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
                >
                  Go to Lesson Creator
                </Link>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Lessons;
