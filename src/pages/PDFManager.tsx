import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, Link as LinkIcon, Trash2, ExternalLink } from "lucide-react";
import { Layout } from "@/components/Layout";

interface PDFDocument {
  id: string;
  title: string;
  filename: string;
  storage_path: string;
  custom_slug: string;
  description: string | null;
  created_at: string;
}

export default function PDFManager() {
  const [documents, setDocuments] = useState<PDFDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    customSlug: "",
    file: null as File | null,
  });

  useEffect(() => {
    checkAuth();
    fetchDocuments();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to upload PDFs",
        variant: "destructive",
      });
    }
    setUserId(user?.id || null);
  };

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from("pdf_documents")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast({
        title: "Error",
        description: "Failed to load documents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = async (title: string) => {
    try {
      const { data, error } = await supabase.rpc("generate_pdf_slug", {
        input_title: title,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error generating slug:", error);
      return title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setFormData({ ...formData, file });
    } else {
      toast({
        title: "Invalid file",
        description: "Please select a PDF file",
        variant: "destructive",
      });
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to upload PDFs",
        variant: "destructive",
      });
      return;
    }

    if (!formData.file || !formData.title) {
      toast({
        title: "Missing fields",
        description: "Please provide a title and file",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      // Generate slug if not provided
      const slug = formData.customSlug || (await generateSlug(formData.title));
      
      // Upload file to storage
      const fileExt = formData.file.name.split(".").pop();
      const fileName = `${slug}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("pdfs")
        .upload(filePath, formData.file);

      if (uploadError) throw uploadError;

      // Save metadata to database
      const { error: dbError } = await supabase.from("pdf_documents").insert({
        title: formData.title,
        filename: formData.file.name,
        storage_path: filePath,
        custom_slug: slug,
        description: formData.description || null,
        user_id: userId,
      });

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "PDF uploaded successfully",
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        customSlug: "",
        file: null,
      });

      // Refresh list
      fetchDocuments();
    } catch (error) {
      console.error("Error uploading PDF:", error);
      toast({
        title: "Error",
        description: "Failed to upload PDF",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, storagePath: string) => {
    if (!confirm("Are you sure you want to delete this PDF?")) return;

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("pdfs")
        .remove([storagePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from("pdf_documents")
        .delete()
        .eq("id", id);

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "PDF deleted successfully",
      });

      fetchDocuments();
    } catch (error) {
      console.error("Error deleting PDF:", error);
      toast({
        title: "Error",
        description: "Failed to delete PDF",
        variant: "destructive",
      });
    }
  };

  const copyLink = (slug: string) => {
    const url = `${window.location.origin}/pdf/${slug}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Copied",
      description: "Link copied to clipboard",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <h1 className="text-4xl font-bold mb-8 text-center">PDF Manager</h1>

        {/* Upload Form */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Upload className="w-6 h-6" />
            Upload New PDF
          </h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Document title"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Optional description"
              />
            </div>

            <div>
              <Label htmlFor="customSlug">Custom URL Slug (optional)</Label>
              <Input
                id="customSlug"
                value={formData.customSlug}
                onChange={(e) =>
                  setFormData({ ...formData, customSlug: e.target.value })
                }
                placeholder="my-custom-url"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Leave blank to auto-generate from title
              </p>
            </div>

            <div>
              <Label htmlFor="file">PDF File *</Label>
              <Input
                id="file"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                required
              />
            </div>

            <Button type="submit" disabled={uploading}>
              {uploading ? "Uploading..." : "Upload PDF"}
            </Button>
          </form>
        </Card>

        {/* Documents List */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Uploaded Documents
          </h2>

          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : documents.length === 0 ? (
            <p className="text-muted-foreground">No documents uploaded yet</p>
          ) : (
            <div className="grid gap-4">
              {documents.map((doc) => (
                <Card key={doc.id} className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{doc.title}</h3>
                      {doc.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {doc.description}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground mt-2">
                        {doc.filename}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <LinkIcon className="w-4 h-4" />
                        <code className="text-sm bg-muted px-2 py-1 rounded">
                          /pdf/{doc.custom_slug}
                        </code>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyLink(doc.custom_slug)}
                      >
                        Copy Link
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <a
                          href={`/pdf/${doc.custom_slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(doc.id, doc.storage_path)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
