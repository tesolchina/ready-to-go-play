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
      token,
      token_hash,
      redirect_to,
      email_action_type,
    } = emailData;

    const confirmLink = `${Deno.env.get('SUPABASE_URL')}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`;

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
            <p style="font-size: 16px; margin-bottom: 20px;">Hello!</p>
            
            <p style="font-size: 16px; margin-bottom: 20px;">Thank you for registering with your institutional email address. Please confirm your email to access all features including:</p>
            
            <ul style="font-size: 14px; line-height: 1.8; margin-bottom: 30px; color: #555;">
              <li>Access to all blog posts and resources</li>
              <li>Save your chat history across all AI tools</li>
              <li>Store your API keys securely</li>
              <li>Create and manage courses (coming soon)</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${confirmLink}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block;">Confirm Email Address</a>
            </div>
            
            <p style="font-size: 14px; color: #666; margin-top: 30px;">Or copy and paste this link into your browser:</p>
            <p style="font-size: 12px; color: #888; word-break: break-all; background: #f9fafb; padding: 10px; border-radius: 5px;">${confirmLink}</p>
            
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
      to: [user.email],
      subject: "Confirm Your Email - Academic EAP Platform",
      html: emailContent,
    });

    if (result.error) {
      console.error("Error sending email:", result.error);
      throw new Error(result.error.message);
    }

    console.log("Confirmation email sent successfully to:", user.email);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-confirmation-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});