import { useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

export const PromptBuilder = () => {
  const [context, setContext] = useState("");
  const [task, setTask] = useState("");
  const [constraints, setConstraints] = useState("");
  const [examples, setExamples] = useState("");

  const generatedPrompt = `${context ? `CONTEXT:\n${context}\n\n` : ""}${
    task ? `TASK:\n${task}\n\n` : ""
  }${constraints ? `CONSTRAINTS:\n${constraints}\n\n` : ""}${
    examples ? `EXAMPLES:\n${examples}` : ""
  }`.trim();

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
        <div className="mt-6 bg-gradient-to-r from-warning/20 to-warning/10 rounded-xl p-5 border-l-4 border-warning">
          <h4 className="font-semibold text-warning-foreground mb-3">
            ✨ Your Generated Prompt:
          </h4>
          <div className="bg-card p-4 rounded-lg">
            <pre className="whitespace-pre-wrap font-mono text-sm text-foreground leading-relaxed max-h-96 overflow-y-auto">
              {generatedPrompt}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
