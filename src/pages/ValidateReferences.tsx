import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, FileText, CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";

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

  return (
    <Layout>
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Validate References</h1>
          <p className="text-muted-foreground">
            Check the validity of DOI links in your paper references
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Input References</CardTitle>
              <CardDescription>
                Paste your reference section or upload a text file
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Paste your references here, one per line..."
                value={references}
                onChange={(e) => setReferences(e.target.value)}
                className="min-h-[300px] font-mono text-sm"
              />
              
              <div className="flex items-center gap-4">
                <Button
                  onClick={handleValidate}
                  disabled={isValidating}
                  className="flex-1"
                >
                  {isValidating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Validating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Validate References
                    </>
                  )}
                </Button>

                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept=".txt,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button type="button" variant="outline" asChild>
                    <span>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload File
                    </span>
                  </Button>
                </label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Validation Results</CardTitle>
              <CardDescription>
                {results.length > 0
                  ? `Found ${results.length} references`
                  : "Results will appear here"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isValidating ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                  {results.map((result, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg border bg-card"
                    >
                      <div className="flex items-start gap-3">
                        {getStatusIcon(result.status)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground mb-1">
                            {result.message}
                          </p>
                          {result.doi && (
                            <p className="text-xs text-muted-foreground mb-2">
                              DOI: {result.doi}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {result.reference}
                          </p>
                          {result.details && (
                            <p className="text-xs text-muted-foreground mt-2 italic">
                              {result.details}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="w-12 h-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground">
                    No results yet. Enter references and click validate.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ValidateReferences;
