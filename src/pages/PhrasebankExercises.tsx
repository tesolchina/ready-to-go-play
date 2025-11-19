import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PhrasebankExercises = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 p-8 bg-background">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight">Phrasebank Exercises</h1>
              <p className="text-xl text-muted-foreground">
                Practice academic writing with structured exercises by discipline
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Interactive Exercises Coming Soon</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  This section will feature discipline-specific phrasebank exercises with examples and practice activities.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default PhrasebankExercises;
