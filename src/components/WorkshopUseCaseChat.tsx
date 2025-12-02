import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Bot, User, Loader2, Sparkles, Share2, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface WorkshopUseCaseChatProps {
  onConversationShared?: () => void;
}

export const WorkshopUseCaseChat = ({ onConversationShared }: WorkshopUseCaseChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [nickname, setNickname] = useState('');
  const [useCaseSummary, setUseCaseSummary] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [hasShared, setHasShared] = useState(false);
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

  const handleShare = async () => {
    if (!nickname.trim() || !useCaseSummary.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both a nickname and use case summary.",
        variant: "destructive"
      });
      return;
    }

    setIsSharing(true);
    try {
      const { error } = await supabase
        .from('workshop_shared_conversations')
        .insert([{
          nickname: nickname.trim(),
          use_case_summary: useCaseSummary.trim(),
          chat_history: JSON.parse(JSON.stringify(messages))
        }]);

      if (error) throw error;

      toast({
        title: "Shared successfully!",
        description: "Your conversation has been added to the bulletin board.",
      });
      setShowShareDialog(false);
      setHasShared(true);
      onConversationShared?.();
    } catch (error) {
      console.error('Share error:', error);
      toast({
        title: "Error",
        description: "Failed to share conversation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSharing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setHasShared(false);
  };

  return (
    <>
      <Card className="border-2 border-indigo-300 dark:border-indigo-700">
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-lg py-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5" />
            Explore Your Use Case with AI
          </CardTitle>
          <p className="text-sm text-indigo-100">
            Describe your repetitive task and get Input-Process-Output suggestions
          </p>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          {/* Chat Messages */}
          <div className="min-h-[180px] max-h-[300px] overflow-y-auto space-y-3 p-3 bg-muted/30 rounded-lg">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-6">
                <Bot className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Describe a repetitive task you'd like to automate.</p>
                <p className="text-xs mt-1">e.g., "I need to grade 50 student essays"</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg p-2.5 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background border shadow-sm'
                    }`}
                  >
                    {message.role === 'assistant' ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none text-sm">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    )}
                  </div>
                  {message.role === 'user' && (
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex gap-2 justify-start">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-background border rounded-lg p-2.5 shadow-sm">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
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
              placeholder="Describe your use case..."
              className="flex-1 min-h-[60px] resize-none text-sm"
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              size="sm"
              className="h-auto"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/* Share Button */}
          {messages.length >= 2 && (
            <div className="flex gap-2 justify-center">
              {hasShared ? (
                <Button variant="outline" size="sm" disabled className="gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Shared to Board
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowShareDialog(true)}
                  className="gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  Finish & Share to Board
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={startNewChat}>
                Start New
              </Button>
            </div>
          )}

          <p className="text-xs text-muted-foreground text-center italic">
            Powered by Claude Sonnet 4 via OpenRouter
          </p>
        </CardContent>
      </Card>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Your Use Case</DialogTitle>
            <DialogDescription>
              Add your conversation to the bulletin board so others can see your ideas.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Nickname</label>
              <Input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="e.g., Teacher_HK, Researcher_2025"
                maxLength={30}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Brief Use Case Summary</label>
              <Textarea
                value={useCaseSummary}
                onChange={(e) => setUseCaseSummary(e.target.value)}
                placeholder="e.g., Batch grading essays with AI feedback"
                className="min-h-[60px]"
                maxLength={150}
              />
              <p className="text-xs text-muted-foreground">{useCaseSummary.length}/150 characters</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowShareDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleShare} disabled={isSharing}>
              {isSharing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Share
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
