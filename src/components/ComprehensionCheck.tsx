import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { CheckCircle2, XCircle } from "lucide-react";

interface ComprehensionCheckProps {
  question: string;
  options: string[];
  correctAnswer: number;
}

export const ComprehensionCheck = ({ question, options, correctAnswer }: ComprehensionCheckProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      setHasAnswered(true);
    }
  };

  const handleReset = () => {
    setSelectedAnswer(null);
    setHasAnswered(false);
  };

  return (
    <Card className="p-6 bg-accent/10 border-2 border-primary/20">
      <h4 className="text-lg font-bold text-foreground mb-4">✓ Check Your Understanding</h4>
      <p className="text-foreground mb-4">{question}</p>
      
      <div className="space-y-3 mb-4">
        {options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = index === correctAnswer;
          const showResult = hasAnswered;
          
          return (
            <button
              key={index}
              onClick={() => !hasAnswered && setSelectedAnswer(index)}
              disabled={hasAnswered}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                !hasAnswered
                  ? isSelected
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50 bg-background"
                  : isCorrect
                  ? "border-green-500 bg-green-50 dark:bg-green-950"
                  : isSelected && !isCorrect
                  ? "border-red-500 bg-red-50 dark:bg-red-950"
                  : "border-border bg-background opacity-50"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
                </div>
                {showResult && isCorrect && (
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                )}
                {showResult && isSelected && !isCorrect && (
                  <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {!hasAnswered ? (
        <Button 
          onClick={handleSubmit} 
          disabled={selectedAnswer === null}
          className="w-full"
        >
          Submit Answer
        </Button>
      ) : (
        <div className="space-y-3">
          {selectedAnswer === correctAnswer ? (
            <div className="p-4 bg-green-50 dark:bg-green-950 border-2 border-green-500 rounded-lg">
              <p className="text-green-700 dark:text-green-300 font-semibold">
                ✓ Correct! Great job!
              </p>
            </div>
          ) : (
            <div className="p-4 bg-red-50 dark:bg-red-950 border-2 border-red-500 rounded-lg">
              <p className="text-red-700 dark:text-red-300 font-semibold">
                Not quite. The correct answer is {String.fromCharCode(65 + correctAnswer)}.
              </p>
            </div>
          )}
          <Button onClick={handleReset} variant="outline" className="w-full">
            Try Again
          </Button>
        </div>
      )}
    </Card>
  );
};
