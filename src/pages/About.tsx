import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const About = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 p-8 bg-background">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight">About AI Learning Hub for EAP</h1>
              <p className="text-xl text-muted-foreground">
                Empowering EAP teachers with AI-driven tools and resources
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Our Mission</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  AI Learning Hub for EAP is dedicated to supporting English for Academic Purposes (EAP) 
                  teachers with cutting-edge AI tools that enhance teaching effectiveness and streamline 
                  lesson preparation.
                </p>
                <p>
                  We believe that technology should empower educators, not replace them. Our platform 
                  provides intelligent assistance while keeping teachers at the heart of the learning experience.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What We Offer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">AI-Powered Writing Tools</h3>
                  <p className="text-muted-foreground">
                    Access our Academic PhraseBank, Pattern Analyzer, and Reference Validator to help 
                    students improve their academic writing.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Lesson Creation</h3>
                  <p className="text-muted-foreground">
                    Build custom lessons tailored to your students' needs with AI assistance for content 
                    generation and adaptation.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Ready-to-Use Lessons</h3>
                  <p className="text-muted-foreground">
                    Browse our collection of pre-built lessons covering prompt engineering basics, 
                    advanced techniques, and subject-specific strategies.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>For EAP Teachers</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Whether you're teaching undergraduate students, preparing graduate researchers, or 
                  supporting international students in their academic journey, our tools are designed 
                  to meet your specific needs. Join our growing community of EAP educators leveraging 
                  AI to create more engaging and effective learning experiences.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default About;
