import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const About = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 bg-background">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 lg:hidden">
            <SidebarTrigger />
            <h2 className="text-lg font-semibold">About</h2>
          </header>
          <div className="p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight">About AI Learning Hub</h1>
              <p className="text-xl text-muted-foreground">
                A platform for workshops and training on AI technologies and literacies for EAP university teachers and students
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Our Platform</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-foreground">
                  We offer AI-empowered lessons for both live teaching and asynchronous learning, and develop learning apps such as customized AI chatbots and other interactive learning experiences powered by AI.
                </p>
                <p className="text-foreground">
                  Our tools are designed to support EAP educators in creating engaging, effective learning experiences that prepare students for academic success.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Created By</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground">
                  <strong>Dr. Simon Wang</strong><br />
                  Lecturer in English and Innovation Officer<br />
                  The Language Centre, Hong Kong Baptist University
                </p>
              </CardContent>
            </Card>
          </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default About;
