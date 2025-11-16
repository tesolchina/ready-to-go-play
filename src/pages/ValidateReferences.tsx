import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, FileText, CheckCircle, XCircle, AlertCircle, Loader2, ArrowLeft, Download, ExternalLink } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ValidationResult {
  reference: string;
  doi?: string;
  status: "no_doi" | "valid" | "invalid" | "content_mismatch";
  message: string;
  details?: string;
}

const ValidateReferences = () => {
  const [references, setReferences] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [results, setResults] = useState<ValidationResult[]>([]);
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

    try {
      const { data, error } = await supabase.functions.invoke("validate-references", {
        body: { references },
      });

      if (error) throw error;

      setResults(data.results || []);
      toast({
        title: "Validation Complete",
        description: `Validated ${data.results.length} references`,
      });
    } catch (error) {
      console.error("Error validating references:", error);
      toast({
        title: "Error",
        description: "Failed to validate references. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const getStatusIcon = (status: ValidationResult["status"]) => {
    switch (status) {
      case "valid":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "invalid":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "content_mismatch":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "no_doi":
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: ValidationResult["status"]) => {
    switch (status) {
      case "valid":
        return "Valid - DOI link is accessible and content matches";
      case "invalid":
        return "Invalid - DOI link is not accessible or content does not match";
      case "content_mismatch":
        return "Content Mismatch - DOI accessible but content may not match";
      case "no_doi":
        return "No DOI - No DOI identifier found in this reference";
    }
  };

  const getSummaryStats = () => {
    const total = results.length;
    const valid = results.filter(r => r.status === "valid").length;
    const invalid = results.filter(r => r.status === "invalid" || r.status === "content_mismatch").length;
    const noDoi = results.filter(r => r.status === "no_doi").length;
    return { total, valid, invalid, noDoi };
  };

  const downloadMarkdown = () => {
    const stats = getSummaryStats();
    let markdown = `# Reference Validation Report\n\n`;
    markdown += `## Summary\n\n`;
    markdown += `- **Total References Checked:** ${stats.total}\n`;
    markdown += `- **Valid References:** ${stats.valid}\n`;
    markdown += `- **Invalid References:** ${stats.invalid}\n`;
    markdown += `- **References Without DOI:** ${stats.noDoi}\n\n`;
    markdown += `---\n\n`;
    markdown += `## Detailed Results\n\n`;

    results.forEach((result, index) => {
      markdown += `### Reference ${index + 1}\n\n`;
      markdown += `**Original Reference:**\n\n${result.reference}\n\n`;
      markdown += `**Status:** ${getStatusText(result.status)}\n\n`;
      if (result.doi) {
        markdown += `**DOI:** [${result.doi}](https://doi.org/${result.doi})\n\n`;
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
            Check the validity of DOI links in your paper references
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Input References</CardTitle>
            <CardDescription>
              Paste your references or upload a text file. Each reference should be on a separate line.
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

        {results.length > 0 && (
          <div className="space-y-6">
            <Card className="border-primary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Validation Summary</CardTitle>
                  <Button onClick={downloadMarkdown} variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download Report
                  </Button>
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
                    <div className="text-3xl font-bold text-yellow-600">{getSummaryStats().noDoi}</div>
                    <div className="text-sm text-muted-foreground">No DOI</div>
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
                                  <span className="text-sm font-semibold">DOI:</span>
                                  <a 
                                    href={`https://doi.org/${result.doi}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-primary hover:underline flex items-center gap-1"
                                  >
                                    {result.doi}
                                    <ExternalLink className="w-3 h-3" />
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
      </div>
    </div>
  );
};

export default ValidateReferences;
