import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";

const DEMO_ESSAY = `The Prologue to Bertrand Russell's Autobiography
What I Have Lived For

Three passions, simple but overwhelmingly strong, have governed my life: the longing for love, the search for knowledge, and unbearable pity for the suffering of mankind. These passions, like great winds, have blown me hither and thither, in a wayward course, over a great ocean of anguish, reaching to the very verge of despair.

I have sought love, first, because it brings ecstasy - ecstasy so great that I would often have sacrificed all the rest of life for a few hours of this joy. I have sought it, next, because it relieves loneliness--that terrible loneliness in which one shivering consciousness looks over the rim of the world into the cold unfathomable lifeless abyss. I have sought it finally, because in the union of love I have seen, in a mystic miniature, the prefiguring vision of the heaven that saints and poets have imagined. This is what I sought, and though it might seem too good for human life, this is what--at last--I have found.

With equal passion I have sought knowledge. I have wished to understand the hearts of men. I have wished to know why the stars shine. And I have tried to apprehend the Pythagorean power by which number holds sway above the flux. A little of this, but not much, I have achieved.

Love and knowledge, so far as they were possible, led upward toward the heavens. But always pity brought me back to earth. Echoes of cries of pain reverberate in my heart. Children in famine, victims tortured by oppressors, helpless old people a burden to their sons, and the whole world of loneliness, poverty, and pain make a mockery of what human life should be. I long to alleviate this evil, but I cannot, and I too suffer.

This has been my life. I have found it worth living, and would gladly live it again if the chance were offered me.

Bertrand Russell (1872-1970) won the Nobel prize for literature for his History of Western Philosophy and was the co-author of Principia Mathematica.`;

const DEMO_PATTERN = `This text exhibits a highly structured and rhetorically sophisticated approach, employing a clear organizational strategy to convey a central idea and its foundational components.

**Overall Structure and Organization:**

The text is organized into five distinct thematic sections, followed by a brief concluding biographical note.

1.  **Introduction of Core Thesis:** The opening paragraph establishes the central premise or thesis statement, outlining the foundational elements that define the speaker's life. This acts as an overarching declaration.
2.  **Elaboration of First Core Element:** This section systematically unpacks the first of the previously introduced elements, providing multiple facets and motivations behind its pursuit.
3.  **Elaboration of Second Core Element:** This section parallels the previous one, detailing the motivations and achievements related to the second foundational element.
4.  **Synthesis and Introduction of Third Core Element:** This segment serves as a transition, linking the first two elements but then introducing the third, contrasting its nature and impact with the preceding two. It also highlights the emotional weight and personal connection to this final element.
5.  **Concluding Affirmation:** This brief closing statement offers a meta-commentary on the life described, providing a conclusive judgment or summation.
6.  **External Context/Authorial Identification:** A brief, factual statement provides external context about the author, distinct from the reflective narrative.

The sections flow logically from a broad declaration to specific elaborations, then to a synthesis that introduces the final core component, culminating in an overall assessment. The connection between sections is primarily thematic, with explicit or implicit repetition of keywords and concepts maintaining coherence.`;

