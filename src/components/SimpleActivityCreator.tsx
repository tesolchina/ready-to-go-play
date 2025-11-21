import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Copy, Check, Download, MessageSquare, Send, AlertTriangle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAIServiceGuard } from "@/hooks/useAIServiceGuard";
import { Link } from "react-router-dom";
import { getAIHeaders } from "@/lib/aiServiceGuard";

const DEFAULT_SYSTEM_PROMPT_TEMPLATE = `You are an experienced language teacher. The student is asked to come up with a counterargument and a rebuttal in response to the following claim: 
"{ARGUMENT}"

Your job is to first check if there is a counterargument and a rebuttal in the student's answer. 
Then whether the counterargument is a valid challenge. And whether the rebuttal is relevant and addresses the challenge. 
You should also explore other possible challenges and rebuttals in your answer. 
Your comments on the student's response should be critical and constructive.  You should offer actionable insights to help the student improve their writing and critical thinking skills.`;

export const SimpleActivityCreator = () => {
  const { isActivated, checkAndNotify } = useAIServiceGuard();
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT_TEMPLATE);
  const [argument, setArgument] = useState("");
  const [generatedSystemPrompt, setGeneratedSystemPrompt] = useState("");
  const [copied, setCopied] = useState(false);
  
  // Chatbot state
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [userInput, setUserInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!checkAndNotify()) {
      return;
    }

    if (!systemPrompt.trim() || !argument.trim()) {
      toast.error("Please fill in the system prompt and the argument");
      return;
    }

    if (systemPrompt.length > 3000) {
      toast.error("System prompt must be less than 3000 characters");
      return;
    }

    if (argument.length > 1000) {
      toast.error("Argument must be less than 1000 characters");
      return;
    }

    // Replace {ARGUMENT} placeholder with the actual argument if it exists in the prompt
    const finalSystemPrompt = systemPrompt.trim().replace(/{ARGUMENT}/g, `"${argument.trim()}"`);
    setGeneratedSystemPrompt(finalSystemPrompt);
    setShowChatbot(true);
    setChatMessages([]);
    toast.success("Feedback chatbot ready!");
  };

  const handleArgumentChange = (value: string) => {
    setArgument(value);
    // Optionally update the system prompt with the argument if {ARGUMENT} placeholder exists
    if (systemPrompt.includes("{ARGUMENT}")) {
      const updatedPrompt = DEFAULT_SYSTEM_PROMPT_TEMPLATE.replace(/{ARGUMENT}/g, value ? `"${value}"` : "{ARGUMENT}");
      // Only update if user hasn't manually edited the template significantly
      if (systemPrompt === DEFAULT_SYSTEM_PROMPT_TEMPLATE || systemPrompt.includes("{ARGUMENT}")) {
        setSystemPrompt(updatedPrompt);
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedSystemPrompt || systemPrompt);
    setCopied(true);
    toast.success("System prompt copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || isSending) return;

    if (!checkAndNotify()) {
      return;
    }

    const newUserMessage = { role: 'user' as const, content: userInput.trim() };
    setChatMessages(prev => [...prev, newUserMessage]);
    setUserInput("");
    setIsSending(true);

    try {
      const aiHeaders = getAIHeaders();
      const { data, error } = await supabase.functions.invoke("simple-activity-chat", {
        body: {
          systemPrompt: generatedSystemPrompt || systemPrompt,
          userMessage: newUserMessage.content,
          chatHistory: chatMessages,
        },
        headers: aiHeaders,
      });

      if (error) throw error;

      setChatMessages(prev => [...prev, { role: 'assistant', content: data.feedback }]);
    } catch (error) {
      console.error("Error getting feedback:", error);
      toast.error("Failed to get feedback. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleDownload = () => {
    const downloadData = {
      activityInfo: {
        argument,
        createdAt: new Date().toISOString(),
      },
      systemPrompt: generatedSystemPrompt || systemPrompt,
      chatHistory: chatMessages,
    };

    const blob = new Blob([JSON.stringify(downloadData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `activity-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Activity data downloaded!");
  };

  useEffect(() => {
    if (chatMessages.length > 0) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  return (
    <div className="space-y-6">
      {!isActivated && (
        <Alert className="bg-destructive/10 border-destructive/30">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <AlertDescription className="text-base text-foreground ml-2 flex items-center justify-between">
            <span>
              <strong>AI services not configured.</strong> Please configure your API key to use this feature.
            </span>
            <Link to="/lessons">
              <Button variant="destructive" size="sm" className="ml-4">
                Configure Now
              </Button>
            </Link>
          </AlertDescription>
        </Alert>
      )}
      
      <Alert className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
        <AlertDescription className="text-base text-foreground">
          <strong>Now it's your turn!</strong> Write a system prompt to customize a chatbot that offers feedback on a specific task.
          This demonstrates how you can use AI to provide personalized feedback at scale.
        </AlertDescription>
      </Alert>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="systemPrompt" className="text-lg font-semibold">
              System Prompt *
            </Label>
            <p className="text-sm text-muted-foreground mt-1 mb-2">
              Edit the system prompt template below. Use <code className="bg-muted px-1 py-0.5 rounded">{"{ARGUMENT}"}</code> as a placeholder for the claim/argument that will be inserted automatically, or replace it with your specific argument.
            </p>
            <Textarea
              id="systemPrompt"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="text-base min-h-[250px] font-mono text-sm"
              maxLength={3000}
              required
            />
            <p className="text-sm text-muted-foreground mt-2">{systemPrompt.length}/3000 characters</p>
          </div>

          <div>
            <Label htmlFor="argument" className="text-lg font-semibold">
              The Argument/Claim *
            </Label>
            <p className="text-sm text-muted-foreground mt-1 mb-2">
              What statement should students address a counter-argument to? (This will replace <code className="bg-muted px-1 py-0.5 rounded">{"{ARGUMENT}"}</code> in the system prompt above)
            </p>
            <Textarea
              id="argument"
              value={argument}
              onChange={(e) => handleArgumentChange(e.target.value)}
              placeholder='e.g., "Traditional teaching methods are more effective than AI-enhanced learning for developing critical thinking skills."'
              className="text-base min-h-[120px]"
              maxLength={1000}
              required
            />
            <p className="text-sm text-muted-foreground mt-2">{argument.length}/1000 characters</p>
          </div>

          <Button type="submit" disabled={!isActivated} size="lg" className="w-full text-base">
            Generate AI Feedback Chatbot
          </Button>
        </form>
      </Card>

      {generatedSystemPrompt && showChatbot && (
        <>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold">Your System Prompt</h3>
              <div className="flex gap-2">
                <Button onClick={handleCopy} variant="outline" size="sm">
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
                <Button onClick={handleDownload} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
            <div className="bg-muted p-4 rounded-lg prose prose-base max-w-none">
              <ReactMarkdown>{generatedSystemPrompt}</ReactMarkdown>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Use this prompt in your AI chatbot or teaching assistant tool to provide consistent, helpful feedback to students.
              <strong>Note:</strong> There is more work to be done on improving this chatbot's feedback quality.
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold">Test Chatbot (Temporary)</h3>
              <Alert className="w-auto p-2 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                <AlertDescription className="text-sm">
                  ⚠️ Session only - not saved
                </AlertDescription>
              </Alert>
            </div>

            <ScrollArea className="h-[400px] rounded-lg border bg-background p-4 mb-4">
              {chatMessages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <p className="text-center">
                    Start by typing a counter-argument to:<br />
                    <span className="font-semibold mt-2 block">"{argument}"</span>
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${
                          msg.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
              )}
            </ScrollArea>

            <div className="flex gap-2">
              <Textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type your response here..."
                className="min-h-[80px]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={isSending}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!userInput.trim() || isSending || !isActivated}
                size="lg"
              >
                {isSending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};
