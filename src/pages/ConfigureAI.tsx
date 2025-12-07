import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { BringYourOwnKey } from "@/components/BringYourOwnKey";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAIService } from "@/contexts/AIServiceContext";
import { Key, CheckCircle2, ArrowLeft, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

const ConfigureAI = () => {
  const { isActivated, hasPlatformAccess, hasUserKey } = useAIService();

  return (
    <>
      <Helmet>
        <title>Configure AI Services - EAP Teacher</title>
        <meta name="description" content="Configure your AI API keys to enable AI-powered features for academic writing and teaching." />
      </Helmet>
      
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex-1 bg-background">
            <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 lg:hidden">
              <SidebarTrigger />
              <h2 className="text-lg font-semibold">Configure AI</h2>
            </header>
            
            <div className="p-8">
              <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Link to="/lessons">
                      <Button variant="ghost" size="sm" className="gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Lessons
                      </Button>
                    </Link>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Key className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold tracking-tight">Configure AI Services</h1>
                      <p className="text-muted-foreground">
                        Set up your API keys to enable AI-powered features
                      </p>
                    </div>
                  </div>
                </div>

                {/* Current Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Current Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      <Badge 
                        variant={isActivated ? "default" : "secondary"}
                        className="gap-2 py-1.5 px-3"
                      >
                        {isActivated ? (
                          <>
                            <CheckCircle2 className="h-4 w-4" />
                            AI Services Active
                          </>
                        ) : (
                          "AI Services Not Configured"
                        )}
                      </Badge>
                      
                      {hasPlatformAccess && (
                        <Badge variant="outline" className="gap-2 py-1.5 px-3 border-green-500 text-green-700">
                          Platform Access (Poe API)
                        </Badge>
                      )}
                      
                      {hasUserKey && (
                        <Badge variant="outline" className="gap-2 py-1.5 px-3 border-blue-500 text-blue-700">
                          Personal API Key
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Info Alert */}
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Why configure AI?</strong> Many features on this platform use AI to provide personalized feedback, 
                    generate examples, and analyze academic writing. You can either use the platform's shared API 
                    (with an access code) or bring your own API key from Kimi or DeepSeek.
                  </AlertDescription>
                </Alert>

                {/* Main Configuration Component */}
                <BringYourOwnKey />

                {/* Help Section */}
                <Card className="bg-muted/30">
                  <CardHeader>
                    <CardTitle className="text-lg">Need Help?</CardTitle>
                    <CardDescription>
                      Common questions about AI configuration
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-1">Which provider should I choose?</h4>
                      <p className="text-sm text-muted-foreground">
                        Both Kimi and DeepSeek work well for our features. Kimi (Moonshot AI) offers generous free credits 
                        for new users. DeepSeek is known for strong reasoning capabilities.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Is my API key secure?</h4>
                      <p className="text-sm text-muted-foreground">
                        Your API key is stored locally in your browser and is only sent directly to the AI provider. 
                        We never store your keys on our servers.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">What is the Platform Access Code?</h4>
                      <p className="text-sm text-muted-foreground">
                        If you've been given a platform access code (e.g., for a workshop or course), 
                        you can use the platform's shared API instead of providing your own key.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </>
  );
};

export default ConfigureAI;
