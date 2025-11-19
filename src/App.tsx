import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Index from "./pages/Index";
import About from "./pages/About";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Lessons from "./pages/Lessons";
import LearningApps from "./pages/LearningApps";
import Lesson1 from "./pages/lessons/Lesson1";
import Lesson6 from "./pages/lessons/Lesson6";
import DynamicLesson from "./pages/lessons/DynamicLesson";
import LessonCreator from "./pages/LessonCreator";
import AcademicPhraseBank from "./pages/AcademicPhraseBank";
import ValidateReferences from "./pages/ValidateReferences";
import SharedReport from "./pages/SharedReport";
import PDFManager from "./pages/PDFManager";
import PDFViewer from "./pages/PDFViewer";
import EmbedChat from "./pages/EmbedChat";
import PatternAnalyzer from "./pages/PatternAnalyzer";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/lessons" element={<Lessons />} />
          <Route path="/learning-apps" element={<LearningApps />} />
          <Route path="/SmartLessonBuilder" element={<Index />} />
          <Route path="/lesson/1" element={<Lesson1 />} />
          <Route path="/lesson/6" element={<Lesson6 />} />
          <Route path="/lesson/:slug" element={<DynamicLesson />} />
          <Route path="/lesson-creator" element={<LessonCreator />} />
          <Route path="/academic-phrasebank" element={<AcademicPhraseBank />} />
          <Route path="/validate-references" element={<ValidateReferences />} />
          <Route path="/report/:id" element={<SharedReport />} />
          <Route path="/pdf-manager" element={<PDFManager />} />
          <Route path="/pdf/:slug" element={<PDFViewer />} />
          <Route path="/embed/kimi_AI_nature.html" element={<EmbedChat />} />
          <Route path="/pattern-analyzer" element={<PatternAnalyzer />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
