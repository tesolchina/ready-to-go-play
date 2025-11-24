import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, BookOpen, Brain, Target } from "lucide-react";

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

const VocabularyBuilder = () => {
  const [text, setText] = useState("");
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
  const { toast } = useToast();

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

  const checkAnswer = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const correct = userAnswer.trim().toLowerCase() === currentQuestion.correctAnswer.toLowerCase();
    
    setIsCorrect(correct);
    setShowExplanation(true);
    
    if (correct) {
      setScore(score + 1);
      
      // Adaptive difficulty: increase after 2 consecutive correct answers
      if ((score + 1) % 2 === 0 && difficulty !== "hard") {
        const newDifficulty = difficulty === "easy" ? "medium" : "hard";
        setDifficulty(newDifficulty);
        toast({
          title: "Level Up!",
          description: `Moving to ${newDifficulty} difficulty.`,
        });
      }
    } else if (difficulty !== "easy") {
      // Decrease difficulty on incorrect answer
      const newDifficulty = difficulty === "hard" ? "medium" : "easy";
      setDifficulty(newDifficulty);
    }
    
    setAnsweredQuestions(answeredQuestions + 1);
    setPreviousWords([...previousWords, currentQuestion.word]);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer("");
      setShowExplanation(false);
      setIsCorrect(null);
    } else {
      // Generate new set of questions
      generateQuestions();
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = answeredQuestions > 0 ? (score / answeredQuestions) * 100 : 0;

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Vocabulary Builder
            </h1>
            <p className="text-muted-foreground">
              Adaptive vocabulary learning from your own texts
            </p>
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
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 p-8">
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
  );
};

export default VocabularyBuilder;
