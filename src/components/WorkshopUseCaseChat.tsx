import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Bot, User, Share2, Loader2, Sparkles, Copy, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const WorkshopUseCaseChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('workshop-use-case-chat', {
        body: { 
          userMessage,
          chatHistory: messages
        }
      });

      if (error) throw error;

      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyConversation = () => {
    const text = messages.map(m => 
      `${m.role === 'user' ? '👤 Participant' : '🤖 AI Assistant'}:\n${m.content}`
    ).join('\n\n---\n\n');
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Conversation copied to clipboard. You can share it with others.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="border-2 border-indigo-300 dark:border-indigo-700">
      <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5" />
          Explore Your Use Case with AI
        </CardTitle>
        <p className="text-sm text-indigo-100">
          Describe your repetitive task and get suggestions for Input-Process-Output automation
        </p>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {/* Chat Messages */}
        <div className="min-h-[200px] max-h-[400px] overflow-y-auto space-y-4 p-3 bg-muted/30 rounded-lg">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <Bot className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Describe a repetitive task you'd like to automate.</p>
              <p className="text-xs mt-2">Example: "I need to grade 50 student essays and provide feedback on each one."</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background border shadow-sm'
                  }`}
                >
                  {message.role === 'assistant' ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  )}
                </div>
                {message.role === 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <User className="h-5 w-5 text-primary-foreground" />
                  </div>
                )}
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="bg-background border rounded-lg p-3 shadow-sm">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your use case... (e.g., 'I want to analyze survey responses from 100 participants')"
            className="flex-1 min-h-[80px] resize-none"
            disabled={isLoading}
          />
          <div className="flex flex-col gap-2">
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="h-10"
            >
              <Send className="h-4 w-4" />
            </Button>
            {messages.length > 0 && (
              <Button
                variant="outline"
                onClick={copyConversation}
                className="h-10"
                title="Copy conversation to share"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </div>

        {messages.length > 0 && (
          <p className="text-xs text-muted-foreground text-center">
            <Share2 className="h-3 w-3 inline mr-1" />
            Click the copy button to share your conversation with others
          </p>
        )}

        <p className="text-xs text-muted-foreground text-center italic">
          Powered by Claude Sonnet 4 via OpenRouter
        </p>
      </CardContent>
    </Card>
  );
};
