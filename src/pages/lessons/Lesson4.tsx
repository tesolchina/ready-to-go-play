import { Card } from "@/components/ui/card";
import { FileCheck } from "lucide-react";

const Lesson4 = () => {
  return (
    <div className="container max-w-4xl mx-auto p-6">
      <Card className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <FileCheck className="h-8 w-8 text-primary" />
          <h1 className="text-2xl md:text-3xl font-bold">Assessment Creation</h1>
        </div>
        
        <p className="text-lg text-muted-foreground mb-6">
          Coming soon! Master the art of creating effective assessments using AI.
        </p>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Topics will include:</h2>
          <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground">
            <li>Multiple-choice question generation</li>
            <li>Essay prompts and rubrics</li>
            <li>Project-based assessment design</li>
            <li>Formative vs. summative assessments</li>
            <li>Bloom's Taxonomy alignment</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default Lesson4;
