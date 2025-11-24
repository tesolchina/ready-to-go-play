import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

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
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const payload = await req.json();
    const emailData = payload.email_data || payload;

    const {
      user,
      token_hash,
      redirect_to,
      email_action_type,
    } = emailData;

    const resetLink = `${Deno.env.get('SUPABASE_URL')}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`;

    const emailContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Reset Your Password</h1>
          </div>
          
          <div style="background: #ffffff; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; margin-bottom: 20px;">Hello!</p>
            
            <p style="font-size: 16px; margin-bottom: 20px;">We received a request to reset your password for your Academic EAP Platform account.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block;">Reset Password</a>
            </div>
            
            <p style="font-size: 14px; color: #666; margin-top: 30px;">Or copy and paste this link into your browser:</p>
            <p style="font-size: 12px; color: #888; word-break: break-all; background: #f9fafb; padding: 10px; border-radius: 5px;">${resetLink}</p>
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="font-size: 13px; color: #dc2626; margin-bottom: 10px;"><strong>⚠️ Security Notice:</strong></p>
              <p style="font-size: 13px; color: #666;">This password reset link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.</p>
            </div>
            
            <p style="font-size: 13px; color: #888; margin-top: 30px;">If you're having trouble clicking the button, copy and paste the URL above into your web browser.</p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; padding: 20px; color: #888; font-size: 12px;">
            <p>Academic EAP Platform - Empowering Language Learning</p>
          </div>
        </body>
      </html>
    `;

    const result = await resend.sendEmail({
      from: "Academic EAP Platform <onboarding@resend.dev>",
      to: [user.email],
      subject: "Reset Your Password - Academic EAP Platform",
      html: emailContent,
    });

    if (result.error) {
      console.error("Error sending password reset email:", result.error);
      throw new Error(result.error.message);
    }

    console.log("Password reset email sent successfully to:", user.email);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-password-reset-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
