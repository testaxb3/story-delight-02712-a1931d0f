import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ADMIN_SECRET = 'nep-resend-sms-2025-secure';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify secret query parameter
    const url = new URL(req.url);
    const secret = url.searchParams.get('secret');
    if (secret !== ADMIN_SECRET) {
      console.log('[resend-welcome-sms] Unauthorized request - invalid secret');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { email, user_id } = await req.json();
    
    if (!email && !user_id) {
      return new Response(JSON.stringify({ error: 'email or user_id required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`[resend-welcome-sms] Looking up user: ${email || user_id}`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Find user in approved_users
    let query = supabase.from('approved_users').select('*');
    if (email) {
      query = query.eq('email', email);
    } else {
      query = query.eq('user_id', user_id);
    }
    
    const { data: user, error: userError } = await query.single();

    if (userError || !user) {
      console.log(`[resend-welcome-sms] User not found: ${userError?.message}`);
      return new Response(JSON.stringify({ error: 'User not found', details: userError?.message }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const phone = user.phone;
    const firstName = user.first_name || 'there';

    if (!phone) {
      console.log(`[resend-welcome-sms] No phone number for user: ${user.email}`);
      return new Response(JSON.stringify({ error: 'No phone number for this user' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Format phone to E.164
    let formattedPhone = phone.replace(/\D/g, '');
    if (!formattedPhone.startsWith('+')) {
      if (formattedPhone.length === 10) {
        formattedPhone = '+1' + formattedPhone; // US default
      } else if (formattedPhone.length === 11 && formattedPhone.startsWith('1')) {
        formattedPhone = '+' + formattedPhone;
      } else {
        formattedPhone = '+' + formattedPhone;
      }
    }

    console.log(`[resend-welcome-sms] Sending SMS to ${formattedPhone} for ${user.email}`);

    // Send SMS via Twilio
    const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const twilioPhone = Deno.env.get('TWILIO_PHONE_NUMBER');

    if (!twilioAccountSid || !twilioAuthToken || !twilioPhone) {
      console.error('[resend-welcome-sms] Twilio credentials missing');
      return new Response(JSON.stringify({ error: 'Twilio not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const twilioResponse = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(`${twilioAccountSid}:${twilioAuthToken}`),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: formattedPhone,
          From: twilioPhone,
          Body: `Hi ${firstName}! 🎉 Your NEP System access is ready. Start now: https://nepsystem.vercel.app`,
        }),
      }
    );

    const twilioResult = await twilioResponse.json();

    if (!twilioResponse.ok) {
      console.error(`[resend-welcome-sms] Twilio error:`, twilioResult);
      return new Response(JSON.stringify({ 
        error: 'SMS send failed', 
        twilio_error: twilioResult.message,
        code: twilioResult.code 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Update sms_sent flag
    await supabase
      .from('approved_users')
      .update({ sms_sent: true })
      .eq('id', user.id);

    console.log(`[resend-welcome-sms] SMS sent successfully to ${formattedPhone}, SID: ${twilioResult.sid}`);

    return new Response(JSON.stringify({ 
      success: true, 
      message: `SMS sent to ${formattedPhone}`,
      sid: twilioResult.sid,
      user_email: user.email
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('[resend-welcome-sms] Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
