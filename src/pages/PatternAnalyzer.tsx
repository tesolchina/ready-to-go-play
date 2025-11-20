import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ArrowLeft, Copy, ChevronDown, ChevronUp, Info } from "lucide-react";
import { MermaidDiagram } from "@/components/MermaidDiagram";

const DEMO_ESSAY = `The Prologue to Bertrand Russell's Autobiography
What I Have Lived For

Three passions, simple but overwhelmingly strong, have governed my life: the longing for love, the search for knowledge, and unbearable pity for the suffering of mankind. These passions, like great winds, have blown me hither and thither, in a wayward course, over a great ocean of anguish, reaching to the very verge of despair.

I have sought love, first, because it brings ecstasy - ecstasy so great that I would often have sacrificed all the rest of life for a few hours of this joy. I have sought it, next, because it relieves loneliness--that terrible loneliness in which one shivering consciousness looks over the rim of the world into the cold unfathomable lifeless abyss. I have sought it finally, because in the union of love I have seen, in a mystic miniature, the prefiguring vision of the heaven that saints and poets have imagined. This is what I sought, and though it might seem too good for human life, this is what--at last--I have found.

With equal passion I have sought knowledge. I have wished to understand the hearts of men. I have wished to know why the stars shine. And I have tried to apprehend the Pythagorean power by which number holds sway above the flux. A little of this, but not much, I have achieved.

Love and knowledge, so far as they were possible, led upward toward the heavens. But always pity brought me back to earth. Echoes of cries of pain reverberate in my heart. Children in famine, victims tortured by oppressors, helpless old people a burden to their sons, and the whole world of loneliness, poverty, and pain make a mockery of what human life should be. I long to alleviate this evil, but I cannot, and I too suffer.

This has been my life. I have found it worth living, and would gladly live it again if the chance were offered me.

Bertrand Russell (1872-1970) won the Nobel prize for literature for his History of Western Philosophy and was the co-author of Principia Mathematica.`;

export default function PatternAnalyzer() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showSystemPrompt, setShowSystemPrompt] = useState(false);
  
  // Demo mode state
  const [demoMermaidCode, setDemoMermaidCode] = useState("");
  
  // User mode state
  const [userText, setUserText] = useState("");
  const [userMermaidCode, setUserMermaidCode] = useState("");
  
  const { toast } = useToast();

  const systemPromptText = `You are an expert at creating mermaid diagrams for academic essay structure analysis. 

When analyzing essays:
- Focus on MACRO-LEVEL structure only (overall organization)
- Identify main sections: introduction, body themes/arguments, conclusion
- Show how major sections connect and flow logically
- Identify parallel or comparable arguments/themes across sections
- Show thesis development and how it's supported
- Use simple, clear labels for main sections only

Diagram guidelines:
- Use flowchart (graph TD for top-down, graph LR for left-right)
- Maximum 8-12 nodes showing only main sections
- Avoid drilling into paragraph or sentence details
- Show structural relationships between major parts
- Only return the raw mermaid code (no markdown blocks, no "mermaid" prefix)`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Mermaid code copied to clipboard",
    });
  };

  const handleAnalyze = async (text: string, isDemo: boolean) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-mermaid', {
        body: { 
          description: `Analyze the MACRO-LEVEL structure of this essay and create a mermaid diagram showing the main sections and their relationships. Focus on overall organization, not paragraph details.\n\nEssay:\n${text}`
        }
      });

      if (error) throw error;

      if (data.error) {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        });
        return;
      }

      if (isDemo) {
        setDemoMermaidCode(data.mermaidCode);
      } else {
        setUserMermaidCode(data.mermaidCode);
      }

      toast({
        title: "Structure Visualized",
        description: "Essay structure diagram generated successfully!",
      });
    } catch (error) {
      console.error('Error analyzing text:', error);
      toast({
        title: "Error",
        description: "Failed to analyze text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/learning-apps')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Learning Apps
        </Button>
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Essay Structure Visualizer</h1>
          <p className="text-muted-foreground mb-4">
            Visualize the macro-level structure of essays using interactive mermaid diagrams
          </p>

          <Collapsible open={showSystemPrompt} onOpenChange={setShowSystemPrompt} className="mb-6">
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm" className="w-full justify-between">
                <span className="flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  How AI Analyzes Your Text
                </span>
                {showSystemPrompt ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">AI System Prompt</CardTitle>
                  <CardDescription>
                    This is the instruction given to the AI model (DeepSeek/Kimi) to analyze essay structure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <pre className="text-sm whitespace-pre-wrap font-mono">{systemPromptText}</pre>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-2">
                      <p><strong>What this means:</strong></p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>AI focuses on <strong>macro-level structure</strong> only (overall organization)</li>
                        <li>Identifies <strong>main sections</strong>: intro, body themes, conclusion</li>
                        <li>Shows how major sections <strong>connect logically</strong></li>
                        <li>Creates simple diagrams with 8-12 nodes for main sections only</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>

          <Card>
            <CardHeader>
              <CardTitle>Demo: Bertrand Russell&apos;s &quot;What I Have Lived For&quot;</CardTitle>
              <CardDescription>
                Analyze the macro-level structure of this classic essay
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={DEMO_ESSAY}
                readOnly
                className="min-h-[400px] font-serif text-sm mb-4"
              />
              <Button
                onClick={() => handleAnalyze(DEMO_ESSAY, true)}
                disabled={loading}
              >
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Visualize Essay Structure
              </Button>
            </CardContent>
          </Card>

          {demoMermaidCode && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Essay Structure Diagram</CardTitle>
                <CardDescription>
                  Interactive visualization of the essay&apos;s macro-level organization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <MermaidDiagram chart={demoMermaidCode} />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm">Mermaid Code</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(demoMermaidCode)}
                    >
                      <Copy className="w-3 h-3 mr-2" />
                      Copy Code
                    </Button>
                  </div>
                  <Textarea
                    value={demoMermaidCode}
                    readOnly
                    className="font-mono text-xs min-h-[150px]"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Analyze Your Own Essay</CardTitle>
              <CardDescription>
                Paste your complete essay to visualize its macro-level structure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={userText}
                onChange={(e) => setUserText(e.target.value)}
                placeholder="Paste your complete essay here..."
                className="min-h-[300px]"
              />
              <Button
                onClick={() => handleAnalyze(userText, false)}
                disabled={loading || !userText.trim()}
              >
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Visualize Essay Structure
              </Button>

              {userMermaidCode && (
                <div className="mt-6 space-y-4">
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <MermaidDiagram chart={userMermaidCode} />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm">Mermaid Code</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(userMermaidCode)}
                      >
                        <Copy className="w-3 h-3 mr-2" />
                        Copy Code
                      </Button>
                    </div>
                    <Textarea
                      value={userMermaidCode}
                      readOnly
                      className="font-mono text-xs min-h-[150px]"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
