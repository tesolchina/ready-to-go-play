import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, XCircle, Search, ExternalLink, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ValidationResult {
  reference: string;
  doi?: string;
  status: "no_links" | "valid" | "invalid" | "content_mismatch" | "searching" | "found_via_search" | "not_found";
  message: string;
  details?: string;
}

const SharedReport = () => {
  const { id } = useParams<{ id: string }>();

  const { data: report, isLoading, error } = useQuery({
    queryKey: ["validation-report", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("validation_reports")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const getStatusIcon = (status: ValidationResult["status"]) => {
    switch (status) {
      case "valid":
      case "found_via_search":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "invalid":
      case "not_found":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "searching":
        return <Search className="h-4 w-4 text-blue-600 animate-pulse" />;
      case "content_mismatch":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case "no_links":
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: ValidationResult["status"]) => {
    switch (status) {
      case "valid":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Valid</Badge>;
      case "found_via_search":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Found</Badge>;
      case "invalid":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Invalid</Badge>;
      case "not_found":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Not Found</Badge>;
      case "content_mismatch":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Content Mismatch</Badge>;
      case "no_links":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">No Links</Badge>;
      case "searching":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Searching...</Badge>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-32 w-full mb-8" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800 flex items-center gap-2">
                <XCircle className="h-5 w-5" />
                Report Not Found
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700 mb-4">
                This validation report could not be found. It may have been deleted or the link is incorrect.
              </p>
              <Button asChild>
                <Link to="/validate-references">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Validator
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const results = (report.validation_results as unknown) as ValidationResult[];
  const summary = {
    total: results.length,
    valid: results.filter((r) => r.status === "valid").length,
    found: results.filter((r) => r.status === "found_via_search").length,
    invalid: results.filter((r) => r.status === "invalid").length,
    notFound: results.filter((r) => r.status === "not_found").length,
    contentMismatch: results.filter((r) => r.status === "content_mismatch").length,
    noLinks: results.filter((r) => r.status === "no_links").length,
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Validation Report</h1>
            <p className="text-muted-foreground">
              Created {new Date(report.created_at).toLocaleDateString()} at{" "}
              {new Date(report.created_at).toLocaleTimeString()}
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to="/validate-references">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Validator
            </Link>
          </Button>
        </div>

        {/* Summary Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{summary.total}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{summary.valid}</div>
                <div className="text-sm text-muted-foreground">Valid</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{summary.found}</div>
                <div className="text-sm text-muted-foreground">Found</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{summary.invalid}</div>
                <div className="text-sm text-muted-foreground">Invalid</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{summary.notFound}</div>
                <div className="text-sm text-muted-foreground">Not Found</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{summary.contentMismatch}</div>
                <div className="text-sm text-muted-foreground">Mismatch</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">{summary.noLinks}</div>
                <div className="text-sm text-muted-foreground">No Links</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Input References */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Input References</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-md font-mono text-sm whitespace-pre-wrap max-h-64 overflow-y-auto">
              {report.references_input}
            </div>
          </CardContent>
        </Card>

        {/* Validation Results */}
        <Card>
          <CardHeader>
            <CardTitle>Validation Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((result, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">{getStatusIcon(result.status)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="text-sm font-medium break-words">{result.reference}</p>
                        {getStatusBadge(result.status)}
                      </div>
                      {result.doi && (
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            DOI: {result.doi}
                          </Badge>
                          <a
                            href={`https://doi.org/${result.doi}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline flex items-center gap-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                            View
                          </a>
                        </div>
                      )}
                      <p className="text-sm text-muted-foreground mb-1">{result.message}</p>
                      {result.details && (
                        <p className="text-xs text-muted-foreground italic">{result.details}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SharedReport;