export default function PatternAnalyzer() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("demo");
  const [loading, setLoading] = useState(false);
  
  // Demo mode state
  const [demoPatterns, setDemoPatterns] = useState("");
  const [demoTopic, setDemoTopic] = useState("");
  const [demoOutputType, setDemoOutputType] = useState<"essay" | "outline">("essay");
  const [demoResult, setDemoResult] = useState("");
  
  // User mode state
  const [userEssay, setUserEssay] = useState("");
  const [userPatterns, setUserPatterns] = useState("");
  const [userTopic, setUserTopic] = useState("");
  const [userOutputType, setUserOutputType] = useState<"essay" | "outline">("essay");
  const [userResult, setUserResult] = useState("");
  
  const { toast } = useToast();

  const handleAnalyze = async (text: string, isDemo: boolean) => {
    setLoading(true);
    try {
      // For demo mode, use predefined pattern
      if (isDemo) {
        setDemoPatterns(DEMO_PATTERN);
        toast({
          title: "Analysis Complete",
          description: "Patterns identified successfully!",
        });
      } else {
        // For user essays, call AI to analyze structure only
        const { data, error } = await supabase.functions.invoke('pattern-analyzer', {
          body: { text, action: 'analyze' }
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

        setUserPatterns(data.result);
        toast({
          title: "Analysis Complete",
          description: "Patterns identified successfully!",
        });
      }
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

  const handleGenerate = async (patterns: string, topic: string, outputType: "essay" | "outline", isDemo: boolean) => {
    if (!topic.trim()) {
      toast({
        title: "Topic Required",
        description: "Please enter a topic for the new content.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('pattern-analyzer', {
        body: { text: patterns, action: 'generate', topic, outputType }
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
        setDemoResult(data.result);
      } else {
        setUserResult(data.result);
      }

      toast({
        title: "Generation Complete",
        description: `${outputType === 'essay' ? 'Essay' : 'Outline'} generated successfully!`,
      });
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
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
          <h1 className="text-4xl font-bold mb-2">Writing Pattern Analyzer</h1>
          <p className="text-muted-foreground mb-8">
            Identify writing patterns from essays and generate new content using those patterns
          </p>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="demo">Demo Mode</TabsTrigger>
              <TabsTrigger value="custom">Your Essay</TabsTrigger>
            </TabsList>

            <TabsContent value="demo" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Demo: Bertrand Russell's "What I Have Lived For"</CardTitle>
                  <CardDescription>
                    Let's analyze this classic essay and learn its patterns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={DEMO_ESSAY}
                    readOnly
                    className="min-h-[400px] font-serif text-sm"
                  />
                  <Button
                    onClick={() => handleAnalyze(DEMO_ESSAY, true)}
                    disabled={loading}
                    className="mt-4"
                  >
                    {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Analyze Patterns
                  </Button>
                </CardContent>
              </Card>

              {demoPatterns && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Identified Patterns</CardTitle>
                      <CardDescription>
                        Structural and rhetorical patterns found in the essay
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <ReactMarkdown>{demoPatterns}</ReactMarkdown>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Generate New Content</CardTitle>
                      <CardDescription>
                        Apply these patterns to a new topic
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="demo-topic">New Topic</Label>
                        <Input
                          id="demo-topic"
                          placeholder="e.g., My passion for music"
                          value={demoTopic}
                          onChange={(e) => setDemoTopic(e.target.value)}
                        />
                      </div>

                      <div>
                        <Label>Output Type</Label>
                        <RadioGroup value={demoOutputType} onValueChange={(v) => setDemoOutputType(v as "essay" | "outline")}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="essay" id="demo-essay" />
                            <Label htmlFor="demo-essay">Complete Essay</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="outline" id="demo-outline" />
                            <Label htmlFor="demo-outline">Outline</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <Button
                        onClick={() => handleGenerate(demoPatterns, demoTopic, demoOutputType, true)}
                        disabled={loading}
                      >
                        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                        Generate {demoOutputType === 'essay' ? 'Essay' : 'Outline'}
                      </Button>
                    </CardContent>
                  </Card>

                  {demoResult && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Generated {demoOutputType === 'essay' ? 'Essay' : 'Outline'}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          <ReactMarkdown>{demoResult}</ReactMarkdown>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="custom" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Essay or Paragraph</CardTitle>
                  <CardDescription>
                    Paste your essay or paragraph to analyze its writing patterns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={userEssay}
                    onChange={(e) => setUserEssay(e.target.value)}
                    placeholder="Paste your essay or paragraph here..."
                    className="min-h-[300px]"
                  />
                  <Button
                    onClick={() => handleAnalyze(userEssay, false)}
                    disabled={loading || !userEssay.trim()}
                    className="mt-4"
                  >
                    {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Analyze Patterns
                  </Button>
                </CardContent>
              </Card>

              {userPatterns && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Identified Patterns</CardTitle>
                      <CardDescription>
                        Structural and rhetorical patterns found in your essay
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <ReactMarkdown>{userPatterns}</ReactMarkdown>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Generate New Content</CardTitle>
                      <CardDescription>
                        Apply these patterns to a new topic
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="user-topic">New Topic</Label>
                        <Input
                          id="user-topic"
                          placeholder="Enter your new topic..."
                          value={userTopic}
                          onChange={(e) => setUserTopic(e.target.value)}
                        />
                      </div>

                      <div>
                        <Label>Output Type</Label>
                        <RadioGroup value={userOutputType} onValueChange={(v) => setUserOutputType(v as "essay" | "outline")}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="essay" id="user-essay" />
                            <Label htmlFor="user-essay">Complete Essay</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="outline" id="user-outline" />
                            <Label htmlFor="user-outline">Outline</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <Button
                        onClick={() => handleGenerate(userPatterns, userTopic, userOutputType, false)}
                        disabled={loading}
                      >
                        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                        Generate {userOutputType === 'essay' ? 'Essay' : 'Outline'}
                      </Button>
                    </CardContent>
                  </Card>

                  {userResult && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Generated {userOutputType === 'essay' ? 'Essay' : 'Outline'}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          <ReactMarkdown>{userResult}</ReactMarkdown>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}