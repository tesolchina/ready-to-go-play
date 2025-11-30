import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Users } from "lucide-react";

const WorkshopAIAgent = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 bg-background">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 lg:hidden">
            <SidebarTrigger />
            <h2 className="text-lg font-semibold">Workshop</h2>
          </header>
          <div className="p-8">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight">AI Agent Workshop</h1>
                <p className="text-xl text-muted-foreground">
                  Building Intelligent AI Agents for Education
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Workshop Details</CardTitle>
                  <CardDescription>Join us for an interactive workshop on AI agents</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Calendar className="h-5 w-5" />
                    <span className="text-lg">December 3, 2025</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Clock className="h-5 w-5" />
                    <span className="text-lg">Time: TBA</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <MapPin className="h-5 w-5" />
                    <span className="text-lg">Location: TBA</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Users className="h-5 w-5" />
                    <span className="text-lg">Capacity: TBA</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>What You'll Learn</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 list-disc list-inside text-foreground">
                    <li>Introduction to AI agents and their applications in education</li>
                    <li>Building your first AI agent from scratch</li>
                    <li>Best practices for prompt engineering</li>
                    <li>Integrating AI agents into your teaching workflow</li>
                    <li>Ethical considerations and responsible AI use</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Prerequisites</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 list-disc list-inside text-foreground">
                    <li>Basic understanding of AI concepts (helpful but not required)</li>
                    <li>Laptop with internet connection</li>
                    <li>Enthusiasm to learn and experiment!</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default WorkshopAIAgent;
