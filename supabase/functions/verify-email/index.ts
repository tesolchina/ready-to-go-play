import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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
    const { token } = await req.json();

    if (!token) {
      return new Response(
        JSON.stringify({ error: "Token is required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Processing email verification for token");

    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Find the token
    const { data: tokenData, error: tokenError } = await supabase
      .from("email_confirmation_tokens")
      .select("*")
      .eq("token", token)
      .single();

    if (tokenError || !tokenData) {
      console.error("Token not found:", tokenError);
      return new Response(
        JSON.stringify({ error: "Invalid or expired token" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Check if token is expired
    if (new Date(tokenData.expires_at) < new Date()) {
      console.error("Token expired");
      return new Response(
        JSON.stringify({ error: "Token has expired. Please request a new confirmation email." }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Check if token was already used
    if (tokenData.used_at) {
      // Token was used but email might already be confirmed - check profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("email_confirmed")
        .eq("id", tokenData.user_id)
        .single();

      if (profile?.email_confirmed) {
        return new Response(
          JSON.stringify({ success: true, message: "Email already confirmed", alreadyConfirmed: true }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
    }

    // Update the profile to mark email as confirmed
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ email_confirmed: true })
      .eq("id", tokenData.user_id);

    if (updateError) {
      console.error("Error updating profile:", updateError);
      throw new Error("Failed to confirm email");
    }

    // Mark token as used
    await supabase
      .from("email_confirmation_tokens")
      .update({ used_at: new Date().toISOString() })
      .eq("id", tokenData.id);

    // Also confirm the user in Supabase Auth (if not already)
    await supabase.auth.admin.updateUserById(tokenData.user_id, {
      email_confirm: true
    });

    console.log("Email confirmed successfully for user:", tokenData.user_id);

    return new Response(
      JSON.stringify({ success: true, message: "Email confirmed successfully" }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("Error in verify-email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});