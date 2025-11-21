import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  ExternalLink, 
  Send, 
  Loader2, 
  Download, 
  Share2, 
  Copy, 
  Check,
  MessageSquare,
  BookOpen,
  HelpCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Code,
  FileCode
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useAIServiceGuard } from "@/hooks/useAIServiceGuard";
import { getAIHeaders } from "@/lib/aiServiceGuard";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const WILEY_URL = "https://www.wiley.com/en-cn/publish/article/ai-guidelines/?utm_campaign=1735559&utm_source=adobeEmail&utm_medium=Email&utm_term=1525756-B2BAI-Usage-AI+guidelines+for+researchers+email&utm_content=EM1NR-1525756-B2BAI-Usage-AI-guidelines-for-researchers-email&recId=%40bYORmXyFfksQ%2FQMKME2XsC6gQVnV7VoPsnppJGGt8D8raTgxeBu2bBZcwxpPNOeS&cid=DM519640&bid=ac8a2fa5-80b9-45b5-aa1d-3078cd4ba1d4";

const SUGGESTED_QUESTIONS = [
  "What are the key principles for using AI responsibly in research?",
  "How should I disclose AI use in my manuscript?",
  "What are the copyright implications of using AI tools?",
  "Can AI tools be listed as authors on my paper?",
  "How do I protect my intellectual property when using AI?",
  "What are the differences between Wiley, Elsevier, and other publishers' AI policies?",
  "What should I consider when choosing an AI tool for research?",
  "How do I evaluate AI tools for privacy and data protection?",
];

