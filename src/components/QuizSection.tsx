import { useState } from "react";
import { Button } from "./ui/button";
import { Check, X } from "lucide-react";

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
}

interface QuizSectionProps {
  questions: Question[];
  onComplete: () => void;
}

export const QuizSection = ({ questions, onComplete }: QuizSectionProps) => {
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);

  const handleAnswer = (questionIndex: number, optionIndex: number) => {
    if (submitted) return;
    const newAnswers = [...answers];
    newAnswers[questionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    if (answers.some(a => a === null)) {
      alert("Please answer all questions before submitting!");
      return;
    }
    setSubmitted(true);
    
    const correctCount = answers.filter((answer, index) => answer === questions[index].correctIndex).length;
    if (correctCount === questions.length) {
      onComplete();
    }
  };

  const correctCount = submitted
    ? answers.filter((answer, index) => answer === questions[index].correctIndex).length
    : 0;

  return (
    <div className="space-y-6">
      {questions.map((q, qIndex) => (
        <div key={qIndex} className="bg-accent/50 rounded-xl p-6 border-2 border-border">
          <h4 className="font-semibold mb-4 text-foreground">
            Question {qIndex + 1}: {q.question}
          </h4>
          <div className="space-y-3">
            {q.options.map((option, oIndex) => {
              const isSelected = answers[qIndex] === oIndex;
              const isCorrect = q.correctIndex === oIndex;
              const showResult = submitted;

              return (
                <button
                  key={oIndex}
                  onClick={() => handleAnswer(qIndex, oIndex)}
                  disabled={submitted}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    showResult
                      ? isCorrect
                        ? "bg-success/10 border-success"
                        : isSelected
                        ? "bg-destructive/10 border-destructive"
                        : "bg-card border-border"
                      : isSelected
                      ? "bg-primary/10 border-primary"
                      : "bg-card border-border hover:border-primary hover:bg-accent"
                  } ${submitted ? "cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showResult && isCorrect && (
                      <Check className="h-5 w-5 text-success" />
                    )}
                    {showResult && isSelected && !isCorrect && (
                      <X className="h-5 w-5 text-destructive" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {!submitted ? (
        <Button
          onClick={handleSubmit}
          size="lg"
          className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
        >
          Submit Quiz
        </Button>
      ) : (
        <div className={`p-6 rounded-xl text-center ${
          correctCount === questions.length
            ? "bg-success/10 border-2 border-success"
            : "bg-warning/10 border-2 border-warning"
        }`}>
          <h3 className="text-2xl font-bold mb-2">
            {correctCount === questions.length ? "🎉 Perfect Score!" : "📊 Quiz Complete"}
          </h3>
          <p className="text-lg">
            You got {correctCount} out of {questions.length} questions correct!
          </p>
          {correctCount === questions.length && (
            <p className="mt-2 text-success-foreground font-semibold">
              Excellent work! You've mastered this section.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
