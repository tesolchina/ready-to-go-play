import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Clock, Users } from "lucide-react";
import { MermaidDiagram } from "@/components/MermaidDiagram";
import { requestQueue } from "@/lib/requestQueue";

interface ActivityTemplate {
  name: string;
  learningObjectives: string;
  activeExploration: string;
  aiSupport: string;
  feedbackMechanisms: string;
  diverseNeeds: string;
}

const templates: Record<string, ActivityTemplate> = {
  "academic-writing": {
    name: "Academic Writing Workshop",
    learningObjectives: "Students will be able to write a well-structured academic paragraph with clear topic sentences, supporting evidence, and proper citations. They will demonstrate critical thinking by analyzing sources and integrating them effectively into their writing.",
    activeExploration: "Students will analyze sample paragraphs, identify strengths and weaknesses, and collaboratively rewrite weak examples. They will practice writing their own paragraphs on a given topic and peer-review each other's work using a structured rubric.",
    aiSupport: "AI will provide instant feedback on paragraph structure, coherence, and citation format. It will suggest improvements for topic sentences and transitions. Students can ask the AI for clarification on academic writing conventions and receive personalized examples based on their discipline.",
    feedbackMechanisms: "AI provides real-time suggestions as students write. Peer review with guided questions. Instructor provides summative feedback on final drafts. Students track their improvement through a writing portfolio.",
    diverseNeeds: "AI adjusts language complexity based on proficiency level. Advanced students receive challenges on argumentation and synthesis. Beginning students get more scaffolding with sentence starters and vocabulary support. All students can request translations or explanations in their native language.",
  },
  "critical-reading": {
    name: "Critical Reading & Analysis",
    learningObjectives: "Students will be able to identify main arguments, evaluate evidence quality, and detect logical fallacies in academic texts. They will develop annotation strategies and synthesize information across multiple sources.",
    activeExploration: "Students read a controversial article and annotate it individually. In small groups, they discuss their annotations and create a visual map of the argument structure. They then find counter-arguments and evaluate the strength of each position.",
    aiSupport: "AI helps students identify complex sentence structures and unfamiliar vocabulary in context. It can generate comprehension questions at different difficulty levels. Students can discuss their interpretations with the AI to deepen understanding before group work.",
    feedbackMechanisms: "AI checks annotation quality and provides prompts for deeper analysis. Group discussions are recorded and reviewed. Quick quizzes assess comprehension. Students complete self-reflection forms on their reading strategies.",
    diverseNeeds: "Texts are available at multiple reading levels. AI provides vocabulary support and cultural context for international students. Advanced students analyze more complex texts and focus on rhetoric and discourse analysis. Visual learners receive graphic organizers and concept maps.",
  },
  "presentation-skills": {
    name: "Academic Presentation Skills",
    learningObjectives: "Students will be able to design clear, professional slides and deliver confident oral presentations with appropriate academic language. They will respond to questions effectively and engage their audience.",
    activeExploration: "Students watch and critique sample presentations using a rubric. They create presentation outlines and practice in small groups. Peer feedback sessions focus on one skill at a time (e.g., eye contact, slide design, transitions). Final presentations are recorded for self-assessment.",
    aiSupport: "AI analyzes slide content for clarity and visual balance. It provides pronunciation practice for difficult terms. Students can practice Q&A sessions with the AI generating realistic audience questions. AI offers suggestions for improving transitions and academic language use.",
    feedbackMechanisms: "Peer evaluation forms with specific criteria. Video recordings for self-reflection. AI generates instant feedback on slide text (readability, word count, structure). Instructor provides detailed rubric-based assessment with growth-oriented comments.",
    diverseNeeds: "Non-native speakers receive pronunciation guides and language templates. Students with anxiety can practice with AI first before peer practice. Advanced students focus on persuasive techniques and handling difficult questions. Visual templates support students with organizational challenges.",
  },
};

