import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

interface ResendResponse {
  id?: string;
  error?: {
    message: string;
    name: string;
  };
}

const resend = {
  sendEmail: async (options: {
    from: string;
    to: string[];
    subject: string;
    html: string;
  }): Promise<ResendResponse> => {
    const apiKey = Deno.env.get("RESEND_API_KEY");
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(options),
    });

    return await response.json();
  }
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestPasswordResetBody {
  email: string;
  redirectUrl: string;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, redirectUrl }: RequestPasswordResetBody = await req.json();

    if (!email) {
      throw new Error('Email is required');
    }

    console.log('Password reset requested for:', email);

    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if user exists
    const { data: users, error: userError } = await supabase.auth.admin.listUsers();
    
    if (userError) {
      console.error('Error fetching users:', userError);
      throw new Error('Failed to process request');
    }

    const user = users.users.find(u => u.email === email);

    if (!user) {
      // Don't reveal if user exists or not for security
      console.log('User not found, but returning success');
      return new Response(
        JSON.stringify({ success: true, message: 'If an account exists, a reset email will be sent' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('User found:', user.id);

    // Generate a secure random token
    const token = crypto.randomUUID() + '-' + crypto.randomUUID();
    
    // Token expires in 1 hour
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    // Store token in database
    const { error: insertError } = await supabase
      .from('password_reset_tokens')
      .insert({
        user_id: user.id,
        token,
        expires_at: expiresAt.toISOString(),
      });

    if (insertError) {
      console.error('Error storing token:', insertError);
      throw new Error('Failed to generate reset token');
    }

    console.log('Token stored successfully');

    // Send email using Resend
    const resetLink = `${redirectUrl}#token=${token}`;
    
    // TODO: Update the 'from' address to use your verified domain (e.g., 'noreply@yourdomain.com')
    // Currently using test domain which only sends to account owner email
    const emailResponse = await resend.sendEmail({
      from: 'Academic EAP Platform <onboarding@resend.dev>',
      to: [email],
      subject: 'Reset Your Password',
      html: `
        <h1>Password Reset Request</h1>
        <p>You requested to reset your password. Click the link below to set a new password:</p>
        <p><a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px;">Reset Password</a></p>
        <p>Or copy and paste this link into your browser:</p>
        <p>${resetLink}</p>
        <p><strong>Important:</strong> This link will work even if your email client scans it. You can click it multiple times if needed.</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });

    if (emailResponse.error) {
      console.error('Resend API error:', emailResponse.error);
      throw new Error(`Failed to send email: ${emailResponse.error.message}`);
    }

    console.log('Email sent successfully:', emailResponse);

    return new Response(
      JSON.stringify({ success: true, message: 'Password reset email sent' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error in request-password-reset:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
