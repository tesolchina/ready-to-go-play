import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, BookOpen, Brain, Target, Save, History } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Question {
  type: "multiple_choice" | "fill_blank" | "short_answer";
  word: string;
  wordFamily: string[];
  question: string;
  options?: string[];
  correctAnswer: string;
  difficulty: "easy" | "medium" | "hard";
  explanation: string;
}

interface SavedSession {
  id: string;
  title: string;
  text_content: string;
  last_accessed: string;
}

const VocabularyBuilder = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [text, setText] = useState("");
  const [sessionTitle, setSessionTitle] = useState("");
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [savedSessions, setSavedSessions] = useState<SavedSession[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [previousWords, setPreviousWords] = useState<string[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (user) {
      fetchSavedSessions();
    }
  }, [user]);

  const fetchSavedSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('vocabulary_sessions')
        .select('*')
        .eq('user_id', user?.id)
        .order('last_accessed', { ascending: false });

      if (error) throw error;
      setSavedSessions(data || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const saveSession = async () => {
    if (!text.trim() || !sessionTitle.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both a title and text content.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (currentSessionId) {
        const { error } = await supabase
          .from('vocabulary_sessions')
          .update({ 
            title: sessionTitle,
            text_content: text,
            last_accessed: new Date().toISOString()
          })
          .eq('id', currentSessionId);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('vocabulary_sessions')
          .insert({
            user_id: user?.id,
            title: sessionTitle,
            text_content: text,
          })
          .select()
          .single();

        if (error) throw error;
        setCurrentSessionId(data.id);
      }

      toast({
        title: "Success",
        description: "Session saved successfully!",
      });
      setShowSaveDialog(false);
      fetchSavedSessions();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const loadSession = async (session: SavedSession) => {
    setText(session.text_content);
    setSessionTitle(session.title);
    setCurrentSessionId(session.id);
    setShowHistoryDialog(false);

    await supabase
      .from('vocabulary_sessions')
      .update({ last_accessed: new Date().toISOString() })
      .eq('id', session.id);

    toast({
      title: "Session Loaded",
      description: `Loaded: ${session.title}`,
    });
  };

  const saveExerciseResult = async (question: Question, correct: boolean) => {
    if (!currentSessionId) return;

    try {
      await supabase.from('vocabulary_exercises').insert({
        session_id: currentSessionId,
        user_id: user?.id,
        word: question.word,
        word_family: question.wordFamily,
        question_type: question.type,
        question: question.question,
        user_answer: userAnswer,
        correct_answer: question.correctAnswer,
        is_correct: correct,
        difficulty: question.difficulty,
      });

      const { data: existingProgress } = await supabase
        .from('word_progress')
        .select('*')
        .eq('user_id', user?.id)
        .eq('word', question.word)
        .single();

      if (existingProgress) {
        await supabase
          .from('word_progress')
          .update({
            correct_count: existingProgress.correct_count + (correct ? 1 : 0),
            incorrect_count: existingProgress.incorrect_count + (correct ? 0 : 1),
            last_practiced: new Date().toISOString(),
            mastery_level: calculateMasteryLevel(
              existingProgress.correct_count + (correct ? 1 : 0),
              existingProgress.incorrect_count + (correct ? 0 : 1)
            ),
          })
          .eq('id', existingProgress.id);
      } else {
        await supabase.from('word_progress').insert({
          user_id: user?.id,
          word: question.word,
          correct_count: correct ? 1 : 0,
          incorrect_count: correct ? 0 : 1,
          mastery_level: correct ? 'beginner' : 'learning',
        });
      }
    } catch (error) {
      console.error('Error saving exercise result:', error);
    }
  };

  const calculateMasteryLevel = (correct: number, incorrect: number): string => {
    const total = correct + incorrect;
    if (total === 0) return 'beginner';
    const accuracy = correct / total;
    if (accuracy >= 0.9 && correct >= 5) return 'mastered';
    if (accuracy >= 0.7 && correct >= 3) return 'proficient';
    if (accuracy >= 0.5) return 'learning';
    return 'beginner';
  };

  const generateQuestions = async () => {
    if (!text.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter some text to generate questions from.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-vocabulary-questions', {
        body: { text, difficulty, previousWords }
      });

      if (error) throw error;

      setQuestions(data.questions);
      setCurrentQuestionIndex(0);
      setShowExplanation(false);
      setIsCorrect(null);
      setUserAnswer("");
    } catch (error) {
      console.error('Error generating questions:', error);
      toast({
        title: "Error",
        description: "Failed to generate questions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const checkAnswer = async () => {
    const currentQuestion = questions[currentQuestionIndex];
    const correct = userAnswer.trim().toLowerCase() === currentQuestion.correctAnswer.toLowerCase();
    
    setIsCorrect(correct);
    setShowExplanation(true);
    
    if (correct) {
      setScore(score + 1);
      
      if ((score + 1) % 2 === 0 && difficulty !== "hard") {
        const newDifficulty = difficulty === "easy" ? "medium" : "hard";
        setDifficulty(newDifficulty);
        toast({
          title: "Level Up!",
          description: `Moving to ${newDifficulty} difficulty.`,
        });
      }
    } else if (difficulty !== "easy") {
      const newDifficulty = difficulty === "hard" ? "medium" : "easy";
      setDifficulty(newDifficulty);
    }
    
    setAnsweredQuestions(answeredQuestions + 1);
    setPreviousWords([...previousWords, currentQuestion.word]);
    
    await saveExerciseResult(currentQuestion, correct);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer("");
      setShowExplanation(false);
      setIsCorrect(null);
    } else {
      generateQuestions();
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = answeredQuestions > 0 ? (score / answeredQuestions) * 100 : 0;

  if (questions.length === 0) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex-1 bg-background">
            <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 lg:hidden">
              <SidebarTrigger />
              <h2 className="text-lg font-semibold">Vocabulary Builder</h2>
            </header>
            <div className="p-8">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Vocabulary Builder
                  </h1>
                  <p className="text-muted-foreground">
                    Adaptive vocabulary learning from your own texts
                  </p>
                </div>

                <div className="flex gap-2 mb-6">
                  <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Save className="h-4 w-4 mr-2" />
                        Save Session
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Save Session</DialogTitle>
                        <DialogDescription>
                          Give your session a title to save it for later.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Session Title</Label>
                          <Input
                            id="title"
                            value={sessionTitle}
                            onChange={(e) => setSessionTitle(e.target.value)}
                            placeholder="e.g., Chapter 3 Vocabulary"
                          />
                        </div>
                        <Button onClick={saveSession} className="w-full">
                          Save
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <History className="h-4 w-4 mr-2" />
                        Load Session
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Saved Sessions</DialogTitle>
                        <DialogDescription>
                          Continue from where you left off.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {savedSessions.length === 0 ? (
                          <p className="text-muted-foreground text-center py-8">
                            No saved sessions yet.
                          </p>
                        ) : (
                          savedSessions.map((session) => (
                            <Button
                              key={session.id}
                              variant="ghost"
                              className="w-full justify-start"
                              onClick={() => loadSession(session)}
                            >
                              <div className="text-left">
                                <div className="font-medium">{session.title}</div>
                                <div className="text-xs text-muted-foreground">
                                  Last accessed: {new Date(session.last_accessed).toLocaleDateString()}
                                </div>
                              </div>
                            </Button>
                          ))
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Enter Your Text
                    </CardTitle>
                    <CardDescription>
                      Paste an essay, article, or paragraph to generate vocabulary questions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      placeholder="Paste your text here..."
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      className="min-h-[200px]"
                    />
                    <Button 
                      onClick={generateQuestions} 
                      disabled={isGenerating}
                      className="w-full"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating Questions...
                        </>
                      ) : (
                        <>
                          <Brain className="mr-2 h-4 w-4" />
                          Generate Questions
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 bg-background">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 lg:hidden">
            <SidebarTrigger />
            <h2 className="text-lg font-semibold">Vocabulary Practice</h2>
          </header>
          <div className="p-8">
            <div className="max-w-4xl mx-auto">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold">Vocabulary Practice</h1>
                  <p className="text-muted-foreground">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant={difficulty === "easy" ? "secondary" : difficulty === "medium" ? "default" : "destructive"}>
                    {difficulty.toUpperCase()}
                  </Badge>
                  <div className="text-sm text-muted-foreground mt-1">
                    Score: {score}/{answeredQuestions}
                  </div>
                </div>
              </div>

              <Progress value={progressPercentage} className="mb-6" />

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    {currentQuestion.type === "multiple_choice" ? "Multiple Choice" :
                     currentQuestion.type === "fill_blank" ? "Fill in the Blank" :
                     "Short Answer"}
                  </CardTitle>
                  <div className="flex gap-2 mt-2">
                    {currentQuestion.wordFamily.map((word) => (
                      <Badge key={word} variant="outline">{word}</Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-lg">{currentQuestion.question}</p>

                  {currentQuestion.type === "multiple_choice" && currentQuestion.options && (
                    <div className="grid gap-2">
                      {currentQuestion.options.map((option) => (
                        <Button
                          key={option}
                          variant={userAnswer === option ? "default" : "outline"}
                          onClick={() => setUserAnswer(option)}
                          disabled={showExplanation}
                          className="justify-start text-left h-auto py-3"
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  )}

                  {(currentQuestion.type === "fill_blank" || currentQuestion.type === "short_answer") && (
                    <Input
                      placeholder="Type your answer..."
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      disabled={showExplanation}
                    />
                  )}

                  {!showExplanation && (
                    <Button onClick={checkAnswer} disabled={!userAnswer} className="w-full">
                      Check Answer
                    </Button>
                  )}

                  {showExplanation && (
                    <div className="space-y-4">
                      <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50 dark:bg-green-950' : 'bg-red-50 dark:bg-red-950'}`}>
                        <p className="font-semibold mb-2">
                          {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
                        </p>
                        <p className="text-sm">
                          <strong>Correct Answer:</strong> {currentQuestion.correctAnswer}
                        </p>
                        <p className="text-sm mt-2">{currentQuestion.explanation}</p>
                      </div>

                      <Button onClick={nextQuestion} className="w-full">
                        {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Generate New Questions'}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default VocabularyBuilder;
