import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
            Welcome to Smart Lesson Builder
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            An AI-powered platform for educators to create engaging lessons, validate academic references, and enhance their teaching materials.
          </p>
          <Link to="/SmartLessonBuilder">
            <Button size="lg" className="gap-2">
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
