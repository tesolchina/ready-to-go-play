import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Send, BookOpen, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import phrasebankData from "@/lib/phrasebank-data.json";

interface Message {
  role: "user" | "assistant";
  content: string;
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

const AcademicPhraseBank = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [categoryType, setCategoryType] = useState<"moves" | "general" | "">("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("__all__");
  const [discipline, setDiscipline] = useState<string>("__none__");
  const [customDiscipline, setCustomDiscipline] = useState<string>("");
  const [showDropdowns, setShowDropdowns] = useState(true);
  const [selectedModel, setSelectedModel] = useState<string>("kimi");
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="h-[calc(100vh-12rem)]">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-6 w-6" />
                Academic PhraseBank Assistant
              </CardTitle>
              <div className="w-36">
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Model" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    <SelectItem value="kimi">Kimi</SelectItem>
                    <SelectItem value="aliyun">Aliyun</SelectItem>
                    <SelectItem value="spark">Spark</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <CardDescription>
              Get help with academic writing phrases, sentence structures, and language patterns
            </CardDescription>
            <p className="text-xs text-muted-foreground mt-2">
              Inspired by the{" "}
              <a 
                href="https://www.phrasebank.manchester.ac.uk/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="underline hover:text-foreground transition-colors"
              >
                Manchester Academic Phrasebank
              </a>
            </p>
          </CardHeader>
          <CardContent className="flex flex-col h-[calc(100%-5rem)]">
            {/* Dropdown Selection Section */}
            {showDropdowns && messages.length === 0 && (
              <div className="mb-6 p-4 bg-muted/50 rounded-lg space-y-4">
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
      </div>
    </div>
  );
};

export default AcademicPhraseBank;
