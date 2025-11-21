import { Card } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";

const Lesson3 = () => {
  return (
    <div className="container max-w-4xl mx-auto p-6">
      <Card className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <GraduationCap className="h-8 w-8 text-primary" />
          <h1 className="text-2xl md:text-3xl font-bold">Subject-Specific Strategies</h1>
        </div>
        
        <p className="text-lg text-muted-foreground mb-6">
          Coming soon! Learn how to adapt prompting techniques for different academic disciplines.
        </p>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Topics will include:</h2>
          <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground">
            <li>STEM-specific prompting approaches</li>
            <li>Humanities and social sciences strategies</li>
            <li>Language learning applications</li>
            <li>Creative arts and design prompts</li>
            <li>Professional and technical education</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default Lesson3;
