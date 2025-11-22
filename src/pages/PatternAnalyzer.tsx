import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ArrowLeft, Copy, ChevronDown, ChevronUp, Info, Download, FileText, Wand2, AlertCircle } from "lucide-react";
import { MermaidDiagram } from "@/components/MermaidDiagram";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ReactMarkdown from "react-markdown";
import { useAIServiceGuard } from "@/hooks/useAIServiceGuard";
import { getAIHeaders } from "@/lib/aiServiceGuard";
import { Alert, AlertDescription } from "@/components/ui/alert";

const DEMO_ESSAY = `The Prologue to Bertrand Russell's Autobiography
What I Have Lived For

Three passions, simple but overwhelmingly strong, have governed my life: the longing for love, the search for knowledge, and unbearable pity for the suffering of mankind. These passions, like great winds, have blown me hither and thither, in a wayward course, over a great ocean of anguish, reaching to the very verge of despair.

I have sought love, first, because it brings ecstasy - ecstasy so great that I would often have sacrificed all the rest of life for a few hours of this joy. I have sought it, next, because it relieves loneliness--that terrible loneliness in which one shivering consciousness looks over the rim of the world into the cold unfathomable lifeless abyss. I have sought it finally, because in the union of love I have seen, in a mystic miniature, the prefiguring vision of the heaven that saints and poets have imagined. This is what I sought, and though it might seem too good for human life, this is what--at last--I have found.

With equal passion I have sought knowledge. I have wished to understand the hearts of men. I have wished to know why the stars shine. And I have tried to apprehend the Pythagorean power by which number holds sway above the flux. A little of this, but not much, I have achieved.

Love and knowledge, so far as they were possible, led upward toward the heavens. But always pity brought me back to earth. Echoes of cries of pain reverberate in my heart. Children in famine, victims tortured by oppressors, helpless old people a burden to their sons, and the whole world of loneliness, poverty, and pain make a mockery of what human life should be. I long to alleviate this evil, but I cannot, and I too suffer.

This has been my life. I have found it worth living, and would gladly live it again if the chance were offered me.

Bertrand Russell (1872-1970) won the Nobel prize for literature for his History of Western Philosophy and was the co-author of Principia Mathematica.`;

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function PatternAnalyzer() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showSystemPrompt, setShowSystemPrompt] = useState(false);
  const { isActivated, checkAndNotify } = useAIServiceGuard();
  
  // Demo mode state
  const [demoMermaidCode, setDemoMermaidCode] = useState("");
  
  // User mode state
  const [userText, setUserText] = useState("");
  const [userMermaidCode, setUserMermaidCode] = useState("");
  const [analyzedPattern, setAnalyzedPattern] = useState("");
  
  // New topic generation state
  const [newTopic, setNewTopic] = useState("");
  const [topicDetails, setTopicDetails] = useState("");
  const [generatedOutline, setGeneratedOutline] = useState("");
  const [generatedOutlineMermaid, setGeneratedOutlineMermaid] = useState("");
  const [generatedEssay, setGeneratedEssay] = useState("");
  
  // Chat history
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  
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

  const addToHistory = (role: 'user' | 'assistant', content: string) => {
    setChatHistory(prev => [...prev, { role, content, timestamp: new Date() }]);
  };

  const downloadChatHistory = () => {
    let markdown = "# Essay Structure Analysis Session\n\n";
    markdown += `*Generated on ${new Date().toLocaleString()}*\n\n---\n\n`;
    
    // Include original essay if analyzed
    if (userText) {
      markdown += "## Your Essay\n\n";
      markdown += userText + "\n\n---\n\n";
    }
    
    // Include structural analysis
    if (analyzedPattern) {
      markdown += "## Structural Analysis\n\n";
      markdown += analyzedPattern + "\n\n";
      
      if (userMermaidCode) {
        markdown += "### Structure Diagram (Mermaid Code)\n\n";
        markdown += "```mermaid\n" + userMermaidCode + "\n```\n\n---\n\n";
      }
    }
    
    // Include generated outline
    if (generatedOutline) {
      markdown += "## Generated Outline\n\n";
      markdown += `**Topic:** ${newTopic}\n\n`;
      if (topicDetails) {
        markdown += `**Details:** ${topicDetails}\n\n`;
      }
      markdown += generatedOutline + "\n\n";
      
      if (generatedOutlineMermaid) {
        markdown += "### Outline Diagram (Mermaid Code)\n\n";
        markdown += "```mermaid\n" + generatedOutlineMermaid + "\n```\n\n---\n\n";
      }
    }
    
    // Include generated essay
    if (generatedEssay) {
      markdown += "## Generated Essay\n\n";
      markdown += generatedEssay + "\n\n---\n\n";
    }
    
    // Include conversation history
    if (chatHistory.length > 0) {
      markdown += "## Conversation History\n\n";
      chatHistory.forEach((msg, idx) => {
        const role = msg.role === 'user' ? '**User**' : '**AI Assistant**';
        markdown += `### ${role} - ${msg.timestamp.toLocaleTimeString()}\n\n`;
        markdown += `${msg.content}\n\n---\n\n`;
      });
    }
    
    // Download markdown
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `essay-analysis-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Markdown Downloaded",
      description: "Complete session saved as markdown file",
    });
  };

  const downloadAsPDF = () => {
    // Create HTML content for PDF
    let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Essay Structure Analysis Session</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 800px;
      margin: 40px auto;
      padding: 20px;
      line-height: 1.6;
      color: #333;
    }
    h1 { color: #1a1a1a; border-bottom: 3px solid #333; padding-bottom: 10px; }
    h2 { color: #2a2a2a; margin-top: 30px; border-bottom: 2px solid #666; padding-bottom: 8px; }
    h3 { color: #3a3a3a; margin-top: 20px; }
    .metadata { color: #666; font-style: italic; margin-bottom: 30px; }
    .section { margin-bottom: 40px; page-break-inside: avoid; }
    pre { background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto; }
    code { background: #f5f5f5; padding: 2px 6px; border-radius: 3px; }
    hr { border: none; border-top: 1px solid #ddd; margin: 30px 0; }
    .timestamp { color: #888; font-size: 0.9em; }
    @media print {
      body { margin: 0; padding: 15px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <h1>Essay Structure Analysis Session</h1>
  <p class="metadata">Generated on ${new Date().toLocaleString()}</p>
`;
    
    if (userText) {
      html += `
  <div class="section">
    <h2>Your Essay</h2>
    <pre>${userText.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
  </div>
`;
    }
    
    if (analyzedPattern) {
      html += `
  <div class="section">
    <h2>Structural Analysis</h2>
    <pre>${analyzedPattern.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
  </div>
`;
      
      if (userMermaidCode) {
        html += `
  <div class="section">
    <h3>Structure Diagram Code</h3>
    <pre><code>${userMermaidCode.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
  </div>
`;
      }
    }
    
    if (generatedOutline) {
      html += `
  <div class="section">
    <h2>Generated Outline</h2>
    <p><strong>Topic:</strong> ${newTopic}</p>
`;
      if (topicDetails) {
        html += `    <p><strong>Details:</strong> ${topicDetails}</p>\n`;
      }
      html += `    <pre>${generatedOutline.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
  </div>
`;
      
      if (generatedOutlineMermaid) {
        html += `
  <div class="section">
    <h3>Outline Diagram Code</h3>
    <pre><code>${generatedOutlineMermaid.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
  </div>
`;
      }
    }
    
    if (generatedEssay) {
      html += `
  <div class="section">
    <h2>Generated Essay</h2>
    <pre>${generatedEssay.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
  </div>
`;
    }
    
    if (chatHistory.length > 0) {
      html += `
  <div class="section">
    <h2>Conversation History</h2>
`;
      chatHistory.forEach((msg) => {
        const role = msg.role === 'user' ? 'User' : 'AI Assistant';
        html += `
    <div style="margin-bottom: 20px;">
      <h3>${role} <span class="timestamp">${msg.timestamp.toLocaleTimeString()}</span></h3>
      <pre>${msg.content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
    </div>
`;
      });
      html += `  </div>\n`;
    }
    
    html += `
  <div class="no-print" style="margin-top: 40px; padding: 20px; background: #f0f0f0; border-radius: 5px;">
    <p><strong>To save as PDF:</strong> Use your browser's Print function (Ctrl+P or Cmd+P) and select "Save as PDF"</p>
  </div>
</body>
</html>`;
    
    // Open in new window for printing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      
      toast({
        title: "PDF Preview Ready",
        description: "Use Print (Ctrl+P) to save as PDF",
      });
    } else {
      toast({
        title: "Error",
        description: "Please allow popups to generate PDF",
        variant: "destructive",
      });
    }
  };

  const handleAnalyze = async (text: string, isDemo: boolean) => {
    if (!checkAndNotify()) return;
    
    setLoading(true);
    try {
      toast({
        title: "Starting Analysis",
        description: "Analyzing essay structure...",
      });
      
      addToHistory('user', `Analyze essay structure:\n\n${text.substring(0, 200)}...`);
      
      toast({
        title: "Generating Diagram",
        description: "Creating visual structure diagram...",
      });
      
      // First, get the mermaid diagram
      const { data: mermaidData, error: mermaidError } = await supabase.functions.invoke('generate-mermaid', {
        body: { 
          description: `Analyze the MACRO-LEVEL structure of this essay and create a mermaid diagram showing the main sections and their relationships. Focus on overall organization, not paragraph details.\n\nEssay:\n${text}`
        },
        headers: getAIHeaders()
      });

      if (mermaidError) throw mermaidError;

      if (mermaidData.error) {
        toast({
          title: "Error",
          description: mermaidData.error,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Diagram Generated",
        description: "Now analyzing structural patterns...",
      });

      // Then, get the pattern analysis
      const { data: patternData, error: patternError } = await supabase.functions.invoke('pattern-analyzer', {
        body: { 
          text,
          action: 'analyze'
        },
        headers: getAIHeaders()
      });

      if (patternError) throw patternError;

      toast({
        title: "Pattern Analysis Complete",
        description: "Finalizing results...",
      });

      if (isDemo) {
        setDemoMermaidCode(mermaidData.mermaidCode);
      } else {
        setUserMermaidCode(mermaidData.mermaidCode);
        setAnalyzedPattern(patternData.result);
        addToHistory('assistant', `Structure Analysis:\n\n${patternData.result}\n\n[Mermaid diagram generated]`);
      }

      toast({
        title: "Analysis Complete!",
        description: "Essay structure visualization ready.",
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

  const handleGenerateOutline = async () => {
    if (!checkAndNotify()) return;
    if (!newTopic.trim() || !analyzedPattern) return;
    
    setLoading(true);
    try {
      const topicPrompt = topicDetails.trim() 
        ? `${newTopic}\n\nAdditional details: ${topicDetails}`
        : newTopic;
      
      addToHistory('user', `Generate outline for new topic: "${topicPrompt}"`);
      
      const { data, error } = await supabase.functions.invoke('pattern-analyzer', {
        body: {
          text: analyzedPattern,
          action: 'generate',
          topic: topicPrompt,
          outputType: 'outline'
        },
        headers: getAIHeaders()
      });

      if (error) throw error;

      setGeneratedOutline(data.result);
      addToHistory('assistant', `Generated Outline:\n\n${data.result}`);
      
      // Generate mermaid for the outline
      const { data: mermaidData } = await supabase.functions.invoke('generate-mermaid', {
        body: { 
          description: `Create a mermaid diagram for this essay outline:\n\n${data.result}`
        },
        headers: getAIHeaders()
      });
      
      if (mermaidData?.mermaidCode) {
        setGeneratedOutlineMermaid(mermaidData.mermaidCode);
      }

      toast({
        title: "Outline Generated",
        description: "New essay outline created using identified patterns!",
      });
    } catch (error) {
      console.error('Error generating outline:', error);
      toast({
        title: "Error",
        description: "Failed to generate outline. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateEssay = async () => {
    if (!checkAndNotify()) return;
    if (!generatedOutline) return;
    
    setLoading(true);
    try {
      addToHistory('user', 'Generate full essay from outline');
      
      const { data, error } = await supabase.functions.invoke('pattern-analyzer', {
        body: {
          text: analyzedPattern,
          action: 'generate',
          topic: `${newTopic}\n\nOutline to expand:\n${generatedOutline}`,
          outputType: 'essay'
        },
        headers: getAIHeaders()
      });

      if (error) throw error;

      setGeneratedEssay(data.result);
      addToHistory('assistant', `Generated Essay:\n\n${data.result}`);

      toast({
        title: "Essay Generated",
        description: "Full essay draft created successfully!",
      });
    } catch (error) {
      console.error('Error generating essay:', error);
      toast({
        title: "Error",
        description: "Failed to generate essay. Please try again.",
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
            <CardContent className="space-y-4">
              {!isActivated && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    AI services not configured. Please{" "}
                    <Link to="/lessons" className="font-medium underline">
                      configure your API key
                    </Link>{" "}
                    to use AI-powered features.
                  </AlertDescription>
                </Alert>
              )}
              <Textarea
                value={DEMO_ESSAY}
                readOnly
                className="min-h-[400px] font-serif text-sm"
              />
              <Button
                onClick={() => handleAnalyze(DEMO_ESSAY, true)}
                disabled={loading || !isActivated}
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
                disabled={loading || !userText.trim() || !isActivated}
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

              {analyzedPattern && (
                <Card className="mt-6 border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Structure Analysis
                    </CardTitle>
                    <CardDescription>
                      Identified organizational patterns from your essay
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none bg-muted/30 p-4 rounded-lg">
                      <ReactMarkdown>{analyzedPattern}</ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          {analyzedPattern && (
            <Card className="mt-6 border-accent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="w-5 h-5" />
                  Generate New Content with Same Pattern
                </CardTitle>
                <CardDescription>
                  Create an outline or essay on a new topic using the identified structure
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newTopic">New Topic</Label>
                  <Input
                    id="newTopic"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    placeholder="Enter your new essay topic..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="topicDetails">Additional Details (Optional)</Label>
                  <Textarea
                    id="topicDetails"
                    value={topicDetails}
                    onChange={(e) => setTopicDetails(e.target.value)}
                    placeholder="Add any specific points, arguments, or details you want to include..."
                    className="min-h-[100px]"
                  />
                </div>

                <Button
                  onClick={handleGenerateOutline}
                  disabled={loading || !newTopic.trim() || !isActivated}
                  className="w-full"
                >
                  {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Generate Outline
                </Button>

                {generatedOutline && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle className="text-lg">Generated Outline</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="prose prose-sm max-w-none bg-muted/30 p-4 rounded-lg">
                        <ReactMarkdown>{generatedOutline}</ReactMarkdown>
                      </div>

                      {generatedOutlineMermaid && (
                        <div className="bg-muted/30 p-4 rounded-lg">
                          <h5 className="font-semibold text-sm mb-4">Outline Structure</h5>
                          <MermaidDiagram chart={generatedOutlineMermaid} />
                        </div>
                      )}

                      <Button
                        onClick={handleGenerateEssay}
                        disabled={loading || !isActivated}
                        className="w-full"
                        variant="secondary"
                      >
                        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                        Generate Full Essay
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {generatedEssay && (
                  <Card className="mt-6 border-primary">
                    <CardHeader>
                      <CardTitle className="text-lg">Generated Essay Draft</CardTitle>
                      <CardDescription>
                        Complete essay based on your topic and the identified pattern
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm max-w-none bg-muted/30 p-6 rounded-lg">
                        <ReactMarkdown>{generatedEssay}</ReactMarkdown>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          )}

          {chatHistory.length > 0 && (
            <div className="mt-6 flex justify-end gap-2">
              <Button
                onClick={downloadChatHistory}
                variant="outline"
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Download as Markdown
              </Button>
              <Button
                onClick={downloadAsPDF}
                variant="outline"
                className="gap-2"
              >
                <FileText className="w-4 h-4" />
                Export as PDF
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
