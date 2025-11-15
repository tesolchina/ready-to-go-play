import { useState, useRef, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Send, BookOpen } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const AcademicPhraseBank = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("academic-phrasebank-chat", {
        body: { messages: newMessages },
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: "assistant",
        content: data.message,
      };
      setMessages([...newMessages, assistantMessage]);
    } catch (error) {
      console.error("Error calling chatbot:", error);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="h-[calc(100vh-12rem)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              Academic PhraseBank Assistant
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Get help with academic writing phrases, sentence structures, and language patterns
            </p>
          </CardHeader>
          <CardContent className="flex flex-col h-[calc(100%-5rem)]">
            <ScrollArea className="flex-1 pr-4 mb-4" ref={scrollRef}>
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-8">
                  <BookOpen className="h-16 w-16 text-muted-foreground" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Welcome to Academic PhraseBank</h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      Ask me for help with academic writing phrases, transitions, citations, or any
                      language patterns you need for your research papers.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 w-full max-w-2xl">
                    <Button
                      variant="outline"
                      className="h-auto py-3 px-4 text-left"
                      onClick={() => setInput("How do I introduce a research gap in my paper?")}
                    >
                      <span className="text-sm">How do I introduce a research gap?</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto py-3 px-4 text-left"
                      onClick={() => setInput("What are some phrases for discussing limitations?")}
                    >
                      <span className="text-sm">Phrases for discussing limitations</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto py-3 px-4 text-left"
                      onClick={() => setInput("Help me with transition phrases between sections")}
                    >
                      <span className="text-sm">Transition phrases between sections</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto py-3 px-4 text-left"
                      onClick={() => setInput("How do I present statistical results formally?")}
                    >
                      <span className="text-sm">Present statistical results</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-lg px-4 py-2 bg-muted">
                        <Skeleton className="h-4 w-[250px] mb-2" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>

            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about academic phrases, writing structures, or get examples..."
                className="min-h-[60px] max-h-[120px]"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                size="icon"
                className="h-[60px] w-[60px]"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AcademicPhraseBank;
