import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.76.1";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const resendApiKey = Deno.env.get("RESEND_API_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CreateStudentRequest {
  studentName: string;
  studentEmail: string;
  teacherId: string;
}

interface ResendResponse {
  id?: string;
  error?: {
    message: string;
    name: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { studentName, studentEmail, teacherId }: CreateStudentRequest = await req.json();

    console.log("Creating student account:", { studentName, studentEmail, teacherId });

    // Validate inputs
    if (!studentName || !studentEmail || !teacherId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate a random password
    const password = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8).toUpperCase();

    console.log("Generated password for student");

    // Create the student account
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: studentEmail,
      password: password,
      email_confirm: true,
      user_metadata: {
        full_name: studentName,
      }
    });

    if (authError) {
      console.error("Error creating student account:", authError);
      return new Response(
        JSON.stringify({ error: authError.message }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Student account created successfully:", authData.user.id);

    // Ensure teacher has a profile (in case they signed up before profiles were set up)
    const { data: teacherProfile, error: teacherProfileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', teacherId)
      .single();

    if (teacherProfileError || !teacherProfile) {
      console.log("Teacher profile not found, creating one");
      const { data: teacherAuth } = await supabase.auth.admin.getUserById(teacherId);
      if (teacherAuth?.user) {
        await supabase.from('profiles').insert({
          id: teacherId,
          email: teacherAuth.user.email || '',
          full_name: teacherAuth.user.user_metadata?.full_name || ''
        });
      }
    }

    // Assign student role
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: authData.user.id,
        role: 'student'
      });

    if (roleError) {
      console.error("Error assigning student role:", roleError);
    } else {
      console.log("Student role assigned successfully");
    }

    // Create teacher-student relationship
    const { error: relationshipError } = await supabase
      .from('teacher_students')
      .insert({
        teacher_id: teacherId,
        student_id: authData.user.id
      });

    if (relationshipError) {
      console.error("Error creating teacher-student relationship:", relationshipError);
      return new Response(
        JSON.stringify({ error: relationshipError.message }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Teacher-student relationship created successfully");

    // Send welcome email with credentials using Resend API
    const emailHtml = `
      <h1>Welcome to Vocabulary Builder, ${studentName}!</h1>
      <p>Your teacher has created an account for you on the AI Learning Hub for EAP.</p>
      <p><strong>Your login credentials:</strong></p>
      <ul>
        <li><strong>Email:</strong> ${studentEmail}</li>
        <li><strong>Password:</strong> ${password}</li>
      </ul>
      <p>Please log in and change your password after your first login.</p>
      <p><a href="${window.location.origin}/auth">Click here to log in</a></p>
      <p>Best regards,<br>The AI Learning Hub Team</p>
    `;

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "AI Learning Hub <onboarding@resend.dev>",
        to: [studentEmail],
        subject: "Welcome to Vocabulary Builder!",
        html: emailHtml,
      }),
    });

    const resendData: ResendResponse = await resendResponse.json();

    if (resendData.error) {
      console.error("Error sending welcome email:", resendData.error);
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Student account created but email failed to send",
          studentId: authData.user.id,
          emailError: resendData.error.message
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Welcome email sent successfully:", resendData.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Student account created successfully",
        studentId: authData.user.id
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in create-student-account function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
