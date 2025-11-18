import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { CollapsibleSection } from "@/components/CollapsibleSection";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { Send, BookOpen, Sparkles, ChevronDown, Copy, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import phrasebankData from "@/lib/phrasebank-data.json";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Template {
  original: string;
  template: string;
  explanation: string;
}

interface Exercise {
  instruction: string;
  template: string;
  hints: string[];
}

interface Pattern {
  categoryType: "moves" | "general";
  category: string;
  subcategory: string;
  templates: Template[];
  exercises: Exercise[];
}

interface AnalysisResult {
  patterns: Pattern[];
}

interface BulletinPost {
  id: string;
  user_id: string | null;
  title: string;
  description: string | null;
  chat_history: Message[];
  category_type: string | null;
  category: string | null;
  subcategory: string | null;
  discipline: string | null;
  upvotes: number;
  view_count: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

// Moves/Steps - Research paper structure
const MOVES_STEPS = [
  "Introducing work",
  "Referring to sources",
  "Describing methods",
  "Reporting results",
  "Discussing findings",
  "Writing conclusions",
];

// General Language Functions
const GENERAL_LANGUAGE_FUNCTIONS = [
  "Being cautious",
  "Being critical",
  "Classifying and listing",
  "Compare and contrast",
  "Defining terms",
  "Describing trends",
  "Describing quantities",
  "Explaining causality",
  "Giving examples",
  "Signalling transition",
  "Writing about the past",
];

// Common academic disciplines
const COMMON_DISCIPLINES = [
  "Biology",
  "Chemistry",
  "Physics",
  "Mathematics",
  "Computer Science",
  "Engineering",
  "Medicine",
  "Psychology",
  "Sociology",
  "Economics",
  "Business",
  "Education",
  "Literature",
  "History",
  "Philosophy",
  "Political Science",
  "Other",
];

// Example paragraph for analysis
const EXAMPLE_PARAGRAPH = "Research suggests that multilingual writers draw on underlying knowledge across languages (Gentil, 2011, Kobayashi and Rinnert, 2012, Kobayashi and Rinnert, 2023) to understand and produce a new genre. Specifically, L1 and L2 prior genre knowledge gradually become interrelated and integrated with each other to build genre knowledge (Kim and Belcher, 2018, Kobayashi and Rinnert, 2012). In Kim and Belcher's (2018) study, for example, EFL study abroad students, when exposed to familiar and analogous rhetorical situations, recognized certain familiar features and repurposed prior knowledge from both L1 and L2 when writing in a new writing context. Multilingual writers' thinking and awareness are influenced by their diverse social and writing contexts and play a significant role in how their genre knowledge develops (Kim & Belcher, 2018). Similarly, in the present study on EFL undergraduate students in genre-based writing classes, students' thinking and awareness are observed in relation to various multilingual experiences in the EGAP context.";

const AcademicPhraseBank = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesToShare, setMessagesToShare] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [categoryType, setCategoryType] = useState<"moves" | "general" | "">("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("__all__");
  const [discipline, setDiscipline] = useState<string>("__none__");
  const [customDiscipline, setCustomDiscipline] = useState<string>("");
  const [showDropdowns, setShowDropdowns] = useState(true);
  const [selectedModel, setSelectedModel] = useState<string>("aliyun");
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Paragraph analyzer state
  const [showAnalyzer, setShowAnalyzer] = useState(false);
  const [paragraphInput, setParagraphInput] = useState(EXAMPLE_PARAGRAPH);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedPatterns, setSelectedPatterns] = useState<Set<string>>(new Set());
  const [filterCategoryType, setFilterCategoryType] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  // Bulletin board state
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareTitle, setShareTitle] = useState("");
  const [shareDescription, setShareDescription] = useState("");
  const [shareAnonymous, setShareAnonymous] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [posts, setPosts] = useState<BulletinPost[]>([]);
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [postFilter, setPostFilter] = useState<"all" | "category" | "recent">("recent");

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Subcategories based on selected category - loaded from phrasebank-data.json
  const getSubcategories = (category: string): string[] => {
    const categoryData = (phrasebankData as Record<string, Record<string, string[]>>)[category];
    if (categoryData) {
      return Object.keys(categoryData);
    }
    return [];
  };

  // Get examples for a specific category and subcategory
  const getExamples = (category: string, subcategory: string): string[] => {
    const categoryData = (phrasebankData as Record<string, Record<string, string[]>>)[category];
    if (categoryData && categoryData[subcategory]) {
      return categoryData[subcategory];
    }
    return [];
  };

  const subcategories = selectedCategory ? getSubcategories(selectedCategory) : [];

  // Reset subcategory and category when category type changes
  useEffect(() => {
    setSelectedCategory("");
    setSelectedSubcategory("__all__");
  }, [categoryType]);

  // Reset subcategory when category changes
  useEffect(() => {
    setSelectedSubcategory("__all__");
  }, [selectedCategory]);

  // Get available categories based on selected type
  const getAvailableCategories = () => {
    if (categoryType === "moves") return MOVES_STEPS;
    if (categoryType === "general") return GENERAL_LANGUAGE_FUNCTIONS;
    return [];
  };

  // Streaming handler
  const handleStreamingResponse = async (
    requestBody: any,
    userMessage: Message,
    newMessages: Message[]
  ) => {
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    // Add placeholder assistant message
    const assistantMessageIndex = newMessages.length;
    setMessages([...newMessages, { role: "assistant", content: "" }]);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
      const functionUrl = `${supabaseUrl}/functions/v1/academic-phrasebank-chat`;

      const response = await fetch(functionUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token || supabaseKey}`,
          apikey: supabaseKey || "",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      let accumulatedContent = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          // Process any remaining buffer
          if (buffer) {
            const lines = buffer.split("\n");
            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6).trim();
                if (data && data !== "[DONE]") {
                  try {
                    const parsed = JSON.parse(data);
                    if (parsed.content) {
                      accumulatedContent += parsed.content;
                      setMessages((prev) => {
                        const updated = [...prev];
                        updated[assistantMessageIndex] = {
                          role: "assistant",
                          content: accumulatedContent,
                        };
                        return updated;
                      });
                    }
                  } catch (e) {
                    // Skip invalid JSON
                  }
                }
              }
            }
          }
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // Keep incomplete line in buffer

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim();
            if (data === "[DONE]") {
              break;
            }

            if (data) {
              try {
                const parsed = JSON.parse(data);
                if (parsed.done) {
                  // Stream is complete
                  break;
                }
                if (parsed.content) {
                  accumulatedContent += parsed.content;
                  // Update the assistant message with accumulated content
                  setMessages((prev) => {
                    const updated = [...prev];
                    updated[assistantMessageIndex] = {
                      role: "assistant",
                      content: accumulatedContent,
                    };
                    return updated;
                  });
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      }

      setShowDropdowns(false);
    } catch (error) {
      console.error("Error calling chatbot:", error);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
      // Remove the placeholder message on error
      setMessages(newMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetExamples = async () => {
    if (!categoryType || !selectedCategory) {
      toast({
        title: "Selection required",
        description: "Please select a category type and category first.",
        variant: "destructive",
      });
      return;
    }

    const finalDiscipline = discipline === "Other" ? customDiscipline : (discipline === "__none__" ? "" : discipline);
    const finalSubcategory = selectedSubcategory === "__all__" ? "" : selectedSubcategory;

    // Build query based on selections
    let query = "";
    if (selectedCategory && finalSubcategory) {
      query = `Provide examples of phrases for "${finalSubcategory}" in the context of "${selectedCategory}"${finalDiscipline ? ` in the field of ${finalDiscipline}` : ''}. Include 5-10 example phrases with brief explanations of when to use them.`;
    } else if (selectedCategory) {
      query = `Provide examples of phrases for "${selectedCategory}"${finalDiscipline ? ` in the field of ${finalDiscipline}` : ''}. Include 5-10 example phrases with brief explanations.`;
    }

    const userMessage: Message = { role: "user", content: query };
    const newMessages = [...messages, userMessage];

    // Get examples for the selected subcategory
    const examples = finalSubcategory 
      ? getExamples(selectedCategory, finalSubcategory)
      : [];

    await handleStreamingResponse(
      {
        messages: newMessages,
        category: selectedCategory,
        subcategory: finalSubcategory || undefined,
        discipline: finalDiscipline || undefined,
        examples: examples.length > 0 ? examples : undefined,
        model: selectedModel,
      },
      userMessage,
      newMessages
    );
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    const newMessages = [...messages, userMessage];

    await handleStreamingResponse(
      { messages: newMessages, model: selectedModel },
      userMessage,
      newMessages
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Paragraph analyzer handlers
  const handleAnalyzeParagraph = async () => {
    if (!paragraphInput.trim() || paragraphInput.length < 50) {
      toast({
        title: "Input required",
        description: "Please enter at least 50 characters of text from a journal article.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-paragraph', {
        body: { paragraph: paragraphInput }
      });

      if (error) throw error;

      setAnalysisResult(data);
      // Auto-select all patterns
      if (data?.patterns?.length > 0) {
        const patternKeys = data.patterns.map((p: Pattern) => `${p.category}|${p.subcategory}`);
        setSelectedPatterns(new Set(patternKeys));
      }
      toast({ 
        title: "Analysis complete! 🎉",
        description: `Found ${data?.patterns?.length || 0} pattern(s) in the text.`
      });
    } catch (error) {
      console.error('Error analyzing paragraph:', error);
      toast({
        title: "Analysis failed",
        description: "Failed to analyze the paragraph. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const useAnalysisSettings = (pattern: Pattern) => {
    setCategoryType(pattern.categoryType);
    setSelectedCategory(pattern.category);
    setSelectedSubcategory(pattern.subcategory);
    
    toast({ 
      title: "Settings applied! 📝",
      description: "Start chatting with these category settings." 
    });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const togglePatternSelection = (category: string, subcategory: string) => {
    const key = `${category}|${subcategory}`;
    setSelectedPatterns(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const selectAllPatterns = () => {
    if (!analysisResult) return;
    const allKeys = analysisResult.patterns.map(p => `${p.category}|${p.subcategory}`);
    setSelectedPatterns(new Set(allKeys));
  };

  const deselectAllPatterns = () => {
    setSelectedPatterns(new Set());
  };

  const handleShareAnalysis = () => {
    if (!analysisResult || selectedPatterns.size === 0) return;

    const patternsToShare = analysisResult.patterns.filter(p => 
      selectedPatterns.has(`${p.category}|${p.subcategory}`)
    );

    // Create a conversation-like structure from the analysis
    const patternContents = patternsToShare.map(pattern => 
      `## ${pattern.categoryType === "moves" ? "Moves/Steps" : "General Functions"}: ${pattern.category} > ${pattern.subcategory}\n\n### Extracted Templates\n\n${pattern.templates.map((t, i) => `${i + 1}. **Original:** ${t.original}\n   **Template:** ${t.template}\n   **Explanation:** ${t.explanation}`).join('\n\n')}\n\n### Practice Exercises\n\n${pattern.exercises.map((e, i) => `${i + 1}. **Task:** ${e.instruction}\n   **Template:** ${e.template}\n   **Hints:** ${e.hints.join(', ')}`).join('\n\n')}`
    ).join('\n\n---\n\n');

    const analysisMessages: Message[] = [
      {
        role: "user",
        content: `I analyzed this paragraph:\n\n${paragraphInput}`
      },
      {
        role: "assistant",
        content: `# Analysis Results (${patternsToShare.length} Pattern${patternsToShare.length > 1 ? 's' : ''})\n\n${patternContents}`
      }
    ];

    // Set messages to share
    setMessagesToShare(analysisMessages);
    
    // Pre-fill the share dialog
    const categories = patternsToShare.map(p => p.category).join(', ');
    setShareTitle(`Paragraph Analysis: ${patternsToShare.length} Pattern${patternsToShare.length > 1 ? 's' : ''}`);
    setShareDescription(`Analysis identifying ${patternsToShare.length} pattern(s): ${categories}`);
    
    // Open dialog
    setShareDialogOpen(true);
  };

  // Bulletin board handlers
  const loadPosts = async () => {
    setIsLoadingPosts(true);
    try {
      let query = supabase
        .from('phrasebank_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (postFilter === "category" && selectedCategory) {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query.limit(20);

      if (error) throw error;
      setPosts((data || []).map(post => ({
        ...post,
        chat_history: post.chat_history as unknown as Message[]
      })));
    } catch (error) {
      console.error('Error loading posts:', error);
      toast({
        title: "Failed to load posts",
        variant: "destructive",
      });
    } finally {
      setIsLoadingPosts(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [postFilter, selectedCategory]);

  const handleShareChat = async () => {
    if (!shareTitle.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your post.",
        variant: "destructive",
      });
      return;
    }

    if (messagesToShare.length === 0) {
      toast({
        title: "No content",
        description: "Please have a conversation or analysis before sharing.",
        variant: "destructive",
      });
      return;
    }

    setIsSharing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const finalDiscipline = discipline === "Other" ? customDiscipline : (discipline === "__none__" ? null : discipline);
      const finalSubcategory = selectedSubcategory === "__all__" ? null : selectedSubcategory;
      
      const postData = {
        user_id: shareAnonymous ? null : user?.id,
        title: shareTitle.trim(),
        description: shareDescription.trim() || null,
        chat_history: messagesToShare as unknown as Json,
        category_type: categoryType || null,
        category: selectedCategory || null,
        subcategory: finalSubcategory,
        discipline: finalDiscipline
      };

      const { error } = await supabase
        .from('phrasebank_posts')
        .insert([postData]);

      if (error) throw error;

      toast({ title: "Shared successfully! 🎉" });
      setShareDialogOpen(false);
      setShareTitle("");
      setShareDescription("");
      setShareAnonymous(false);
      await loadPosts();
    } catch (error) {
      console.error('Error sharing chat:', error);
      toast({
        title: "Failed to share",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };

  const togglePostExpansion = async (postId: string) => {
    const newExpanded = new Set(expandedPosts);
    
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
      // Increment view count
      const { data } = await supabase
        .from('phrasebank_posts')
        .select('view_count')
        .eq('id', postId)
        .single();
      
      if (data) {
        await supabase
          .from('phrasebank_posts')
          .update({ view_count: (data.view_count || 0) + 1 })
          .eq('id', postId);
      }
    }
    
    setExpandedPosts(newExpanded);
  };

  const usePostSettings = (post: BulletinPost) => {
    if (post.category_type) setCategoryType(post.category_type as "moves" | "general");
    if (post.category) setSelectedCategory(post.category);
    if (post.subcategory) setSelectedSubcategory(post.subcategory);
    if (post.discipline) setDiscipline(post.discipline);
    
    toast({ 
      title: "Settings applied! 📝",
      description: "Start chatting with these settings." 
    });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Card className="h-[calc(100vh-12rem)] shadow-[var(--shadow-elevated)] border-2">
          <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-accent/5">
            <div className="flex items-center justify-between mb-3">
              <CardTitle className="flex items-center gap-3 text-3xl">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <BookOpen className="h-7 w-7 text-primary" />
                </div>
                Academic PhraseBank Assistant
              </CardTitle>
              <div className="w-40">
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger className="bg-background border-2 hover:border-primary/50 transition-colors">
                    <SelectValue placeholder="Model" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    <SelectItem value="aliyun">Aliyun</SelectItem>
                    <SelectItem value="kimi">Kimi</SelectItem>
                    <SelectItem value="spark">Spark</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <CardDescription className="text-base">
              Get help with academic writing phrases, sentence structures, and language patterns
            </CardDescription>
            <p className="text-sm text-muted-foreground mt-3 flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" />
              Inspired by the{" "}
              <a 
                href="https://www.phrasebank.manchester.ac.uk/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="underline hover:text-primary transition-colors font-medium"
              >
                Manchester Academic Phrasebank
              </a>
            </p>
          </CardHeader>
          <CardContent className="flex flex-col h-[calc(100%-5rem)]">
            {/* Dropdown Selection Section */}
            {showDropdowns && messages.length === 0 && (
              <div className="mb-6 p-6 bg-gradient-to-br from-muted/50 to-accent/10 rounded-xl border-2 border-border/50 space-y-4 shadow-sm">
                <div className="space-y-2">
                  <Label htmlFor="category-type">Category Type *</Label>
                  <Select
                    value={categoryType}
                    onValueChange={(value) => setCategoryType(value as "moves" | "general" | "")}
                  >
                    <SelectTrigger id="category-type">
                      <SelectValue placeholder="Select category type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="moves">Moves/Steps (Research Paper Structure)</SelectItem>
                      <SelectItem value="general">General Language Functions</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {categoryType === "moves" 
                      ? "Select phrases for specific sections of a research paper"
                      : categoryType === "general"
                      ? "Select general language functions for academic writing"
                      : "Choose a category type to begin"}
                  </p>
                </div>

                {categoryType && (
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableCategories().map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {selectedCategory && subcategories.length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="subcategory">Subcategory (Optional)</Label>
                    <Select
                      value={selectedSubcategory}
                      onValueChange={setSelectedSubcategory}
                    >
                      <SelectTrigger id="subcategory">
                        <SelectValue placeholder="Select a subcategory (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__all__">All subcategories</SelectItem>
                        {subcategories.map((subcategory) => (
                          <SelectItem key={subcategory} value={subcategory}>
                            {subcategory}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="discipline">Discipline (Optional)</Label>
                  <Select value={discipline} onValueChange={setDiscipline}>
                    <SelectTrigger id="discipline">
                      <SelectValue placeholder="Select your discipline (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">No specific discipline</SelectItem>
                      {COMMON_DISCIPLINES.map((disc) => (
                        <SelectItem key={disc} value={disc}>
                          {disc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {discipline === "Other" && (
                  <div className="space-y-2">
                    <Label htmlFor="custom-discipline">Enter Your Discipline</Label>
                    <Input
                      id="custom-discipline"
                      placeholder="e.g., Environmental Science, Linguistics, etc."
                      value={customDiscipline}
                      onChange={(e) => setCustomDiscipline(e.target.value)}
                    />
                  </div>
                )}

                <Button
                  onClick={handleGetExamples}
                  disabled={isLoading || !categoryType || !selectedCategory}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                      Generating Examples...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Get Examples
                    </>
                  )}
                </Button>
              </div>
            )}

            <ScrollArea className="flex-1 pr-4 mb-4" ref={scrollRef}>
              {messages.length === 0 && !showDropdowns ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-8">
                  <BookOpen className="h-16 w-16 text-muted-foreground" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Welcome to Academic PhraseBank</h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      Ask me for help with academic writing phrases, transitions, citations, or any
                      language patterns you need for your research papers.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 w-full max-w-2xl">
                    <Button
                      variant="outline"
                      className="h-auto py-3 px-4 text-left"
                      onClick={() => setInput("How do I introduce a research gap in my paper?")}
                    >
                      <span className="text-sm">How do I introduce a research gap?</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto py-3 px-4 text-left"
                      onClick={() => setInput("What are some phrases for discussing limitations?")}
                    >
                      <span className="text-sm">Phrases for discussing limitations</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto py-3 px-4 text-left"
                      onClick={() => setInput("Help me with transition phrases between sections")}
                    >
                      <span className="text-sm">Transition phrases between sections</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto py-3 px-4 text-left"
                      onClick={() => setInput("How do I present statistical results formally?")}
                    >
                      <span className="text-sm">Present statistical results</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message, index) => {
                    const isLastAssistant = 
                      message.role === "assistant" && 
                      (index === messages.length - 1 || messages[index + 1]?.role === "user");
                    
                    // Generate suggested prompts for assistant messages
                    const getSuggestedPrompts = (content: string, category?: string): string[] => {
                      const suggestions: string[] = [];
                      
                      if (category) {
                        if (category.includes("Introducing") || category.includes("work")) {
                          suggestions.push("How do I introduce a research gap?");
                          suggestions.push("What phrases can I use to state my research purpose?");
                        } else if (category.includes("Results") || category.includes("Reporting")) {
                          suggestions.push("How do I present statistical results?");
                          suggestions.push("What phrases indicate negative results?");
                        } else if (category.includes("Discussion") || category.includes("findings")) {
                          suggestions.push("How do I compare my results with previous studies?");
                          suggestions.push("What phrases suggest implications?");
                        } else if (category.includes("Conclusion")) {
                          suggestions.push("How do I summarize my findings?");
                          suggestions.push("What phrases signal limitations?");
                        } else if (category.includes("transition") || category.includes("Signalling")) {
                          suggestions.push("What phrases connect different sections?");
                          suggestions.push("How do I preview the next section?");
                        } else if (category.includes("cautious") || category.includes("Being cautious")) {
                          suggestions.push("How do I express uncertainty?");
                          suggestions.push("What phrases show tentative conclusions?");
                        }
                      }
                      
                      // General suggestions
                      if (suggestions.length < 2) {
                        suggestions.push("Can you provide more examples?");
                        suggestions.push("What are alternative phrases I can use?");
                      }
                      
                      return suggestions.slice(0, 2); // Return max 2 suggestions
                    };
                    
                    const suggestedPrompts = message.role === "assistant" && isLastAssistant
                      ? getSuggestedPrompts(message.content, selectedCategory)
                      : [];
                    
                    return (
                      <div key={index} className="space-y-2">
                        <div
                          className={`flex ${
                            message.role === "user" ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg px-4 py-2 ${
                              message.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            {message.role === "assistant" ? (
                              <div className="prose prose-sm max-w-none dark:prose-invert">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                  {message.content}
                                </ReactMarkdown>
                              </div>
                            ) : (
                              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            )}
                          </div>
                        </div>
                        
                        {/* Suggested prompts after assistant messages */}
                        {suggestedPrompts.length > 0 && (
                          <div className="flex flex-wrap gap-2 ml-0 pl-0">
                            {suggestedPrompts.map((prompt, promptIndex) => (
                              <Button
                                key={promptIndex}
                                variant="outline"
                                size="sm"
                                className="h-auto py-1.5 px-3 text-xs"
                                onClick={() => {
                                  setInput(prompt);
                                  // Auto-scroll to input after a brief delay
                                  setTimeout(() => {
                                    const textarea = document.querySelector('textarea');
                                    textarea?.focus();
                                  }, 100);
                                }}
                              >
                                {prompt}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-lg px-4 py-2 bg-muted">
                        <Skeleton className="h-4 w-[250px] mb-2" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>

            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about academic phrases, writing structures, or get examples..."
                className="min-h-[60px] max-h-[120px]"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                size="icon"
                className="h-[60px] w-[60px]"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Paragraph Analyzer Section */}
        <Card className="mt-16 shadow-[var(--shadow-elevated)] border-2 hover:border-primary/20 transition-all">
          <CardHeader className="border-b bg-gradient-to-r from-accent/5 to-primary/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-xl">
                  <Sparkles className="h-5 w-5 text-accent" />
                </div>
                <CardTitle className="text-2xl">Paragraph Analyzer</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAnalyzer(!showAnalyzer)}
                className="hover:bg-accent/20"
              >
                <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${showAnalyzer ? 'rotate-180' : ''}`} />
              </Button>
            </div>
            <CardDescription className="text-base mt-2">
              Paste a paragraph from a journal article to identify relevant categories and extract sentence templates. An example paragraph is provided below - replace it with your own text.
            </CardDescription>
          </CardHeader>
          {showAnalyzer && (
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="paragraph">Journal Article Paragraph</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setParagraphInput(EXAMPLE_PARAGRAPH)}
                    className="h-auto py-1 px-2 text-xs"
                  >
                    Reset to Example
                  </Button>
                </div>
                <Textarea
                  id="paragraph"
                  placeholder="Paste a paragraph from a published journal article here... (minimum 50 characters)"
                  value={paragraphInput}
                  onChange={(e) => setParagraphInput(e.target.value)}
                  className="min-h-[120px]"
                  disabled={isAnalyzing}
                />
                <p className="text-xs text-muted-foreground">
                  {paragraphInput.length} / 50 characters minimum
                </p>
              </div>

              <Button
                onClick={handleAnalyzeParagraph}
                disabled={isAnalyzing || paragraphInput.length < 50}
                className="w-full"
              >
                {isAnalyzing ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Analyze Paragraph
                  </>
                )}
              </Button>

              {analysisResult && analysisResult.patterns && analysisResult.patterns.length > 0 && (
                <div className="space-y-4 pt-4 border-t">
                  <div className="p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl border-2 mb-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-1.5 bg-primary/10 rounded-lg">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <h4 className="font-semibold text-lg">Patterns Found: {analysisResult.patterns.length}</h4>
                      <Badge variant="outline">{selectedPatterns.size} selected</Badge>
                      <Sparkles className="h-4 w-4 text-accent ml-auto" />
                    </div>
                    
                    {/* Filter Dropdowns */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Filter by Type</Label>
                        <Select value={filterCategoryType} onValueChange={setFilterCategoryType}>
                          <SelectTrigger className="border-2 hover:border-primary/50 transition-colors">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-background z-50">
                            <SelectItem value="all">All Types ({analysisResult.patterns.length})</SelectItem>
                            <SelectItem value="moves">Moves/Steps ({analysisResult.patterns.filter(p => p.categoryType === "moves").length})</SelectItem>
                            <SelectItem value="general">General Functions ({analysisResult.patterns.filter(p => p.categoryType === "general").length})</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Filter by Category</Label>
                        <Select value={filterCategory} onValueChange={setFilterCategory}>
                          <SelectTrigger className="border-2 hover:border-primary/50 transition-colors">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-background z-50 max-h-[300px]">
                            <SelectItem value="all">All Categories</SelectItem>
                            {Array.from(new Set(analysisResult.patterns.map(p => p.category))).sort().map(cat => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={selectAllPatterns}
                        >
                          Select All
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={deselectAllPatterns}
                        >
                          Deselect All
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={handleShareAnalysis}
                          disabled={selectedPatterns.size === 0}
                        >
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generate Report
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {analysisResult.patterns
                      .filter(pattern => 
                        (filterCategoryType === "all" || pattern.categoryType === filterCategoryType) &&
                        (filterCategory === "all" || pattern.category === filterCategory)
                      )
                      .map((pattern, idx) => {
                      const patternKey = `${pattern.category}|${pattern.subcategory}`;
                      const isSelected = selectedPatterns.has(patternKey);
                      
                      return (
                        <div 
                          key={idx}
                          className={cn(
                            "border rounded-lg transition-all",
                            isSelected ? "border-primary bg-primary/5" : "border-border"
                          )}
                        >
                          <div className="p-4">
                            <div className="flex items-start gap-3">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => togglePatternSelection(pattern.category, pattern.subcategory)}
                                className="mt-1 h-4 w-4 rounded border-gray-300"
                              />
                              <div className="flex-1 space-y-3">
                                <div className="flex items-center justify-between flex-wrap gap-2">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <Badge variant={pattern.categoryType === "moves" ? "default" : "secondary"}>
                                      {pattern.categoryType === "moves" ? "Moves/Steps" : "General Functions"}
                                    </Badge>
                                    <Badge variant="outline">{pattern.category}</Badge>
                                    <span className="text-sm font-medium">{pattern.subcategory}</span>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => useAnalysisSettings(pattern)}
                                  >
                                    Use This Category
                                  </Button>
                                </div>

                                <div>
                                  <h5 className="text-sm font-semibold mb-2">Templates ({pattern.templates.length})</h5>
                                  <div className="space-y-2">
                                    {pattern.templates.map((template, tidx) => (
                                      <div key={tidx} className="p-2 bg-muted/50 rounded text-xs space-y-1">
                                        <p className="text-muted-foreground italic">{template.original}</p>
                                        <p className="font-medium">{template.template}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div>
                                  <h5 className="text-sm font-semibold mb-2">Exercises ({pattern.exercises.length})</h5>
                                  <div className="space-y-2">
                                    {pattern.exercises.map((exercise, eidx) => (
                                      <div key={eidx} className="p-2 border rounded text-xs">
                                         <p className="font-medium mb-1">{exercise.instruction}</p>
                                         <p className="text-muted-foreground">{exercise.template}</p>
                       </div>
                     ))}
                   </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    {analysisResult.patterns.filter(pattern => 
                      (filterCategoryType === "all" || pattern.categoryType === filterCategoryType) &&
                      (filterCategory === "all" || pattern.category === filterCategory)
                    ).length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No patterns match the selected filters.</p>
                        <Button 
                          variant="link" 
                          onClick={() => {
                            setFilterCategoryType("all");
                            setFilterCategory("all");
                          }}
                          className="mt-2"
                        >
                          Clear filters
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          )}
        </Card>

        {/* Community Bulletin Board Section */}
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  📋 Community Bulletin Board
                </CardTitle>
                <CardDescription className="mt-1">
                  Learn from conversations shared by other users
                </CardDescription>
              </div>
              {messages.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setMessagesToShare(messages);
                    setShareDialogOpen(true);
                  }}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Share
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4 flex-wrap">
              <Button 
                variant={postFilter === "recent" ? "default" : "outline"}
                size="sm"
                onClick={() => setPostFilter("recent")}
              >
                Recent
              </Button>
              <Button 
                variant={postFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setPostFilter("all")}
              >
                All Posts
              </Button>
              {selectedCategory && (
                <Button 
                  variant={postFilter === "category" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPostFilter("category")}
                >
                  Current Category
                </Button>
              )}
            </div>

            {isLoadingPosts ? (
              <div className="space-y-4">
                {[1,2,3].map(i => <Skeleton key={i} className="h-24" />)}
              </div>
            ) : posts.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No posts yet. Be the first to share!
              </p>
            ) : (
              <div className="space-y-4">
                {posts.map(post => (
                  <CollapsibleSection
                    key={post.id}
                    title={post.title}
                    icon="📝"
                    isOpen={expandedPosts.has(post.id)}
                    onToggle={() => togglePostExpansion(post.id)}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="gap-1">
                          <User className="h-3 w-3" />
                          {post.user_id ? 'User' : 'Anonymous'}
                        </Badge>
                        {post.category_type && <Badge variant="outline">{post.category_type}</Badge>}
                        {post.category && <Badge>{post.category}</Badge>}
                        {post.subcategory && <Badge variant="secondary">{post.subcategory}</Badge>}
                        {post.discipline && <Badge variant="outline">{post.discipline}</Badge>}
                        <span className="text-xs text-muted-foreground ml-auto">
                          {new Date(post.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      {post.description && (
                        <p className="text-sm text-muted-foreground">{post.description}</p>
                      )}

                      <div className="space-y-2 bg-muted/30 rounded-lg p-4 max-h-96 overflow-y-auto">
                        {post.chat_history.map((msg, idx) => (
                          <div
                            key={idx}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                                msg.role === "user"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted"
                              }`}
                            >
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {msg.content}
                              </ReactMarkdown>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            usePostSettings(post);
                          }}
                        >
                          Use These Settings
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(
                              post.chat_history.map(m => `${m.role}: ${m.content}`).join('\n\n')
                            );
                            toast({ title: "Copied to clipboard!" });
                          }}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                    </div>
                  </CollapsibleSection>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Share Dialog */}
        <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share to Bulletin Board</DialogTitle>
              <DialogDescription>
                Share your conversation to help others learn from your academic writing journey
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="share-title">Title *</Label>
                <Input
                  id="share-title"
                  placeholder="e.g., Learning to introduce research findings"
                  value={shareTitle}
                  onChange={(e) => setShareTitle(e.target.value)}
                  maxLength={100}
                />
                <p className="text-xs text-muted-foreground">{shareTitle.length}/100</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="share-description">Description (Optional)</Label>
                <Textarea
                  id="share-description"
                  placeholder="Brief summary of what you learned or what this conversation covers..."
                  value={shareDescription}
                  onChange={(e) => setShareDescription(e.target.value)}
                  maxLength={300}
                />
                <p className="text-xs text-muted-foreground">{shareDescription.length}/300</p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="anonymous"
                  checked={shareAnonymous}
                  onCheckedChange={setShareAnonymous}
                />
                <Label htmlFor="anonymous">Share anonymously</Label>
              </div>

              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">Preview (first 2 messages):</p>
                <div className="space-y-2 max-h-32 overflow-y-auto text-xs">
                  {messagesToShare.slice(0, 2).map((msg, idx) => (
                    <p key={idx} className="text-muted-foreground">
                      <span className="font-medium">{msg.role}:</span> {msg.content.substring(0, 100)}...
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShareDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleShareChat} disabled={isSharing || !shareTitle.trim()}>
                {isSharing ? "Sharing..." : "Share"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AcademicPhraseBank;
