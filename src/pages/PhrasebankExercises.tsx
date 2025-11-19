import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
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

**Rhetorical Techniques and Patterns:**

*   **Parallel Structure/Anaphora:** The text heavily employs parallelism, particularly through anaphora (repetition of words or phrases at the beginning of clauses), most notably with "I have sought" in the second paragraph. This creates a sense of rhythm, emphasis, and cumulative effect.
*   **Rule of Three:** The central thesis revolves around three distinct passions, which is a classic rhetorical device that creates a sense of completeness and balance.
*   **Metaphor and Simile:** The text uses vivid metaphors and similes (e.g., "like great winds," "ocean of anguish," "shivering consciousness") to evoke powerful emotional and sensory experiences.
*   **Concrete-to-Abstract Progression:** Each of the three core elements moves from concrete experiences (e.g., "ecstasy," "loneliness," "cries of pain") to more abstract or universal themes (e.g., "union of love," "knowledge," "pity").
*   **Thesis Statement:** The opening sentence functions as a clear and concise thesis statement, immediately informing the reader of the essay's central topic.
*   **Topic Sentences:** Each subsequent section begins with a clear topic sentence that introduces the element to be explored.
*   **Cumulative Reasoning:** Each section builds upon the previous one, with the final section offering a synthesis and a contrasting, yet complementary, perspective.
*   **Emotional Appeal (Pathos):** The text is infused with strong emotional language, designed to evoke feelings in the reader and connect with their own experiences.
*   **Personal Reflection:** The entire piece is framed as a personal reflection, using first-person pronouns and recounting personal experiences.
*   **Concluding Summary:** The final paragraph provides a brief, reflective summary of the life described, offering a sense of closure.
*   **Balanced Sentences:** Many sentences exhibit balanced structures, often presenting contrasting or parallel ideas within a single sentence.

**Key Phrases/Sentence Structures:**

*   **"Three [nouns], [adjectives], have [verb]..."** (introduces the core thesis)
*   **"I have sought [it/noun], first, because... I have sought it, next, because... I have sought it finally, because..."** (parallel elaboration)
*   **"With equal passion I have sought..."** (transitions to the next element with a parallel structure)
*   **"[Noun] and [noun], so far as they were possible, [verb]... But always [noun] [verb]..."** (contrasts two elements with a third)
*   **"This has been my life. I have found it worth living, and would gladly..."** (concluding personal affirmation)

This analysis focuses solely on the *how* of the text – its structure, organization, and rhetorical techniques – rather than the *what* (the specific content or meaning).`;

const PhrasebankExercises = () => {
  const [userEssay, setUserEssay] = useState("");
  const [userPatterns, setUserPatterns] = useState("");
  const [userTopic, setUserTopic] = useState("");
  const [userOutputType, setUserOutputType] = useState<"essay" | "outline">("essay");
  const [userResult, setUserResult] = useState("");
  
  const [demoTopic, setDemoTopic] = useState("");
  const [demoOutputType, setDemoOutputType] = useState<"essay" | "outline">("essay");
  const [demoResult, setDemoResult] = useState("");
  const [demoPatterns] = useState(DEMO_PATTERN);
  
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async (text: string, isDemo: boolean) => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to analyze",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('pattern-analyzer', {
        body: { text, action: 'analyze' }
      });

      if (error) throw error;

      if (!isDemo) {
        setUserPatterns(data.result);
      }
      
      toast({
        title: "Success",
        description: "Text patterns analyzed successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to analyze text",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (patterns: string, topic: string, outputType: string, isDemo: boolean) => {
    if (!patterns.trim() || !topic.trim()) {
      toast({
        title: "Error",
        description: "Please provide both patterns and a topic",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('pattern-analyzer', {
        body: { 
          text: patterns, 
          action: 'generate',
          topic,
          outputType 
        }
      });

      if (error) throw error;

      if (isDemo) {
        setDemoResult(data.result);
      } else {
        setUserResult(data.result);
      }
      
      toast({
        title: "Success",
        description: `${outputType === 'essay' ? 'Essay' : 'Outline'} generated successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate content",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 p-8 bg-background">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight">Phrasebank Exercises</h1>
              <p className="text-xl text-muted-foreground">
                Analyze writing patterns and generate new content using identified structures
              </p>
            </div>

            <Tabs defaultValue="demo" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="demo">Demo Mode</TabsTrigger>
                <TabsTrigger value="custom">Custom Analysis</TabsTrigger>
              </TabsList>

              <TabsContent value="demo" className="space-y-6 mt-6">
                {!demoResult ? (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle>Example Essay</CardTitle>
                        <CardDescription>
                          Bertrand Russell's famous prologue demonstrating clear rhetorical patterns
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          <ReactMarkdown>{DEMO_ESSAY}</ReactMarkdown>
                        </div>
                      </CardContent>
                    </Card>

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
                          disabled={loading || !demoTopic.trim()}
                        >
                          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                          Generate {demoOutputType === 'essay' ? 'Essay' : 'Outline'}
                        </Button>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Generated {demoOutputType === 'essay' ? 'Essay' : 'Outline'}</CardTitle>
                      <CardDescription>
                        Based on the identified patterns and your topic
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <ReactMarkdown>{demoResult}</ReactMarkdown>
                      </div>
                      <Button variant="outline" onClick={() => setDemoResult("")}>
                        Try Another Topic
                      </Button>
                    </CardContent>
                  </Card>
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
                  <CardContent className="space-y-4">
                    <Textarea
                      value={userEssay}
                      onChange={(e) => setUserEssay(e.target.value)}
                      placeholder="Paste your essay or paragraph here..."
                      className="min-h-[300px]"
                    />
                    <Button
                      onClick={() => handleAnalyze(userEssay, false)}
                      disabled={loading || !userEssay.trim()}
                    >
                      {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                      Analyze Pattern
                    </Button>
                  </CardContent>
                </Card>

                {userPatterns && (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle>Identified Patterns</CardTitle>
                        <CardDescription>
                          Structural and rhetorical patterns found in your text
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
                            placeholder="e.g., My passion for music"
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
                          disabled={loading || !userTopic.trim()}
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
        </main>
      </div>
    </SidebarProvider>
  );
};

export default PhrasebankExercises;
