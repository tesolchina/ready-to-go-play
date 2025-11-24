-- Create student-teacher relationships table
CREATE TABLE public.teacher_students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(teacher_id, student_id)
);

-- Create vocabulary sessions table (stores essays/texts)
CREATE TABLE public.vocabulary_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT,
  text_content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create vocabulary exercises table (stores question attempts)
CREATE TABLE public.vocabulary_exercises (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.vocabulary_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  word TEXT NOT NULL,
  word_family TEXT[],
  question_type TEXT NOT NULL,
  question TEXT NOT NULL,
  user_answer TEXT,
  correct_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  difficulty TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create word progress tracking table
CREATE TABLE public.word_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  word TEXT NOT NULL,
  correct_count INTEGER NOT NULL DEFAULT 0,
  incorrect_count INTEGER NOT NULL DEFAULT 0,
  last_practiced TIMESTAMP WITH TIME ZONE DEFAULT now(),
  mastery_level TEXT DEFAULT 'beginner',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, word)
);

-- Enable RLS
ALTER TABLE public.teacher_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocabulary_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocabulary_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.word_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for teacher_students
CREATE POLICY "Teachers can manage their students"
ON public.teacher_students
FOR ALL
USING (auth.uid() = teacher_id)
WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Students can view their teachers"
ON public.teacher_students
FOR SELECT
USING (auth.uid() = student_id);

-- RLS Policies for vocabulary_sessions
CREATE POLICY "Users can manage their own sessions"
ON public.vocabulary_sessions
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Teachers can view student sessions"
ON public.vocabulary_sessions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.teacher_students
    WHERE teacher_id = auth.uid() AND student_id = vocabulary_sessions.user_id
  )
);

-- RLS Policies for vocabulary_exercises
CREATE POLICY "Users can manage their own exercises"
ON public.vocabulary_exercises
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Teachers can view student exercises"
ON public.vocabulary_exercises
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.teacher_students
    WHERE teacher_id = auth.uid() AND student_id = vocabulary_exercises.user_id
  )
);

-- RLS Policies for word_progress
CREATE POLICY "Users can manage their own progress"
ON public.word_progress
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Teachers can view student progress"
ON public.word_progress
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.teacher_students
    WHERE teacher_id = auth.uid() AND student_id = word_progress.user_id
  )
);

-- Trigger for updating vocabulary_sessions updated_at
CREATE TRIGGER update_vocabulary_sessions_updated_at
BEFORE UPDATE ON public.vocabulary_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for updating word_progress updated_at
CREATE TRIGGER update_word_progress_updated_at
BEFORE UPDATE ON public.word_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();