const WileyAIGuidelines = () => {
  const [userInput, setUserInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isOverviewOpen, setIsOverviewOpen] = useState(true);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const { toast } = useToast();
  const { isActivated, checkAndNotify } = useAIServiceGuard();

  const handleSendMessage = async (question?: string) => {
    const message = question || userInput.trim();
    if (!message || isSending) return;

    if (!checkAndNotify()) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: message,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setUserInput("");
    setIsSending(true);

    try {
      const { data, error } = await supabase.functions.invoke("wiley-ai-guidelines-chat", {
        body: {
          userMessage: message,
          chatHistory: chatMessages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        },
        headers: getAIHeaders(),
      });

      if (error) throw error;

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: data.feedback || data.response || "I apologize, but I couldn't generate a response.",
        timestamp: new Date(),
      };

      setChatMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error("Error getting response:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to get response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleShare = async () => {
    if (chatMessages.length === 0) {
      toast({
        title: "Nothing to share",
        description: "Please start a conversation first before sharing.",
        variant: "destructive",
      });
      return;
    }

    // Share functionality temporarily disabled - database table not configured
    toast({
      title: "Share feature coming soon",
      description: "This feature is being updated. For now, you can export the chat history instead.",
    });
  };

  const copyShareLink = async () => {
    if (!shareLink) return;

    try {
      await navigator.clipboard.writeText(shareLink);
      setIsCopied(true);
      toast({
        title: "Link copied!",
        description: "The share link has been copied to your clipboard.",
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually.",
        variant: "destructive",
      });
    }
  };

  const downloadChatHistory = () => {
    if (chatMessages.length === 0) {
      toast({
        title: "Nothing to download",
        description: "Please start a conversation first.",
        variant: "destructive",
      });
      return;
    }

    let markdown = `# Wiley AI Guidelines Chat History\n\n`;
    markdown += `Generated on: ${new Date().toLocaleString()}\n\n`;
    markdown += `Official Wiley AI Guidelines: ${WILEY_URL}\n\n`;
    markdown += `---\n\n`;

    chatMessages.forEach((msg, index) => {
      markdown += `## ${msg.role === "user" ? "Question" : "Answer"} ${index + 1}\n\n`;
      markdown += `**Role:** ${msg.role === "user" ? "User" : "Assistant"}\n\n`;
      markdown += `**Time:** ${msg.timestamp.toLocaleString()}\n\n`;
      markdown += `${msg.content}\n\n`;
      markdown += `---\n\n`;
    });

    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `wiley-ai-guidelines-chat-${new Date().toISOString().split("T")[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download complete",
      description: "Chat history has been downloaded.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/learning-apps">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Learning Apps
            </Button>
          </Link>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Wiley AI Guidelines for Research
              </h1>
              <p className="text-muted-foreground text-lg mb-4">
                A comprehensive guide for research authors, editors, and reviewers on using AI tools responsibly
              </p>
              <a
                href={WILEY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                <ExternalLink className="w-4 h-4" />
                View Official Wiley AI Guidelines
              </a>
            </div>
          </div>
        </div>

        {/* How This App Works Section */}
        <Card className="mb-6">
          <Collapsible open={isHowItWorksOpen} onOpenChange={setIsHowItWorksOpen}>
            <CardHeader>
              <CollapsibleTrigger className="flex items-center justify-between w-full hover:opacity-80 transition-opacity">
                <div className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-primary" />
                  <CardTitle>How This App Works</CardTitle>
                </div>
                {isHowItWorksOpen ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </CollapsibleTrigger>
              <CardDescription>
                Technical details about this application's implementation
              </CardDescription>
            </CardHeader>
            <CollapsibleContent>
              <CardContent className="space-y-6">
                {/* Explanation */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Application Overview
                  </h3>
                  <div className="text-sm text-muted-foreground space-y-2 bg-muted/50 p-4 rounded-lg">
                    <p>
                      This application is a chatbot interface that helps researchers understand AI usage guidelines 
                      from major academic publishers including Wiley, Elsevier, Oxford University Press, Sage, 
                      Springer Nature, and Taylor & Francis.
                    </p>
                    <p>
                      When you ask a question, it's sent to a Supabase Edge Function that communicates with AI models 
                      (Kimi or DeepSeek) to provide accurate responses based on the comprehensive system prompt containing 
                      all publisher guidelines. The AI is instructed to cite guidelines with direct quotations for transparency.
                    </p>
                    <p>
                      The chat history is maintained in your browser session, and you can download your conversation 
                      as a markdown file for future reference.
                    </p>
                  </div>
                </div>

                {/* Source Files */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FileCode className="w-4 h-4" />
                    Source Files
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm p-3 bg-muted/50 rounded-lg">
                      <FileCode className="w-4 h-4 text-primary" />
                      <div className="flex-1">
                        <div className="font-medium">supabase/functions/wiley-ai-guidelines-chat/index.ts</div>
                        <div className="text-xs text-muted-foreground">Edge function handling AI requests</div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center gap-2 text-sm p-3 bg-muted/50 rounded-lg">
                      <FileCode className="w-4 h-4 text-primary" />
                      <div className="flex-1">
                        <div className="font-medium">src/pages/WileyAIGuidelines.tsx</div>
                        <div className="text-xs text-muted-foreground">Main UI component for this page</div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center gap-2 text-sm p-3 bg-muted/50 rounded-lg">
                      <FileCode className="w-4 h-4 text-primary" />
                      <div className="flex-1">
                        <div className="font-medium">src/lib/aiServiceGuard.ts</div>
                        <div className="text-xs text-muted-foreground">AI service authentication and headers</div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center gap-2 text-sm p-3 bg-muted/50 rounded-lg">
                      <FileCode className="w-4 h-4 text-primary" />
                      <div className="flex-1">
                        <div className="font-medium">src/hooks/useAIServiceGuard.ts</div>
                        <div className="text-xs text-muted-foreground">React hook for AI service checks</div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>

                {/* System Prompt */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    System Prompt
                  </h3>
                  <div className="text-xs font-mono bg-muted/80 p-4 rounded-lg overflow-x-auto">
                    <pre className="whitespace-pre-wrap">
{`You are an expert assistant specializing in AI guidelines for academic publishing. 
You have comprehensive knowledge of AI policies from major academic publishers including 
Wiley, Elsevier, Oxford University Press, Sage, Springer Nature, and Taylor & Francis.

CRITICAL INSTRUCTION: When referencing any guideline or policy, you MUST cite it with 
a direct quotation using quotation marks. Always attribute the quote to the specific 
publisher (e.g., "According to Wiley: '[exact quote]'").

Your knowledge base includes:

- Wiley AI Guidelines (key principles on disclosure, human oversight, IP protection)
- Elsevier AI Policy (privacy, verification, disclosure requirements)
- Oxford University Press Guidelines (authorship, accountability, transparency)
- Sage AI Policy (disclosure requirements, editorial confidentiality)
- Springer Nature Principles (LLM documentation, image restrictions)
- Taylor & Francis Guidelines (responsible use, acknowledgment requirements)
- Moorhouse 2025 Research Insights (applied linguistics editors' perspectives)

When answering:
1. ALWAYS cite guidelines with direct quotations
2. Attribute each quote to the specific publisher
3. Compare policies across publishers when relevant
4. Emphasize transparency and author accountability`}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Guidelines Display Section */}
          <Card className="lg:col-span-1">
            <Collapsible open={isOverviewOpen} onOpenChange={setIsOverviewOpen}>
              <CardHeader>
                <CollapsibleTrigger className="flex items-center justify-between w-full hover:opacity-80 transition-opacity">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <CardTitle>AI Guidelines Overview</CardTitle>
                  </div>
                  {isOverviewOpen ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </CollapsibleTrigger>
                <CardDescription>
                  Key principles and best practices for using AI in research
                </CardDescription>
              </CardHeader>
              <CollapsibleContent>
                <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => (
                        <h1 className="text-2xl font-bold mt-6 mb-4">{children}</h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-xl font-semibold mt-5 mb-3">{children}</h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-lg font-medium mt-4 mb-2">{children}</h3>
                      ),
                      p: ({ children }) => (
                        <p className="mb-3 text-muted-foreground">{children}</p>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc ml-6 mb-4 space-y-1">{children}</ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal ml-6 mb-4 space-y-1">{children}</ol>
                      ),
                      li: ({ children }) => (
                        <li className="text-muted-foreground">{children}</li>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-semibold text-foreground">{children}</strong>
                      ),
                      a: ({ href, children }) => (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline inline-flex items-center gap-1"
                        >
                          {children}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ),
                    }}
                  >
                    {`# Using AI tools in your research

## A guide for research authors, editors, and reviewers

Generative AI tools are rapidly transforming the research landscape, offering new ways to analyze data, refine writing, and accelerate discovery. Whether you're experimenting with these technologies or regularly integrating them into your work, using AI responsibly helps ensure your work remains original, ethical, and aligned with scholarly standards.

## Key Principles

### Review Terms and Conditions
Before choosing an AI Technology, carefully review its terms and conditions. Ensure it doesn't claim ownership of your content or impose limitations that could interfere with publication rights.

### Human Oversight
AI Technology should be a companion to your writing process, not a replacement. Authors must take full responsibility for accuracy and verify all claims, citations, and analyses.

### Disclosure
Authors must disclose the use of AI Technologies when submitting manuscripts. Transparency is essential to maintain integrity in publishing.

### Rights Protection
Authors must not use any AI Technology that restricts their own, publisher's, or other party's use of the material. Ensure the AI tool doesn't gain rights over your content beyond performing the service.

### Responsible and Ethical Use
Use AI Technology in a manner that aligns with privacy, confidentiality, and compliance obligations. Respect data protection laws and fact-check AI-generated content.

[View the complete guidelines on Wiley's website](${WILEY_URL})`}
                  </ReactMarkdown>
                </div>
              </ScrollArea>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Chatbot Section */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  <CardTitle>AI Guidelines Assistant</CardTitle>
                </div>
                {chatMessages.length > 0 && (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleShare}
                      variant="outline"
                      size="sm"
                      disabled={isSharing}
                    >
                      {isSharing ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Share2 className="w-4 h-4 mr-2" />
                      )}
                      Share
                    </Button>
                    <Button onClick={downloadChatHistory} variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                )}
              </div>
              <CardDescription>
                Ask questions about AI guidelines from Wiley and other major publishers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Suggested Questions */}
              {chatMessages.length === 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <HelpCircle className="w-4 h-4" />
                    <span>Suggested questions:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_QUESTIONS.slice(0, 4).map((question, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer hover:bg-primary/10 transition-colors"
                        onClick={() => handleSendMessage(question)}
                      >
                        {question}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat Messages */}
              <ScrollArea className="h-[400px] pr-4 border rounded-lg p-4">
                {chatMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                    <MessageSquare className="w-12 h-12 mb-4 opacity-50" />
                    <p>Start a conversation by asking a question about AI guidelines</p>
                    <p className="text-sm mt-2">
                      The assistant has knowledge of Wiley, Elsevier, Oxford, Sage, Springer, Taylor & Francis, and other publisher guidelines
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {chatMessages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex gap-3 ${
                          msg.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            msg.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <div className="text-sm prose prose-sm max-w-none dark:prose-invert">
                            <ReactMarkdown>
                              {msg.content}
                            </ReactMarkdown>
                          </div>
                          <p className="text-xs opacity-70 mt-2">
                            {msg.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    {isSending && (
                      <div className="flex gap-3 justify-start">
                        <div className="bg-muted rounded-lg p-3">
                          <Loader2 className="w-5 h-5 animate-spin" />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </ScrollArea>

              {/* Input Area */}
              <div className="space-y-2">
                <Textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Ask a question about AI guidelines..."
                  className="min-h-[100px]"
                  disabled={isSending || !isActivated}
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    Press Enter to send, Shift+Enter for new line
                  </p>
                  <Button
                    onClick={() => handleSendMessage()}
                    disabled={!userInput.trim() || isSending || !isActivated}
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send
                      </>
                    )}
                  </Button>
                </div>
                {!isActivated && (
                  <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      AI services not configured. Please{" "}
                      <Link to="/lessons" className="underline font-medium">
                        configure your API key
                      </Link>{" "}
                      to use the chatbot.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Share Link Display */}
        {shareLink && (
          <Card className="mt-6 border-primary bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Share2 className="h-5 w-5" />
                Share Link Created
              </CardTitle>
              <CardDescription>
                Anyone with this link can view your chat history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  className="flex-1 px-3 py-2 text-sm border rounded-md bg-background"
                />
                <Button onClick={copyShareLink} variant="outline" size="icon">
                  {isCopied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default WileyAIGuidelines;

