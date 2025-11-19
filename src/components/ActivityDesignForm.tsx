import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { MermaidDiagram } from "@/components/MermaidDiagram";

export const ActivityDesignForm = () => {
  const [nickname, setNickname] = useState("");
  const [learningObjectives, setLearningObjectives] = useState("");
  const [activeExploration, setActiveExploration] = useState("");
  const [aiSupport, setAiSupport] = useState("");
  const [feedbackMechanisms, setFeedbackMechanisms] = useState("");
  const [diverseNeeds, setDiverseNeeds] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ flowchart: string; systemPrompt: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nickname.trim()) {
      toast.error("Please provide a nickname for your activity");
      return;
    }

    if (!learningObjectives.trim() || !activeExploration.trim() || !aiSupport.trim()) {
      toast.error("Please fill out all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke("generate-activity-design", {
        body: {
          nickname,
          learningObjectives,
          activeExploration,
          aiSupport,
          feedbackMechanisms,
          diverseNeeds,
        },
      });

      if (error) throw error;

      setResult(data);
      toast.success("Activity design generated successfully!");
    } catch (error) {
      console.error("Error generating activity design:", error);
      toast.error("Failed to generate activity design. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="nickname" className="text-lg font-semibold">
              Activity Nickname *
            </Label>
            <Input
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="e.g., Academic Writing Workshop"
              className="mt-2 text-base"
              required
            />
          </div>

          <div>
            <Label htmlFor="objectives" className="text-lg font-semibold">
              Learning Objectives *
            </Label>
            <p className="text-sm text-muted-foreground mt-1 mb-2">
              What should students be able to do by the end?
            </p>
            <Textarea
              id="objectives"
              value={learningObjectives}
              onChange={(e) => setLearningObjectives(e.target.value)}
              placeholder="Students will be able to..."
              className="mt-2 text-base min-h-[100px]"
              required
            />
          </div>

          <div>
            <Label htmlFor="exploration" className="text-lg font-semibold">
              Active Exploration Design *
            </Label>
            <p className="text-sm text-muted-foreground mt-1 mb-2">
              How will you engage students and stimulate participation?
            </p>
            <Textarea
              id="exploration"
              value={activeExploration}
              onChange={(e) => setActiveExploration(e.target.value)}
              placeholder="Describe the interactive activities..."
              className="mt-2 text-base min-h-[100px]"
              required
            />
          </div>

          <div>
            <Label htmlFor="ai-support" className="text-lg font-semibold">
              AI Support Specification *
            </Label>
            <p className="text-sm text-muted-foreground mt-1 mb-2">
              Where and how will AI provide assistance in the learning process?
            </p>
            <Textarea
              id="ai-support"
              value={aiSupport}
              onChange={(e) => setAiSupport(e.target.value)}
              placeholder="AI will help by..."
              className="mt-2 text-base min-h-[100px]"
              required
            />
          </div>

          <div>
            <Label htmlFor="feedback" className="text-lg font-semibold">
              Feedback Mechanisms
            </Label>
            <p className="text-sm text-muted-foreground mt-1 mb-2">
              How will students know they're making progress?
            </p>
            <Textarea
              id="feedback"
              value={feedbackMechanisms}
              onChange={(e) => setFeedbackMechanisms(e.target.value)}
              placeholder="Describe feedback approach..."
              className="mt-2 text-base min-h-[100px]"
            />
          </div>

          <div>
            <Label htmlFor="diverse" className="text-lg font-semibold">
              Addressing Diverse Needs
            </Label>
            <p className="text-sm text-muted-foreground mt-1 mb-2">
              How will you personalize for different proficiency levels?
            </p>
            <Textarea
              id="diverse"
              value={diverseNeeds}
              onChange={(e) => setDiverseNeeds(e.target.value)}
              placeholder="Describe personalization strategy..."
              className="mt-2 text-base min-h-[100px]"
            />
          </div>

          <Button type="submit" disabled={isSubmitting} size="lg" className="w-full text-base">
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Design...
              </>
            ) : (
              "Generate Activity Design"
            )}
          </Button>
        </form>
      </Card>

      {result && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-2xl font-bold mb-4">Activity Flowchart</h3>
            <MermaidDiagram chart={result.flowchart} />
          </Card>

          <Card className="p-6">
            <h3 className="text-2xl font-bold mb-4">AI Chatbot System Prompt</h3>
            <div className="bg-muted p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-base font-mono">{result.systemPrompt}</pre>
            </div>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(result.systemPrompt);
                toast.success("System prompt copied to clipboard!");
              }}
              variant="outline"
              className="mt-4"
            >
              Copy System Prompt
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
};
