import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { secretCode } = await req.json();
    
    if (!secretCode) {
      return new Response(
        JSON.stringify({ valid: false, message: 'Secret code is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const platformSecretCode = Deno.env.get('PLATFORM_SECRET_CODE');
    
    if (!platformSecretCode) {
      console.error('PLATFORM_SECRET_CODE not configured');
      return new Response(
        JSON.stringify({ valid: false, message: 'Platform configuration error' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate the secret code
    const isValid = secretCode.trim() === platformSecretCode.trim();
    
    if (isValid) {
      // Generate a session token (simple timestamp-based token for demo)
      const sessionToken = btoa(`${Date.now()}-${crypto.randomUUID()}`);
      
      console.log('Secret code validated successfully');
      
      return new Response(
        JSON.stringify({ 
          valid: true, 
          message: 'Secret code accepted. You can now use platform API keys.',
          sessionToken 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    } else {
      console.log('Invalid secret code attempt');
      
      return new Response(
        JSON.stringify({ 
          valid: false, 
          message: 'Invalid secret code. Please try again.' 
        }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
  } catch (error) {
    console.error('Error validating secret code:', error);
    return new Response(
      JSON.stringify({ 
        valid: false, 
        message: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
