import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [analyzeLevel, setAnalyzeLevel] = useState<"essay" | "paragraph">("essay");
  const [showSystemPrompt, setShowSystemPrompt] = useState(false);
  
  // Demo mode state
  const [demoMermaidCode, setDemoMermaidCode] = useState("");
  
  // User mode state
  const [userText, setUserText] = useState("");
  const [userMermaidCode, setUserMermaidCode] = useState("");
  
  const { toast } = useToast();

  const systemPromptText = `You are an expert at creating mermaid diagrams for academic writing structure analysis. 

When analyzing text:
- Focus on HIGH-LEVEL structure and organization, not minute details
- Identify PARALLEL and COMPARABLE themes or sections
- Show how major ideas relate and flow to each other
- For essays: identify main sections, thesis, body themes, and conclusion
- For paragraphs: show topic sentence, supporting ideas, and concluding statement
- Use simple, clear node labels (avoid long text in nodes)
- Keep the diagram focused on structure, not content details

Diagram guidelines:
- Use flowchart (graph TD or graph LR) for structure visualization
- Maximum 8-12 nodes for essay level, 5-8 nodes for paragraph level
- Show relationships between parallel themes
- Only return the raw mermaid code (no markdown blocks, no "mermaid" prefix)`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Mermaid code copied to clipboard",
    });
  };

  const handleAnalyze = async (text: string, level: "essay" | "paragraph", isDemo: boolean) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-mermaid', {
        body: { 
          description: `Analyze the structure of this ${level} and create a mermaid diagram showing the organization and flow. For essay level, show main sections and their relationships. For paragraph level, show sentence-by-sentence structure and connections.\n\nText:\n${text}`,
          level 
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
        description: `${level === 'essay' ? 'Essay' : 'Paragraph'} structure diagram generated!`,
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
          <h1 className="text-4xl font-bold mb-2">Writing Structure Visualizer</h1>
          <p className="text-muted-foreground mb-4">
            Visualize essay and paragraph structure using interactive mermaid diagrams
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
                    This is the instruction given to the AI model (DeepSeek/Kimi) to analyze your text structure
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
                        <li>AI focuses on <strong>high-level organization</strong>, not every detail</li>
                        <li>Identifies <strong>parallel themes</strong> and how they connect</li>
                        <li>Creates simple, clear diagrams (8-12 nodes for essays, 5-8 for paragraphs)</li>
                        <li>Shows structural relationships, not content summaries</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>

          <Tabs value={analyzeLevel} onValueChange={(v) => setAnalyzeLevel(v as "essay" | "paragraph")}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="essay">Essay Level</TabsTrigger>
              <TabsTrigger value="paragraph">Paragraph Level</TabsTrigger>
            </TabsList>

            <TabsContent value="essay" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Demo: Bertrand Russell&apos;s &quot;What I Have Lived For&quot;</CardTitle>
                  <CardDescription>
                    Visualize the essay structure with a mermaid diagram
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={DEMO_ESSAY}
                    readOnly
                    className="min-h-[400px] font-serif text-sm mb-4"
                  />
                  <Button
                    onClick={() => handleAnalyze(DEMO_ESSAY, "essay", true)}
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Visualize Essay Structure
                  </Button>
                </CardContent>
              </Card>

              {demoMermaidCode && (
                <Card>
                  <CardHeader>
                    <CardTitle>Essay Structure Diagram</CardTitle>
                    <CardDescription>
                      Interactive visualization of the essay&apos;s organization and flow
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
            </TabsContent>

            <TabsContent value="paragraph" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Demo: First Paragraph</CardTitle>
                  <CardDescription>
                    Visualize sentence-by-sentence structure and connections
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={DEMO_ESSAY.split('\n\n')[2]}
                    readOnly
                    className="min-h-[200px] font-serif text-sm mb-4"
                  />
                  <Button
                    onClick={() => handleAnalyze(DEMO_ESSAY.split('\n\n')[2], "paragraph", true)}
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Visualize Paragraph Structure
                  </Button>
                </CardContent>
              </Card>

              {demoMermaidCode && (
                <Card>
                  <CardHeader>
                    <CardTitle>Paragraph Structure Diagram</CardTitle>
                    <CardDescription>
                      Detailed sentence-level analysis showing logical flow and connections
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
            </TabsContent>
          </Tabs>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Analyze Your Own Text</CardTitle>
              <CardDescription>
                Paste your essay or paragraph to visualize its structure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={userText}
                onChange={(e) => setUserText(e.target.value)}
                placeholder={analyzeLevel === "essay" 
                  ? "Paste your complete essay here..." 
                  : "Paste a single paragraph here..."}
                className="min-h-[300px]"
              />
              <Button
                onClick={() => handleAnalyze(userText, analyzeLevel, false)}
                disabled={loading || !userText.trim()}
              >
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Visualize {analyzeLevel === 'essay' ? 'Essay' : 'Paragraph'} Structure
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
