import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface InteractiveTaskProps {
  title: string;
  instructions: string;
  taskType: "practice" | "reflection";
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const InteractiveTask = ({ title, instructions, taskType }: InteractiveTaskProps) => {
  const [response, setResponse] = useState("");
  const [conversation, setConversation] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!response.trim()) return;

    setIsLoading(true);
    const userMessage = response;
    setResponse("");

    try {
      const { data, error } = await supabase.functions.invoke("lesson-feedback", {
        body: {
          taskType,
          taskContent: `${title}: ${instructions}`,
          studentResponse: userMessage,
          conversationHistory: conversation,
        },
      });

      if (error) throw error;

      setConversation([
        ...conversation,
        { role: "user", content: userMessage },
        { role: "assistant", content: data.feedback },
      ]);
    } catch (error: any) {
      console.error("Error getting feedback:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to get feedback",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5">
      <h3 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-primary" />
        {title}
      </h3>
      <p className="text-muted-foreground mb-4">{instructions}</p>

      {conversation.length > 0 && (
        <div className="space-y-3 mb-4 p-4 bg-background rounded-lg max-h-64 overflow-y-auto">
          {conversation.map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg ${
                msg.role === "user"
                  ? "bg-primary/10 ml-8"
                  : "bg-accent/10 mr-8"
              }`}
            >
              <p className="text-sm font-semibold mb-1">
                {msg.role === "user" ? "You" : "AI Tutor"}
              </p>
              <p className="text-sm">{msg.content}</p>
            </div>
          ))}
        </div>
      )}

      <Textarea
        placeholder="Type your response here..."
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        className="mb-3 min-h-32"
      />

      <Button
        onClick={handleSubmit}
        disabled={!response.trim() || isLoading}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Getting Feedback...
          </>
        ) : (
          "Submit for Feedback"
        )}
      </Button>
    </Card>
  );
};