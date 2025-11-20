import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, FileText, CheckCircle, XCircle, AlertCircle, Loader2, ArrowLeft, Download, ExternalLink, Share2, Copy, Check } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CollapsibleSection } from "@/components/CollapsibleSection";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

interface ValidationResult {
  reference: string;
  doi?: string;
  status: "no_links" | "valid" | "invalid" | "content_mismatch" | "searching" | "found_via_search" | "not_found";
  message: string;
  details?: string;
  searchResults?: Array<{ title: string; link: string; snippet: string }>;
}

const ValidateReferences = () => {
  const [references, setReferences] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [results, setResults] = useState<ValidationResult[]>([]);
  const [progress, setProgress] = useState({ current: 0, total: 0, currentRef: "" });
  const [isSharing, setIsSharing] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setReferences(text);
    };
    reader.readAsText(file);
  };

  const handleValidate = async () => {
    if (!references.trim()) {
      toast({
        title: "Error",
        description: "Please enter references or upload a file",
        variant: "destructive",
      });
      return;
    }

    setIsValidating(true);
    setResults([]);
    setProgress({ current: 0, total: 0, currentRef: "" });

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/validate-references`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ references }),
        }
      );

      if (!response.ok || !response.body) {
        throw new Error("Failed to start validation");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        
        // Process line by line
        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          
          try {
            const parsed = JSON.parse(jsonStr);
            
            if (parsed.type === "progress") {
              setProgress({
                current: parsed.current,
                total: parsed.total,
                currentRef: parsed.reference,
              });
            } else if (parsed.type === "result") {
              setResults(prev => {
                // Replace "searching" status with actual result, or append new result
                const existingIndex = prev.findIndex(r => r.reference === parsed.result.reference);
                if (existingIndex !== -1) {
                  const updated = [...prev];
                  updated[existingIndex] = parsed.result;
                  return updated;
                }
                return [...prev, parsed.result];
              });
            } else if (parsed.type === "complete") {
              toast({
                title: "Validation Complete",
                description: `Validated ${parsed.total} references`,
              });
            }
          } catch {
            // Ignore parse errors for partial JSON
          }
        }
      }
    } catch (error) {
      console.error("Error validating references:", error);
      toast({
        title: "Error",
        description: "Failed to validate references. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
      setProgress({ current: 0, total: 0, currentRef: "" });
    }
  };

  const getStatusIcon = (status: ValidationResult["status"]) => {
    switch (status) {
      case "valid":
      case "found_via_search":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "invalid":
      case "not_found":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "content_mismatch":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "searching":
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case "no_links":
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: ValidationResult["status"]) => {
    switch (status) {
      case "valid":
        return "Valid - Link is accessible and content matches";
      case "found_via_search":
        return "Found via Search - Located and validated through academic databases";
      case "invalid":
        return "Invalid - Link is not accessible";
      case "not_found":
        return "Not Found - No matching papers found in academic databases";
      case "content_mismatch":
        return "Content Mismatch - Link accessible but content may not match";
      case "searching":
        return "Searching - Looking for this reference in academic databases...";
      case "no_links":
        return "No Links - No links found in this reference";
    }
  };

  const getSummaryStats = () => {
    const total = results.length;
    const valid = results.filter(r => r.status === "valid" || r.status === "found_via_search").length;
    const invalid = results.filter(r => r.status === "invalid" || r.status === "content_mismatch" || r.status === "not_found").length;
    const noLinks = results.filter(r => r.status === "no_links" || r.status === "searching").length;
    return { total, valid, invalid, noLinks };
  };

  const handleShare = async () => {
    if (!references.trim() || results.length === 0) {
      toast({
        title: "Nothing to share",
        description: "Please validate references first before sharing.",
        variant: "destructive",
      });
      return;
    }

    setIsSharing(true);
    try {
      const { data, error } = await supabase
        .from("validation_reports")
        .insert({
          references_input: references,
          validation_results: results as any,
        })
        .select()
        .single();

      if (error) throw error;

      const link = `${window.location.origin}/report/${data.id}`;
      setShareLink(link);
      
      toast({
        title: "Share link created!",
        description: "Copy the link to share this validation report.",
      });
    } catch (error) {
      console.error("Error creating share link:", error);
      toast({
        title: "Error creating share link",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };

  const copyShareLink = async () => {
    if (!shareLink) return;
    
    try {
      await navigator.clipboard.writeText(shareLink);
      setIsCopied(true);
      toast({
        title: "Link copied!",
        description: "The share link has been copied to your clipboard.",
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually.",
        variant: "destructive",
      });
    }
  };

  const downloadMarkdown = () => {
    const stats = getSummaryStats();
    let markdown = `# Reference Validation Report\n\n`;
    markdown += `## Summary\n\n`;
    markdown += `- **Total References Checked:** ${stats.total}\n`;
    markdown += `- **Valid References:** ${stats.valid}\n`;
    markdown += `- **Invalid References:** ${stats.invalid}\n`;
    markdown += `- **References Without DOI:** ${stats.noLinks}\n\n`;
    markdown += `---\n\n`;
    markdown += `## Detailed Results\n\n`;

    results.forEach((result, index) => {
      markdown += `### Reference ${index + 1}\n\n`;
      markdown += `**Original Reference:**\n\n${result.reference}\n\n`;
      markdown += `**Status:** ${getStatusText(result.status)}\n\n`;
      if (result.doi) {
        const linkUrl = result.doi.startsWith('http') ? result.doi : `https://doi.org/${result.doi}`;
        markdown += `**Link:** [${result.doi}](${linkUrl})\n\n`;
      }
      markdown += `**Message:** ${result.message}\n\n`;
      if (result.details) {
        markdown += `**Details:** ${result.details}\n\n`;
      }
      markdown += `---\n\n`;
    });

    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reference-validation-report-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-foreground mb-2">Validate References</h1>
          <p className="text-muted-foreground">
            Check the validity of DOI and URL links in your paper references
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Input References</CardTitle>
            <CardDescription>
              Paste your references or upload a text file. Each reference should be on a separate line. All links (DOIs and URLs) will be validated.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste your references here, one per line..."
              value={references}
              onChange={(e) => setReferences(e.target.value)}
              className="min-h-[200px] font-mono text-sm"
            />
            <div className="flex gap-2">
            <Button 
              onClick={handleValidate} 
              disabled={!references.trim() || isValidating}
              className="flex-1"
            >
              {isValidating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Validating...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Validate References
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => document.getElementById('file-upload')?.click()}
                disabled={isValidating}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload File
              </Button>
              <input
                id="file-upload"
                type="file"
                accept=".txt"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          </CardContent>
        </Card>

        {/* How It Works Section */}
        <div className="mb-8">
          <CollapsibleSection 
            title="How It Works" 
            icon="ℹ️"
            isOpen={isHowItWorksOpen}
            onToggle={() => setIsHowItWorksOpen(!isHowItWorksOpen)}
          >
            <div className="space-y-4 text-sm text-muted-foreground">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Step 1: Input References</h4>
                <p>
                  Paste your reference list in the text area above or upload a text file containing your citations. Each reference should be on a separate line.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-2">Step 2: Automatic Validation</h4>
                <p>
                  The validator will automatically:
                </p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Check DOI links via Crossref for verification</li>
                  <li>Validate HTTP/HTTPS URLs for accessibility</li>
                  <li>Search academic databases (Semantic Scholar, PubMed) for references without links</li>
                  <li>Perform web searches to locate missing references</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-2">Step 3: Review Results</h4>
                <p>
                  Each reference will be marked with one of the following statuses:
                </p>
                <div className="mt-2 space-y-2 ml-4">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-green-600">Valid</strong> - DOI or URL verified successfully
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-red-600">Invalid</strong> - Link is broken or not accessible
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-blue-600">Found via Search</strong> - Reference located in academic databases
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-orange-600">Not Found</strong> - Unable to verify or locate the reference
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-muted-foreground">No Links</strong> - Reference has no DOI or URL to validate
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-2">Step 4: Share & Export</h4>
                <p>
                  Once validation is complete, you can:
                </p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Share your validation report with a unique link</li>
                  <li>Download the results as a Markdown file</li>
                  <li>Review detailed information about each reference</li>
                </ul>
              </div>
            </div>
          </CollapsibleSection>
        </div>

        {results.length > 0 && (
          <div className="space-y-6">
            <Card className="border-primary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Validation Summary</CardTitle>
                  <div className="flex gap-2">
                    <Button onClick={handleShare} variant="outline" size="sm" disabled={isSharing}>
                      {isSharing ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Share2 className="w-4 h-4 mr-2" />
                      )}
                      Share Report
                    </Button>
                    <Button onClick={downloadMarkdown} variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download Report
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-3xl font-bold text-foreground">{getSummaryStats().total}</div>
                    <div className="text-sm text-muted-foreground">Total Checked</div>
                  </div>
                  <div className="text-center p-4 bg-green-500/10 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">{getSummaryStats().valid}</div>
                    <div className="text-sm text-muted-foreground">Valid</div>
                  </div>
                  <div className="text-center p-4 bg-red-500/10 rounded-lg">
                    <div className="text-3xl font-bold text-red-600">{getSummaryStats().invalid}</div>
                    <div className="text-sm text-muted-foreground">Invalid</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-500/10 rounded-lg">
                    <div className="text-3xl font-bold text-yellow-600">{getSummaryStats().noLinks}</div>
                    <div className="text-sm text-muted-foreground">No Links</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detailed Results</CardTitle>
                <CardDescription>
                  Validation details for each reference
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-6">
                    {results.map((result, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="mt-1">{getStatusIcon(result.status)}</div>
                          <div className="flex-1 space-y-2">
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Reference #{index + 1}</div>
                              <div className="text-sm font-mono bg-muted p-3 rounded-md">
                                {result.reference}
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold">Status:</span>
                                <span className="text-sm">{getStatusText(result.status)}</span>
                              </div>
                              
                               {result.doi && (
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-semibold">Link:</span>
                                  <a 
                                    href={result.doi.startsWith('http') ? result.doi : `https://doi.org/${result.doi}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-primary hover:underline flex items-center gap-1 break-all"
                                  >
                                    {result.doi}
                                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                  </a>
                                </div>
                              )}
                              
                              <div>
                                <span className="text-sm font-semibold">Message:</span>
                                <p className="text-sm text-muted-foreground mt-1">{result.message}</p>
                              </div>
                              
                              {result.details && (
                                <div>
                                  <span className="text-sm font-semibold">Details:</span>
                                  <p className="text-sm text-muted-foreground mt-1">{result.details}</p>
                                </div>
                              )}
                              
                              {result.searchResults && result.searchResults.length > 0 && (
                                <div className="mt-3 space-y-2">
                                  <span className="text-sm font-semibold">Search Results:</span>
                                  <div className="space-y-2">
                                    {result.searchResults.map((searchResult, idx) => (
                                      <div key={idx} className="border-l-2 border-primary/30 pl-3 py-2">
                                        <a 
                                          href={searchResult.link}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-sm font-medium text-primary hover:underline flex items-start gap-2"
                                        >
                                          <ExternalLink className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                          <span className="break-words">{searchResult.title}</span>
                                        </a>
                                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                          {searchResult.snippet}
                                        </p>
                                        <p className="text-xs text-muted-foreground/70 mt-1 break-all">
                                          {searchResult.link}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Share Link Display */}
        {shareLink && (
          <Card className="border-primary bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Share2 className="h-5 w-5" />
                Share Link Created
              </CardTitle>
              <CardDescription>
                Anyone with this link can view your validation report
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  className="flex-1 px-3 py-2 text-sm border rounded-md bg-background"
                />
                <Button onClick={copyShareLink} variant="outline" size="icon">
                  {isCopied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ValidateReferences;
