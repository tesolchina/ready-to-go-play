import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Mail, ExternalLink, MessageCircle, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import QRCode from "react-qr-code";

const About = () => {
  const [showQR, setShowQR] = useState(false);
  
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
              <div className="flex items-center justify-between">
                <h1 className="text-4xl font-bold tracking-tight">About AI Learning Hub</h1>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowQR(!showQR)}
                  className="gap-2"
                >
                  <QrCode className="h-4 w-4" />
                  {showQR ? "Hide" : "Show"} QR Code
                </Button>
              </div>
              
              {showQR && (
                <Card>
                  <CardContent className="pt-6 flex flex-col items-center gap-4">
                    <QRCode
                      value="https://eapteacher.smartutor.me/"
                      size={200}
                      level="H"
                    />
                    <p className="text-sm text-muted-foreground">
                      Scan to visit: <a href="https://eapteacher.smartutor.me/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">eapteacher.smartutor.me</a>
                    </p>
                  </CardContent>
                </Card>
              )}
              
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
              <CardContent className="space-y-4">
                <div>
                  <p className="text-foreground font-semibold text-lg">
                    Dr. Simon Wang
                  </p>
                  <p className="text-muted-foreground">
                    Lecturer in English and Innovation Officer<br />
                    The Language Centre, Hong Kong Baptist University
                  </p>
                </div>
                
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a 
                      href="mailto:simonwang@hkbu.edu.hk"
                      className="text-primary hover:underline"
                    >
                      simonwang@hkbu.edu.hk
                    </a>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    <a 
                      href="https://lc.hkbu.edu.hk/main/simonwang/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      https://lc.hkbu.edu.hk/main/simonwang/
                    </a>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <MessageCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">WeChat ID:</span>
                    <span className="text-foreground font-medium">tesolchina</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Acknowledgement</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground">
                  The preparation of this website was partially supported by the General Research Fund of the Research Grants Council of the Hong Kong Special Administrative Region, China (Project Code: 17618424).
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
