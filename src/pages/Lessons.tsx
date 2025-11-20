import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { BringYourOwnKey } from "@/components/BringYourOwnKey";
import { CollapsibleSection } from "@/components/CollapsibleSection";
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
                Explore how AI can empower EAP teaching and learning
              </p>
            </div>

          <div className="space-y-8">
            {/* Bring Your Own Key Module */}
            <div className="max-w-4xl mx-auto">
              <CollapsibleSection 
                title="API Key Configuration" 
                icon="🔑"
                defaultOpen={true}
              >
                <div className="space-y-4 mb-6">
                  <p className="text-muted-foreground">
                    This page includes AI features that consume computing power from Large Language Models (LLMs). 
                    Users are expected to pay for such computing power by obtaining an API key from either Kimi or DeepSeek.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Please configure your API key below to enable AI-powered interactive features in the lessons.
                  </p>
                </div>
                <BringYourOwnKey />
              </CollapsibleSection>
            </div>

            {/* Lessons Grid */}
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Lesson: Interactive Learning Reflection */}
                <Link to="/lessons/interactive-learning-reflection">
                  <Card className="border-2 border-primary hover:shadow-lg transition-all h-full">
                    <CardHeader className="space-y-2 pb-3">
                      <CardTitle className="text-lg">
                        From Traditional Lecturing to Interactive Learning
                      </CardTitle>
                      <CardDescription className="text-sm">
                        Reflecting on Teaching Practices with AI-Enhanced Learning
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs">
                        <BookOpen className="w-3 h-3" />
                        <span>English for Academic Purposes</span>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <span className="px-2 py-0.5 bg-muted rounded text-xs">Critical Reflection</span>
                        <span className="px-2 py-0.5 bg-muted rounded text-xs">Interactive Learning</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                {/* Lesson: Leverage Educational Resources */}
                <Link to="/lessons/leverage-educational-resources">
                  <Card className="border-2 border-accent hover:shadow-lg transition-all h-full">
                    <CardHeader className="space-y-2 pb-3">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg flex-1">
                          Leverage Educational Resources with AI
                        </CardTitle>
                        <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium">
                          ⭐ Case
                        </span>
                      </div>
                      <CardDescription className="text-sm">
                        Building on the Academic Phrasebank
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs">
                        <Sparkles className="w-3 h-3" />
                        <span>Resource Enhancement</span>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <span className="px-2 py-0.5 bg-muted rounded text-xs">Academic Writing</span>
                        <span className="px-2 py-0.5 bg-muted rounded text-xs">AI Integration</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                {/* Lesson: Vibe Coding */}
                <Link to="/lessons/vibe-coding">
                  <Card className="border-2 border-green-500 hover:shadow-lg transition-all h-full">
                    <CardHeader className="space-y-2 pb-3">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg flex-1">
                          Vibe Coding: AI Generates Code
                        </CardTitle>
                        <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium">
                          🎯 Hands-On
                        </span>
                      </div>
                      <CardDescription className="text-sm">
                        From Natural Language to Executable Code
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs">
                        <Code className="w-3 h-3" />
                        <span>Code Generation Practice</span>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <span className="px-2 py-0.5 bg-muted rounded text-xs">Mermaid</span>
                        <span className="px-2 py-0.5 bg-muted rounded text-xs">Python</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                {/* Lesson: AI Agents */}
                <Link to="/lessons/ai-agents">
                  <Card className="border-2 border-purple-500 hover:shadow-lg transition-all h-full">
                    <CardHeader className="space-y-2 pb-3">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg flex-1">
                          AI Agents: Autonomous Systems
                        </CardTitle>
                        <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium">
                          🔮 Future
                        </span>
                      </div>
                      <CardDescription className="text-sm">
                        When Code Writes and Executes Itself
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs">
                        <BookOpen className="w-3 h-3" />
                        <span>Future Vision</span>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <span className="px-2 py-0.5 bg-muted rounded text-xs">Autonomous AI</span>
                        <span className="px-2 py-0.5 bg-muted rounded text-xs">Real Agents</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>

              </div>

              {/* Archive Notice */}
              <Card className="bg-muted/50 mt-8">
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground text-sm">
                    More lessons coming soon
                  </p>
                </CardContent>
              </Card>
            </div>
            </div>
          </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Lessons;
