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

          <div className="space-y-8">
            {/* Featured Lesson */}
            <div className="max-w-4xl mx-auto">
              <Link to="/lessons/interactive-learning-reflection">
                <Card className="border-2 border-primary hover:shadow-xl transition-all">
                  <CardHeader className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-md text-sm font-medium">
                        第一课 | Lesson 1
                      </span>
                    </div>
                    <CardTitle className="text-3xl">
                      从传统讲授到互动学习：教学模式的反思与实践
                    </CardTitle>
                    <CardDescription className="text-lg">
                      Reflecting on Lecturing: Towards Interactive Learning with AI
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <BookOpen className="w-5 h-5" />
                        <span className="font-medium">大学英语教学 | English for Academic Purposes</span>
                      </div>
                      <p className="text-base leading-relaxed">
                        本课程将引导您反思传统讲授模式的局限性，探索结合AI技术的互动学习方法，通过实践练习和深度反思，
                        帮助您构建更有效的教学模式。
                      </p>
                      <div className="flex gap-2 pt-2">
                        <span className="px-3 py-1 bg-muted rounded-md text-sm">批判性反思</span>
                        <span className="px-3 py-1 bg-muted rounded-md text-sm">互动学习</span>
                        <span className="px-3 py-1 bg-muted rounded-md text-sm">AI辅助教学</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>

            {/* Archive Notice */}
            <div className="max-w-4xl mx-auto">
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    更多课程正在开发中 | More lessons coming soon
                  </p>
                </CardContent>
              </Card>
            </div>
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
