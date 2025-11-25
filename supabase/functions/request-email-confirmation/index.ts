import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { email, userId, fullName } = await req.json();

    if (!email || !userId) {
      return new Response(
        JSON.stringify({ error: "Email and userId are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Processing email confirmation request for: ${email}`);

    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if user already confirmed
    const { data: profile } = await supabase
      .from("profiles")
      .select("email_confirmed")
      .eq("id", userId)
      .single();

    if (profile?.email_confirmed) {
      return new Response(
        JSON.stringify({ error: "Email already confirmed" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Delete any existing tokens for this user
    await supabase
      .from("email_confirmation_tokens")
      .delete()
      .eq("user_id", userId);

    // Generate a secure token
    const token = `${crypto.randomUUID()}-${crypto.randomUUID()}`;
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Store the token
    const { error: insertError } = await supabase
      .from("email_confirmation_tokens")
      .insert({
        user_id: userId,
        token: token,
        expires_at: expiresAt.toISOString(),
      });

    if (insertError) {
      console.error("Error storing token:", insertError);
      throw new Error("Failed to create confirmation token");
    }

    // Build confirmation link
    const baseUrl = Deno.env.get("SITE_URL") || "https://eapteacher.smartutor.me";
    const confirmLink = `${baseUrl}/auth?confirm=true#token=${token}`;

    // Send email
    const emailContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Confirm Your Email</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Academic EAP Platform!</h1>
          </div>
          
          <div style="background: #ffffff; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; margin-bottom: 20px;">Hello${fullName ? ` ${fullName}` : ''}!</p>
            
            <p style="font-size: 16px; margin-bottom: 20px;">Thank you for registering. Please confirm your email to access all features:</p>
            
            <ul style="font-size: 14px; line-height: 1.8; margin-bottom: 30px; color: #555;">
              <li>Access to all blog posts and resources</li>
              <li>Save your chat history across all AI tools</li>
              <li>Store your API keys securely</li>
              <li>Create and manage courses</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${confirmLink}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block;">Confirm Email Address</a>
            </div>
            
            <p style="font-size: 14px; color: #666; margin-top: 30px;">Or copy and paste this link into your browser:</p>
            <p style="font-size: 12px; color: #888; word-break: break-all; background: #f9fafb; padding: 10px; border-radius: 5px;">${confirmLink}</p>
            
            <p style="font-size: 13px; color: #666; margin-top: 20px;"><strong>Note:</strong> This link will expire in 24 hours.</p>
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="font-size: 13px; color: #dc2626; margin-bottom: 10px;"><strong>⚠️ Important Notice:</strong></p>
              <p style="font-size: 13px; color: #666;">We only accept institutional email addresses (e.g., university or college domains). Accounts registered with personal email addresses may be removed without further notice.</p>
            </div>
            
            <p style="font-size: 13px; color: #888; margin-top: 30px;">If you didn't create this account, you can safely ignore this email.</p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; padding: 20px; color: #888; font-size: 12px;">
            <p>Academic EAP Platform - Empowering Language Learning</p>
          </div>
        </body>
      </html>
    `;

    const result = await resend.sendEmail({
      from: "Academic EAP Platform <noreply@eapteacher.smartutor.me>",
      to: [email],
      subject: "Confirm Your Email - Academic EAP Platform",
      html: emailContent,
    });

    if (result.error) {
      console.error("Error sending email:", result.error);
      throw new Error(result.error.message);
    }

    console.log("Confirmation email sent successfully to:", email);

    return new Response(
      JSON.stringify({ success: true, message: "Confirmation email sent" }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("Error in request-email-confirmation:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});