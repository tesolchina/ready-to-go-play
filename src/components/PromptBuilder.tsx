import { useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Loader2, Send } from "lucide-react";
import { Input } from "./ui/input";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface PromptBuilderProps {
  onSubmit: (prompt: string) => Promise<void>;
  isSubmitting: boolean;
  feedback: string | null;
  onFollowUp: (message: string, conversationHistory: Message[]) => Promise<string>;
}

export const PromptBuilder = ({ onSubmit, isSubmitting, feedback, onFollowUp }: PromptBuilderProps) => {
  const [context, setContext] = useState("");
  const [task, setTask] = useState("");
  const [constraints, setConstraints] = useState("");
  const [examples, setExamples] = useState("");
  const [conversation, setConversation] = useState<Message[]>([]);
  const [followUpMessage, setFollowUpMessage] = useState("");
  const [isFollowUpSubmitting, setIsFollowUpSubmitting] = useState(false);

  const generatedPrompt = `${context ? `CONTEXT:\n${context}\n\n` : ""}${
    task ? `TASK:\n${task}\n\n` : ""
  }${constraints ? `CONSTRAINTS:\n${constraints}\n\n` : ""}${
    examples ? `EXAMPLES:\n${examples}` : ""
  }`.trim();

  const handleSubmit = async () => {
    if (generatedPrompt.trim()) {
      setConversation([]);
      await onSubmit(generatedPrompt);
    }
  };

  const handleFollowUpSubmit = async () => {
    if (!followUpMessage.trim()) return;
    
    const userMessage: Message = { role: "user", content: followUpMessage };
    const updatedConversation = [...conversation, userMessage];
    setConversation(updatedConversation);
    setFollowUpMessage("");
    setIsFollowUpSubmitting(true);

    try {
      const response = await onFollowUp(followUpMessage, conversation);
      const assistantMessage: Message = { role: "assistant", content: response };
      setConversation([...updatedConversation, assistantMessage]);
    } catch (error) {
      console.error("Error in follow-up:", error);
    } finally {
      setIsFollowUpSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-accent to-card rounded-2xl p-6 border-4 border-primary/30 my-6">
      <h3 className="text-xl font-bold mb-6 text-foreground">
        🛠️ Interactive Prompt Builder
      </h3>
      
      <div className="grid gap-5">
        <div className="bg-card rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3 pb-2 border-b-2 border-primary">
            <span className="text-3xl">📋</span>
            <h4 className="font-semibold text-foreground">Context</h4>
          </div>
          <Textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Define the role and audience..."
            className="min-h-[80px]"
          />
          <p className="mt-2 text-sm text-primary bg-primary/10 p-2 rounded">
            Example: "You are an experienced biology professor creating content for first-year undergraduates"
          </p>
        </div>

        <div className="bg-card rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3 pb-2 border-b-2 border-primary">
            <span className="text-3xl">✏️</span>
            <h4 className="font-semibold text-foreground">Task</h4>
          </div>
          <Textarea
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Specify what AI should create..."
            className="min-h-[80px]"
          />
          <p className="mt-2 text-sm text-primary bg-primary/10 p-2 rounded">
            Example: "Create a 10-question multiple-choice quiz about photosynthesis"
          </p>
        </div>

        <div className="bg-card rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3 pb-2 border-b-2 border-primary">
            <span className="text-3xl">🔒</span>
            <h4 className="font-semibold text-foreground">Constraints</h4>
          </div>
          <Textarea
            value={constraints}
            onChange={(e) => setConstraints(e.target.value)}
            placeholder="Define limitations and requirements..."
            className="min-h-[80px]"
          />
          <p className="mt-2 text-sm text-primary bg-primary/10 p-2 rounded">
            Example: "Each question should have 4 options, difficulty should increase progressively"
          </p>
        </div>

        <div className="bg-card rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3 pb-2 border-b-2 border-primary">
            <span className="text-3xl">💡</span>
            <h4 className="font-semibold text-foreground">Examples</h4>
          </div>
          <Textarea
            value={examples}
            onChange={(e) => setExamples(e.target.value)}
            placeholder="Show desired format or style..."
            className="min-h-[80px]"
          />
          <p className="mt-2 text-sm text-primary bg-primary/10 p-2 rounded">
            Example: "Format: Question text (A) option 1 (B) option 2 (C) option 3 (D) option 4"
          </p>
        </div>
      </div>

      {generatedPrompt && (
        <div className="bg-accent/50 rounded-xl p-6 border-2 border-primary/30 mt-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <span className="text-2xl">✨</span>
            Your Generated Prompt
          </h3>
          <pre className="whitespace-pre-wrap text-sm bg-card p-4 rounded-lg border border-border text-foreground mb-4">
            {generatedPrompt}
          </pre>
          
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !generatedPrompt.trim()}
            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Getting AI Feedback...
              </>
            ) : (
              "Submit and Receive AI Feedback"
            )}
          </Button>

          {feedback && (
            <div className="mt-4 space-y-4">
              <div className="p-4 rounded-lg bg-success/10 border-2 border-success/30">
                <h4 className="font-semibold mb-2 flex items-center gap-2 text-success-foreground">
                  <span className="text-xl">🤖</span>
                  AI Feedback
                </h4>
                <p className="text-sm text-foreground/90 whitespace-pre-wrap">{feedback}</p>
              </div>

              {/* Conversation Thread */}
              {conversation.length > 0 && (
                <div className="space-y-3">
                  {conversation.map((message, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg ${
                        message.role === "user"
                          ? "bg-primary/10 border border-primary/30 ml-8"
                          : "bg-muted border border-border mr-8"
                      }`}
                    >
                      <p className="text-sm font-semibold mb-1">
                        {message.role === "user" ? "You" : "AI"}
                      </p>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Follow-up Input */}
              <div className="flex gap-2">
                <Input
                  value={followUpMessage}
                  onChange={(e) => setFollowUpMessage(e.target.value)}
                  placeholder="Ask a follow-up question..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleFollowUpSubmit();
                    }
                  }}
                  disabled={isFollowUpSubmitting}
                  className="flex-1"
                />
                <Button
                  onClick={handleFollowUpSubmit}
                  disabled={isFollowUpSubmitting || !followUpMessage.trim()}
                  size="icon"
                >
                  {isFollowUpSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
