import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft } from "lucide-react";
import { Layout } from "@/components/Layout";

interface PDFDocument {
  id: string;
  title: string;
  filename: string;
  storage_path: string;
  custom_slug: string;
  description: string | null;
}

export default function PDFViewer() {
  const { slug } = useParams<{ slug: string }>();
  const [document, setDocument] = useState<PDFDocument | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (slug) {
      fetchDocument();
    }
  }, [slug]);

  const fetchDocument = async () => {
    try {
      // Fetch document metadata
      const { data, error: dbError } = await supabase
        .from("pdf_documents")
        .select("*")
        .eq("custom_slug", slug)
        .single();

      if (dbError) throw dbError;
      if (!data) throw new Error("Document not found");

      setDocument(data);

      // Get public URL for the PDF
      const { data: urlData } = supabase.storage
        .from("pdfs")
        .getPublicUrl(data.storage_path);

      setPdfUrl(urlData.publicUrl);
    } catch (error) {
      console.error("Error fetching document:", error);
      setError("Document not found");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!document) return;

    try {
      const { data, error } = await supabase.storage
        .from("pdfs")
        .download(document.storage_path);

      if (error) throw error;

      // Create download link
      const url = window.URL.createObjectURL(data);
      const a = window.document.createElement("a");
      a.href = url;
      a.download = document.filename;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4 text-center">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  if (error || !document) {
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Document Not Found</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button asChild>
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Home
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <div className="mb-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{document.title}</h1>
              {document.description && (
                <p className="text-muted-foreground">{document.description}</p>
              )}
            </div>
            <Button onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="border rounded-lg overflow-hidden bg-muted">
          <iframe
            src={pdfUrl}
            className="w-full h-[80vh]"
            title={document.title}
          />
        </div>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          <p>Having trouble viewing? Try downloading the PDF instead.</p>
        </div>
      </div>
    </Layout>
  );
}
