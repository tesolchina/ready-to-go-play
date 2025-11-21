import { Card } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

const Lesson2 = () => {
  return (
    <div className="container max-w-4xl mx-auto p-6">
      <Card className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="h-8 w-8 text-primary" />
          <h1 className="text-2xl md:text-3xl font-bold">Advanced Prompting Techniques</h1>
        </div>
        
        <p className="text-lg text-muted-foreground mb-6">
          Coming soon! This lesson will cover advanced strategies for creating sophisticated AI prompts.
        </p>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Topics will include:</h2>
          <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground">
            <li>Chain-of-thought prompting</li>
            <li>Few-shot learning techniques</li>
            <li>Prompt chaining for complex tasks</li>
            <li>Role-based prompting strategies</li>
            <li>Error handling and refinement</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default Lesson2;
