import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { BookOpen, Target, GraduationCap, FileCheck, Lightbulb, Sparkles, Code } from "lucide-react";

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
        <main className="flex-1 bg-background">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 lg:hidden">
            <SidebarTrigger />
            <h2 className="text-lg font-semibold">Lessons</h2>
          </header>
          <div className="p-8">
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
                        Lesson 1
                      </span>
                    </div>
                    <CardTitle className="text-3xl">
                      From Traditional Lecturing to Interactive Learning
                    </CardTitle>
                    <CardDescription className="text-lg">
                      Reflecting on Teaching Practices with AI-Enhanced Learning
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <BookOpen className="w-5 h-5" />
                        <span className="font-medium">English for Academic Purposes (EAP)</span>
                      </div>
                      <p className="text-base leading-relaxed">
                        This lesson guides university English teachers through a critical reflection on traditional lecturing methods, 
                        exploring how AI can facilitate more interactive and student-centered learning experiences.
                      </p>
                      <div className="flex gap-2 pt-2">
                        <span className="px-3 py-1 bg-muted rounded-md text-sm">Critical Reflection</span>
                        <span className="px-3 py-1 bg-muted rounded-md text-sm">Interactive Learning</span>
                        <span className="px-3 py-1 bg-muted rounded-md text-sm">AI-Enhanced Teaching</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>

            {/* Lesson 2: Leverage Educational Resources */}
            <div className="max-w-4xl mx-auto">
              <Link to="/lessons/leverage-educational-resources">
                <Card className="border-2 border-accent hover:shadow-xl transition-all">
                  <CardHeader className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-accent/10 text-accent rounded-md text-sm font-medium">
                        Lesson 2
                      </span>
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-md text-sm font-medium">
                        ⭐ Case Study
                      </span>
                    </div>
                    <CardTitle className="text-3xl">
                      Leverage and Enhance Existing Educational Resources with AI
                    </CardTitle>
                    <CardDescription className="text-lg">
                      Building on Proven Resources: The Academic Phrasebank Case Study
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Sparkles className="w-5 h-5" />
                        <span className="font-medium">Resource Enhancement with AI</span>
                      </div>
                      <p className="text-base leading-relaxed">
                        Learn how to enhance existing high-quality educational resources with AI instead of recreating 
                        from scratch. This lesson uses the Manchester Academic Phrasebank as a case study, showing how 
                        to add interactivity, personalization, and community features while preserving pedagogical excellence.
                      </p>
                      <div className="flex gap-2 pt-2 flex-wrap">
                        <span className="px-3 py-1 bg-muted rounded-md text-sm">Resource Enhancement</span>
                        <span className="px-3 py-1 bg-muted rounded-md text-sm">Academic Writing</span>
                        <span className="px-3 py-1 bg-muted rounded-md text-sm">Practical Application</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>

            {/* Lesson 4: Vibe Coding */}
            <div className="max-w-4xl mx-auto">
              <Link to="/lessons/vibe-coding">
                <Card className="border-2 border-purple-500 hover:shadow-xl transition-all">
                  <CardHeader className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-md text-sm font-medium">
                        Lesson 4
                      </span>
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-md text-sm font-medium">
                        🚀 Advanced
                      </span>
                    </div>
                    <CardTitle className="text-3xl">
                      Vibe Coding: AI as a Bridge for Human-Machine Conversation
                    </CardTitle>
                    <CardDescription className="text-lg">
                      From Natural Language to Programming Languages: Teaching AI to Speak Machine
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Code className="w-5 h-5" />
                        <span className="font-medium">Code Generation & AI Agents</span>
                      </div>
                      <p className="text-base leading-relaxed">
                        Discover how AI can generate programming code to automate teaching tasks instead of just chatting 
                        in natural language. Learn to leverage Mermaid diagrams, Python scripts, and AI agents to transform 
                        repetitive work into automated workflows—no programming experience required.
                      </p>
                      <div className="flex gap-2 pt-2 flex-wrap">
                        <span className="px-3 py-1 bg-muted rounded-md text-sm">Code Generation</span>
                        <span className="px-3 py-1 bg-muted rounded-md text-sm">AI Agents</span>
                        <span className="px-3 py-1 bg-muted rounded-md text-sm">Automation</span>
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
                    More lessons coming soon
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
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Lessons;