export const ActivityDesignForm = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [nickname, setNickname] = useState("");
  const [learningObjectives, setLearningObjectives] = useState("");
  const [activeExploration, setActiveExploration] = useState("");
  const [aiSupport, setAiSupport] = useState("");
  const [feedbackMechanisms, setFeedbackMechanisms] = useState("");
  const [diverseNeeds, setDiverseNeeds] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [queuePosition, setQueuePosition] = useState<{ position: number; total: number } | null>(null);
  const [result, setResult] = useState<{ flowchart: string; systemPrompt: string } | null>(null);
  const requestIdRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (requestIdRef.current) {
        requestQueue.removeListener(requestIdRef.current);
      }
    };
  }, []);

  const handleTemplateChange = (templateKey: string) => {
    setSelectedTemplate(templateKey);
    if (templateKey && templates[templateKey]) {
      const template = templates[templateKey];
      setLearningObjectives(template.learningObjectives);
      setActiveExploration(template.activeExploration);
      setAiSupport(template.aiSupport);
      setFeedbackMechanisms(template.feedbackMechanisms);
      setDiverseNeeds(template.diverseNeeds);
      toast.success("Template loaded! Feel free to edit any field.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nickname.trim()) {
      toast.error("Please enter your nickname");
      return;
    }

    if (nickname.trim().length > 50) {
      toast.error("Nickname must be less than 50 characters");
      return;
    }

    if (!learningObjectives.trim() || !activeExploration.trim() || !aiSupport.trim()) {
      toast.error("Please fill out all required fields");
      return;
    }

    if (learningObjectives.length > 2000 || activeExploration.length > 2000 || 
        aiSupport.length > 2000 || feedbackMechanisms.length > 2000 || 
        diverseNeeds.length > 2000) {
      toast.error("Each field must be less than 2000 characters");
      return;
    }

    setIsSubmitting(true);
    setQueuePosition(null);

    try {
      // Add to queue with position tracking
      const data = await requestQueue.add(async () => {
        requestIdRef.current = crypto.randomUUID();
        
        // Set up queue position listener
        requestQueue.onQueueChange(requestIdRef.current, (position, total) => {
          if (position > 0) {
            setQueuePosition({ position, total });
          } else {
            setQueuePosition(null);
          }
        });

        const { data, error } = await supabase.functions.invoke("generate-activity-design", {
          body: {
            nickname: nickname.trim(),
            learningObjectives: learningObjectives.trim(),
            activeExploration: activeExploration.trim(),
            aiSupport: aiSupport.trim(),
            feedbackMechanisms: feedbackMechanisms.trim(),
            diverseNeeds: diverseNeeds.trim(),
          },
        });

        if (error) throw error;
        return data;
      });

      setResult(data);
      toast.success("Activity design generated successfully!");
    } catch (error: any) {
      console.error("Error generating activity design:", error);
      
      if (error?.status === 429) {
        toast.error("System is currently busy. Your request has been queued and will be processed soon.");
      } else if (error?.message?.includes("timeout")) {
        toast.error("Request timed out. Please try again with a shorter description.");
      } else {
        toast.error("Failed to generate activity design. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
      setQueuePosition(null);
      if (requestIdRef.current) {
        requestQueue.removeListener(requestIdRef.current);
        requestIdRef.current = null;
      }
    }
  };

  return (
    <div className="space-y-6">
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
            <Label htmlFor="template" className="text-lg font-semibold">
              Choose a Template (Optional)
            </Label>
            <p className="text-sm text-muted-foreground mt-1 mb-2">
              Select a pre-filled example to get started quickly. You can edit any field after selecting.
            </p>
            <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
              <SelectTrigger className="mt-2 text-base">
                <SelectValue placeholder="Select a template to auto-fill the form..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="academic-writing">Academic Writing Workshop</SelectItem>
                <SelectItem value="critical-reading">Critical Reading & Analysis</SelectItem>
                <SelectItem value="presentation-skills">Academic Presentation Skills</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="nickname" className="text-lg font-semibold">
              Your Nickname *
            </Label>
            <p className="text-sm text-muted-foreground mt-1 mb-2">
              Enter your name or nickname as the participant
            </p>
            <Input
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="e.g., Professor Zhang"
              className="mt-2 text-base"
              maxLength={50}
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
              maxLength={2000}
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
              maxLength={2000}
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
              maxLength={2000}
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
              maxLength={2000}
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
              maxLength={2000}
            />
          </div>

          <Button type="submit" disabled={isSubmitting} size="lg" className="w-full text-base">
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {queuePosition && queuePosition.position > 0
                  ? `In Queue (${queuePosition.position}/${queuePosition.total})...`
                  : "Generating Design..."}
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
