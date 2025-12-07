import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAIService } from "@/contexts/AIServiceContext";
import { BookOpen, Target, GraduationCap, FileCheck, Lightbulb, Sparkles, Code, Key, CheckCircle2, AlertCircle, Settings } from "lucide-react";

const Lessons = () => {
  const { isActivated, hasPlatformAccess, hasUserKey } = useAIService();

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
            {/* AI Configuration Status Card */}
            <div className="max-w-4xl mx-auto">
              <Card className={`border-2 ${isActivated ? 'border-green-500/50 bg-green-50/30' : 'border-amber-500/50 bg-amber-50/30'}`}>
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${isActivated ? 'bg-green-100' : 'bg-amber-100'}`}>
                        {isActivated ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-amber-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">
                          {isActivated ? 'AI Services Active' : 'Configure AI to Enable Features'}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {isActivated 
                            ? `Using ${hasPlatformAccess ? 'Platform Access (Poe)' : hasUserKey ? 'Personal API Key' : 'AI Services'}`
                            : 'Some lessons require AI features. Configure your API key to get started.'}
                        </p>
                      </div>
                    </div>
                    <Link to="/configure-ai">
                      <Button variant={isActivated ? "outline" : "default"} className="gap-2">
                        <Settings className="h-4 w-4" />
                        {isActivated ? 'Manage' : 'Configure AI'}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
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
                  <Card className="border-2 border-gray-800 hover:shadow-lg transition-all h-full">
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
