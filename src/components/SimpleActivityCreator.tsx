import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Clock, Users, Copy, Check, Download, MessageSquare, Send } from "lucide-react";
import { requestQueue } from "@/lib/requestQueue";
import ReactMarkdown from "react-markdown";
import { ScrollArea } from "@/components/ui/scroll-area";

export const SimpleActivityCreator = () => {
  const [nickname, setNickname] = useState("");
  const [argument, setArgument] = useState("");
  const [feedbackGuidance, setFeedbackGuidance] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [queuePosition, setQueuePosition] = useState<{ position: number; total: number } | null>(null);
  const [systemPrompt, setSystemPrompt] = useState("");
  const [copied, setCopied] = useState(false);
  const [progressMessage, setProgressMessage] = useState<string>("");
  const requestIdRef = useRef<string | null>(null);
  
  // Chatbot state
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [userInput, setUserInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (requestIdRef.current) {
        requestQueue.removeListener(requestIdRef.current);
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nickname.trim() || !argument.trim()) {
      toast.error("Please fill in your nickname and the argument");
      return;
    }

    if (nickname.length > 50) {
      toast.error("Nickname must be less than 50 characters");
      return;
    }

    if (argument.length > 1000) {
      toast.error("Argument must be less than 1000 characters");
      return;
    }

    setIsSubmitting(true);
    setQueuePosition(null);
    setProgressMessage("Preparing your request...");

    try {
      const data = await requestQueue.add(async () => {
        requestIdRef.current = crypto.randomUUID();
        setProgressMessage("Connecting to AI...");

        requestQueue.onQueueChange(requestIdRef.current, (position, total) => {
          if (position > 0) {
            setQueuePosition({ position, total });
          } else {
            setQueuePosition(null);
          }
        });

        setProgressMessage("Generating your activity prompt...");
        
        const { data, error } = await supabase.functions.invoke("generate-simple-activity", {
          body: {
            nickname: nickname.trim(),
            argument: argument.trim(),
            feedbackGuidance: feedbackGuidance.trim() || "Be encouraging and specific",
          },
        });

        if (error) throw error;
        return data;
      });

      setSystemPrompt(data.systemPrompt);
      toast.success("System prompt generated successfully!");
    } catch (error: any) {
      console.error("Error generating system prompt:", error);

      if (error?.status === 429) {
        toast.error("System is currently busy. Your request has been queued.");
      } else {
        toast.error("Failed to generate system prompt. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
      setQueuePosition(null);
      setProgressMessage("");
      if (requestIdRef.current) {
        requestQueue.removeListener(requestIdRef.current);
        requestIdRef.current = null;
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(systemPrompt);
    setCopied(true);
    toast.success("System prompt copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestChatbot = () => {
    setShowChatbot(true);
    setChatMessages([]);
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || isSending) return;

    const newUserMessage = { role: 'user' as const, content: userInput.trim() };
    setChatMessages(prev => [...prev, newUserMessage]);
    setUserInput("");
    setIsSending(true);

    try {
      const { data, error } = await supabase.functions.invoke("simple-activity-chat", {
        body: {
          systemPrompt,
          userMessage: newUserMessage.content,
          chatHistory: chatMessages,
        },
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
        nickname,
        argument,
        feedbackGuidance: feedbackGuidance || "Be encouraging and specific",
        createdAt: new Date().toISOString(),
      },
      systemPrompt,
      chatHistory: chatMessages,
    };

    const blob = new Blob([JSON.stringify(downloadData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `activity-${nickname.replace(/\s+/g, '-')}-${Date.now()}.json`;
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
      <Alert className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
        <AlertDescription className="text-base text-foreground">
          <strong>Now it's your turn!</strong> Create a similar counter-argument exercise for your students.
          The system will generate an AI feedback prompt tailored to your activity.
        </AlertDescription>
      </Alert>

      {isSubmitting && queuePosition && queuePosition.position > 0 && (
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertDescription className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="text-base">
              You are <strong>#{queuePosition.position}</strong> in queue. {queuePosition.total} total requests being processed.
              Estimated wait time: <strong>{Math.ceil(queuePosition.position * 20)} seconds</strong>
            </span>
          </AlertDescription>
        </Alert>
      )}

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="nickname" className="text-lg font-semibold">
              Your Nickname *
            </Label>
            <p className="text-sm text-muted-foreground mt-1 mb-2">
              Your name as the activity creator
            </p>
            <Input
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="e.g., Jenny"
              className="text-base"
              maxLength={50}
              required
            />
          </div>

          <div>
            <Label htmlFor="argument" className="text-lg font-semibold">
              The Argument/Claim *
            </Label>
            <p className="text-sm text-muted-foreground mt-1 mb-2">
              What statement should students address a counter-argument to?
            </p>
            <Textarea
              id="argument"
              value={argument}
              onChange={(e) => setArgument(e.target.value)}
              placeholder='e.g., "Traditional teaching methods are more effective than AI-enhanced learning for developing critical thinking skills."'
              className="text-base min-h-[120px]"
              maxLength={1000}
              required
            />
            <p className="text-sm text-muted-foreground mt-2">{argument.length}/1000 characters</p>
          </div>

          <div>
            <Label htmlFor="feedback" className="text-lg font-semibold">
              Feedback Guidance (Optional)
            </Label>
            <p className="text-sm text-muted-foreground mt-1 mb-2">
              How should AI provide feedback? What aspects should it focus on?
            </p>
            <Textarea
              id="feedback"
              value={feedbackGuidance}
              onChange={(e) => setFeedbackGuidance(e.target.value)}
              placeholder="e.g., Focus on logic and evidence. Encourage balanced perspectives. Suggest areas for deeper analysis."
              className="text-base min-h-[100px]"
              maxLength={500}
            />
          </div>

          <Button type="submit" disabled={isSubmitting} size="lg" className="w-full text-base">
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {queuePosition && queuePosition.position > 0
                  ? `In Queue (${queuePosition.position}/${queuePosition.total})...`
                  : "Generating System Prompt..."}
              </>
            ) : (
              "Generate AI Feedback Prompt"
            )}
          </Button>
        </form>
      </Card>

      {systemPrompt && (
        <>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold">Your AI System Prompt</h3>
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
              <ReactMarkdown>{systemPrompt}</ReactMarkdown>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Use this prompt in your AI chatbot or teaching assistant tool to provide consistent, helpful feedback to students.
            </p>
          </Card>

          {!showChatbot ? (
            <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <MessageSquare className="h-5 w-5" />
              <AlertDescription className="flex items-center justify-between">
                <span className="text-base text-foreground">
                  <strong>Test your chatbot!</strong> Try it out before using with students. 
                  Note: This is temporary - chat history will be lost when you leave this page.
                </span>
                <Button onClick={handleTestChatbot} size="sm" className="ml-4">
                  Test Chatbot
                </Button>
              </AlertDescription>
            </Alert>
          ) : (
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
                  placeholder="Type your counter-argument here..."
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
                  disabled={!userInput.trim() || isSending}
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
          )}
        </>
      )}
    </div>
  );
};
