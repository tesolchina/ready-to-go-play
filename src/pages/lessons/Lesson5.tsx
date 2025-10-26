import { Card } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

const Lesson5 = () => {
  return (
    <div className="container max-w-4xl mx-auto p-6">
      <Card className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <Lightbulb className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Content Adaptation</h1>
        </div>
        
        <p className="text-lg text-muted-foreground mb-6">
          Coming soon! Learn to customize AI-generated content for diverse learners.
        </p>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Topics will include:</h2>
          <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground">
            <li>Differentiation for learning levels</li>
            <li>Cultural sensitivity and inclusion</li>
            <li>Accessibility considerations</li>
            <li>Language simplification strategies</li>
            <li>Multi-modal content creation</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default Lesson5;
