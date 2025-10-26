import { useState } from "react";
import { Button } from "./ui/button";
import { Check, X } from "lucide-react";

interface ComprehensionCheckProps {
  question: string;
  options: { text: string; correct: boolean }[];
  onComplete: () => void;
}

export const ComprehensionCheck = ({ question, options, onComplete }: ComprehensionCheckProps) => {
  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  const handleAnswer = (index: number) => {
    if (answered) return;
    
    setSelected(index);
    setAnswered(true);
    
    if (options[index].correct) {
      setTimeout(() => {
        onComplete();
      }, 1500);
    }
  };

  return (
    <div className="my-8">
      {!show ? (
        <Button
          onClick={() => setShow(true)}
          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          size="lg"
        >
          <Check className="mr-2 h-5 w-5" />
          Check Your Understanding
        </Button>
      ) : (
        <div className="bg-accent/50 rounded-xl p-6 border-2 border-primary/20">
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="text-2xl">📝</span>
            Quick Comprehension Check
          </h4>
          <p className="font-medium mb-4 text-foreground">{question}</p>
          <div className="space-y-3">
            {options.map((option, index) => {
              const isSelected = selected === index;
              const isCorrect = option.correct;
              const showResult = answered && isSelected;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={answered}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-300 ${
                    showResult
                      ? isCorrect
                        ? "bg-success/10 border-success text-success-foreground"
                        : "bg-destructive/10 border-destructive text-destructive-foreground"
                      : "bg-card border-border hover:border-primary hover:bg-accent"
                  } ${answered ? "cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option.text}</span>
                    {showResult && (
                      isCorrect ? (
                        <Check className="h-5 w-5 text-success" />
                      ) : (
                        <X className="h-5 w-5 text-destructive" />
                      )
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          {answered && (
            <div className={`mt-4 p-4 rounded-lg ${
              options[selected!].correct 
                ? "bg-success/10 text-success-foreground" 
                : "bg-destructive/10 text-destructive-foreground"
            }`}>
              {options[selected!].correct ? (
                <p className="font-semibold">✅ Correct! Well done!</p>
              ) : (
                <p className="font-semibold">❌ Not quite. Try reviewing the material above.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
