import { useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

interface PromptBuilderProps {
  onSubmit: (prompt: string) => Promise<void>;
  isSubmitting: boolean;
  feedback: string | null;
}

export const PromptBuilder = ({ onSubmit, isSubmitting, feedback }: PromptBuilderProps) => {
  const [context, setContext] = useState("");
  const [task, setTask] = useState("");
  const [constraints, setConstraints] = useState("");
  const [examples, setExamples] = useState("");

  const generatedPrompt = `${context ? `CONTEXT:\n${context}\n\n` : ""}${
    task ? `TASK:\n${task}\n\n` : ""
  }${constraints ? `CONSTRAINTS:\n${constraints}\n\n` : ""}${
    examples ? `EXAMPLES:\n${examples}` : ""
  }`.trim();

  const handleSubmit = () => {
    if (generatedPrompt.trim()) {
      onSubmit(generatedPrompt);
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
            <div className="mt-4 p-4 rounded-lg bg-success/10 border-2 border-success/30">
              <h4 className="font-semibold mb-2 flex items-center gap-2 text-success-foreground">
                <span className="text-xl">🤖</span>
                AI Feedback
              </h4>
              <p className="text-sm text-foreground/90 whitespace-pre-wrap">{feedback}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
