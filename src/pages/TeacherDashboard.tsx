import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, UserPlus, Users, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Student {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
}

interface StudentProgress {
  student_id: string;
  student_name: string;
  total_exercises: number;
  correct_count: number;
  words_learned: number;
  last_activity: string;
}

const TeacherDashboard = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [studentProgress, setStudentProgress] = useState<StudentProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (user) {
      fetchStudents();
      fetchStudentProgress();
    }
  }, [user]);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('teacher_students')
        .select(`
          student_id,
          profiles!teacher_students_student_id_fkey(id, email, full_name, created_at)
        `)
        .eq('teacher_id', user?.id);

      if (error) throw error;

      const studentList = data?.map((item: any) => ({
        id: item.profiles.id,
        email: item.profiles.email,
        full_name: item.profiles.full_name,
        created_at: item.profiles.created_at,
      })) || [];

      setStudents(studentList);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentProgress = async () => {
    try {
      const { data: studentIds, error: studentsError } = await supabase
        .from('teacher_students')
        .select('student_id')
        .eq('teacher_id', user?.id);

      if (studentsError) throw studentsError;

      const progressData: StudentProgress[] = [];

      for (const { student_id } of studentIds || []) {
        const [exercisesResult, wordsResult, profileResult] = await Promise.all([
          supabase
            .from('vocabulary_exercises')
            .select('is_correct, created_at')
            .eq('user_id', student_id),
          supabase
            .from('word_progress')
            .select('id')
            .eq('user_id', student_id),
          supabase
            .from('profiles')
            .select('full_name')
            .eq('id', student_id)
            .single()
        ]);

        const exercises = exercisesResult.data || [];
        const correctCount = exercises.filter(e => e.is_correct).length;
        const lastActivity = exercises.length > 0
          ? new Date(Math.max(...exercises.map(e => new Date(e.created_at).getTime())))
          : null;

        progressData.push({
          student_id,
          student_name: profileResult.data?.full_name || 'Unknown',
          total_exercises: exercises.length,
          correct_count: correctCount,
          words_learned: wordsResult.data?.length || 0,
          last_activity: lastActivity ? lastActivity.toLocaleDateString() : 'Never',
        });
      }

      setStudentProgress(progressData);
    } catch (error) {
      console.error('Error fetching student progress:', error);
    }
  };

  const createStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-student-account', {
        body: {
          studentName,
          studentEmail,
          teacherId: user?.id,
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Student account created and email sent with login credentials.",
      });

      setStudentName("");
      setStudentEmail("");
      fetchStudents();
      fetchStudentProgress();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create student account.",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 bg-background">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 lg:hidden">
            <SidebarTrigger />
            <h2 className="text-lg font-semibold">Teacher Dashboard</h2>
          </header>
          <div className="container mx-auto p-8">
            <h1 className="text-4xl font-bold mb-8">Teacher Dashboard</h1>

            <Tabs defaultValue="students" className="space-y-6">
              <TabsList>
                <TabsTrigger value="students">
                  <Users className="h-4 w-4 mr-2" />
                  Students
                </TabsTrigger>
                <TabsTrigger value="progress">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Progress
                </TabsTrigger>
              </TabsList>

              <TabsContent value="students" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserPlus className="h-5 w-5" />
                      Add New Student
                    </CardTitle>
                    <CardDescription>
                      Create a student account and send them login credentials via email
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={createStudent} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="studentName">Student Name</Label>
                          <Input
                            id="studentName"
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                            placeholder="Enter student name"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="studentEmail">Student Email</Label>
                          <Input
                            id="studentEmail"
                            type="email"
                            value={studentEmail}
                            onChange={(e) => setStudentEmail(e.target.value)}
                            placeholder="Enter student email"
                            required
                          />
                        </div>
                      </div>
                      <Button type="submit" disabled={creating}>
                        {creating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Create Student Account
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>My Students</CardTitle>
                    <CardDescription>
                      Manage your student accounts
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {students.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">
                        No students yet. Add your first student above.
                      </p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Joined</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {students.map((student) => (
                            <TableRow key={student.id}>
                              <TableCell className="font-medium">
                                {student.full_name || 'N/A'}
                              </TableCell>
                              <TableCell>{student.email}</TableCell>
                              <TableCell>
                                {new Date(student.created_at).toLocaleDateString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="progress">
                <Card>
                  <CardHeader>
                    <CardTitle>Student Progress Overview</CardTitle>
                    <CardDescription>
                      Monitor your students' vocabulary learning progress
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {studentProgress.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">
                        No student activity yet.
                      </p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Student</TableHead>
                            <TableHead>Exercises</TableHead>
                            <TableHead>Accuracy</TableHead>
                            <TableHead>Words Learned</TableHead>
                            <TableHead>Last Activity</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {studentProgress.map((progress) => (
                            <TableRow key={progress.student_id}>
                              <TableCell className="font-medium">
                                {progress.student_name}
                              </TableCell>
                              <TableCell>{progress.total_exercises}</TableCell>
                              <TableCell>
                                {progress.total_exercises > 0
                                  ? `${Math.round((progress.correct_count / progress.total_exercises) * 100)}%`
                                  : 'N/A'}
                              </TableCell>
                              <TableCell>{progress.words_learned}</TableCell>
                              <TableCell>{progress.last_activity}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default TeacherDashboard;
