import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Auth from "./pages/Auth";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Lessons from "./pages/Lessons";
import LearningApps from "./pages/LearningApps";
import Lesson1 from "./pages/lessons/Lesson1";
import Lesson6 from "./pages/lessons/Lesson6";
import DynamicLesson from "./pages/lessons/DynamicLesson";
import InteractiveLearningReflection from "./pages/lessons/InteractiveLearningReflection";
import LeverageEducationalResources from "./pages/lessons/LeverageEducationalResources";
import VibeCoding from "./pages/lessons/VibeCoding";
import AIAgents from "./pages/lessons/AIAgents";
import LessonCreator from "./pages/LessonCreator";
import AcademicPhraseBank from "./pages/AcademicPhraseBank";
import CustomPhrasebankChat from "./pages/CustomPhrasebankChat";
import PhrasebankExercises from "./pages/PhrasebankExercises";
import ValidateReferences from "./pages/ValidateReferences";
import SharedReport from "./pages/SharedReport";
import PDFManager from "./pages/PDFManager";
import PDFViewer from "./pages/PDFViewer";
import EmbedChat from "./pages/EmbedChat";
import PatternAnalyzer from "./pages/PatternAnalyzer";
import WileyAIGuidelines from "./pages/WileyAIGuidelines";
import VocabularyBuilder from "./pages/VocabularyBuilder";
import TeacherDashboard from "./pages/TeacherDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<About />} />
          <Route path="/about" element={<About />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/lessons" element={<Lessons />} />
          <Route path="/lessons/interactive-learning-reflection" element={<InteractiveLearningReflection />} />
          <Route path="/lessons/leverage-educational-resources" element={<LeverageEducationalResources />} />
          <Route path="/lessons/vibe-coding" element={<VibeCoding />} />
          <Route path="/lessons/ai-agents" element={<AIAgents />} />
          <Route path="/learning-apps" element={<LearningApps />} />
          <Route path="/SmartLessonBuilder" element={<Index />} />
          <Route path="/lesson/1" element={<Lesson1 />} />
          <Route path="/lesson/6" element={<Lesson6 />} />
          <Route path="/lesson/:slug" element={<DynamicLesson />} />
          <Route path="/lesson-creator" element={<LessonCreator />} />
          <Route path="/academic-phrasebank" element={<AcademicPhraseBank />} />
          <Route path="/academic-phrasebank/exercises" element={<PhrasebankExercises />} />
          <Route path="/academic-phrasebank/custom" element={<CustomPhrasebankChat />} />
          <Route path="/validate-references" element={<ValidateReferences />} />
          <Route path="/report/:id" element={<SharedReport />} />
          <Route path="/pdf-manager" element={<PDFManager />} />
          <Route path="/pdf/:slug" element={<PDFViewer />} />
          <Route path="/embed/kimi_AI_nature.html" element={<EmbedChat />} />
          <Route path="/pattern-analyzer" element={<PatternAnalyzer />} />
          <Route path="/wiley-ai-guidelines" element={<WileyAIGuidelines />} />
          <Route path="/vocabulary-builder" element={<VocabularyBuilder />} />
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
