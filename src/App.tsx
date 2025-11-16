import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Lesson1 from "./pages/lessons/Lesson1";
import Lesson6 from "./pages/lessons/Lesson6";
import DynamicLesson from "./pages/lessons/DynamicLesson";
import LessonCreator from "./pages/LessonCreator";
import AcademicPhraseBank from "./pages/AcademicPhraseBank";
import ValidateReferences from "./pages/ValidateReferences";
import SharedReport from "./pages/SharedReport";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/lesson/1" element={<Lesson1 />} />
          <Route path="/lesson/6" element={<Lesson6 />} />
          <Route path="/lesson/:slug" element={<DynamicLesson />} />
          <Route path="/lesson-creator" element={<LessonCreator />} />
          <Route path="/academic-phrasebank" element={<AcademicPhraseBank />} />
          <Route path="/validate-references" element={<ValidateReferences />} />
          <Route path="/report/:id" element={<SharedReport />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
