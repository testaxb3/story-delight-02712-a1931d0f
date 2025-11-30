import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Cartpanda sends nested order structure
interface CartpandaPayload {
  event?: string;
  order?: {
    id?: string;
    email?: string;
    status?: string;
    total_price?: string;
    currency?: string;
    customer?: {
      first_name?: string;
      last_name?: string;
      email?: string;
      phone?: string;
    };
    billing_address?: {
      phone?: string;
    };
    shipping_address?: {
      phone?: string;
    };
    line_items?: Array<{
      product_id?: string;
      name?: string;
    }>;
  };
  // Fallback flat structure (some webhooks may use this)
  email?: string;
  order_id?: string;
  product_id?: string;
  product_name?: string;
  total_price?: string;
  currency?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
}

// Format phone to E.164 format for OneSignal/Twilio
function formatPhoneE164(phone: string | undefined | null): string | null {
  if (!phone) return null;
  
  // Remove all non-digit characters
  let digits = phone.replace(/\D/g, '');
  
  if (digits.length < 10) return null;
  
  // If starts with 0, remove it
  if (digits.startsWith('0')) {
    digits = digits.substring(1);
  }
  
  // If doesn't start with country code, assume US (+1) or Brazil (+55)
  if (!digits.startsWith('1') && !digits.startsWith('55')) {
    // If 10 digits, assume US
    if (digits.length === 10) {
      digits = '1' + digits;
    }
    // If 11 digits starting with 9, assume Brazil mobile
    else if (digits.length === 11 && digits.charAt(2) === '9') {
      digits = '55' + digits;
    }
  }
  
  return '+' + digits;
}

// Welcome email HTML template
function getWelcomeEmailHTML(firstName: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to NEP System</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%); padding: 40px 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Welcome to NEP System! 🎉</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Your Science-Based Parenting Guide</p>
      </td>
    </tr>
    
    <!-- Content -->
    <tr>
      <td style="padding: 40px 30px;">
        <p style="font-size: 16px; color: #333; margin: 0 0 20px 0;">
          Hi ${firstName}! 👋
        </p>
        <p style="font-size: 16px; color: #333; margin: 0 0 20px 0;">
          Thank you for choosing NEP System. You've just taken a transformative step toward better understanding your child's unique brain profile.
        </p>
        
        <!-- CTA Button -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
          <tr>
            <td align="center">
              <a href="https://nepsystem.vercel.app/" style="display: inline-block; background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 30px; font-size: 16px; font-weight: 600;">
                Access Your Account →
              </a>
            </td>
          </tr>
        </table>
        
        <!-- Steps -->
        <h2 style="font-size: 20px; color: #1a1a1a; margin: 30px 0 15px 0;">🚀 Getting Started</h2>
        <ol style="font-size: 14px; color: #333; line-height: 1.8; padding-left: 20px;">
          <li style="margin-bottom: 10px;"><strong>Sign in</strong> with this email address</li>
          <li style="margin-bottom: 10px;"><strong>Complete the quiz</strong> to identify your child's brain profile</li>
          <li style="margin-bottom: 10px;"><strong>Explore Scripts</strong> for immediate, actionable strategies</li>
          <li style="margin-bottom: 10px;"><strong>Watch videos</strong> for deeper understanding</li>
          <li style="margin-bottom: 10px;"><strong>Track progress</strong> in the MY PLAN section</li>
        </ol>
        
        <!-- Highlight Box -->
        <div style="background-color: #F3F4F6; border-radius: 12px; padding: 20px; margin: 25px 0;">
          <p style="font-size: 14px; color: #1a1a1a; margin: 0; font-style: italic;">
            💡 <strong>Pro Tip:</strong> Start with the Scripts section when facing a challenging moment. Each script gives you exact phrases to say, step-by-step actions, and explains WHY it works.
          </p>
        </div>
        
        <!-- Features -->
        <h2 style="font-size: 20px; color: #1a1a1a; margin: 30px 0 15px 0;">✨ What You Get</h2>
        <ul style="font-size: 14px; color: #333; line-height: 1.8; padding-left: 20px;">
          <li style="margin-bottom: 8px;">🧠 Brain profile identification (INTENSE, DISTRACTED, DEFIANT)</li>
          <li style="margin-bottom: 8px;">📝 Hundreds of situation-specific scripts with exact phrases</li>
          <li style="margin-bottom: 8px;">🎬 Video training on evidence-based strategies</li>
          <li style="margin-bottom: 8px;">📚 Exclusive ebooks with deep-dive content</li>
          <li style="margin-bottom: 8px;">📊 Daily progress tracking and insights</li>
        </ul>
        
        <!-- Support -->
        <div style="border-top: 1px solid #E5E7EB; margin-top: 30px; padding-top: 20px;">
          <p style="font-size: 14px; color: #666; margin: 0;">
            Need help? Contact us at <a href="mailto:support@nepsystem.pro" style="color: #8B5CF6;">support@nepsystem.pro</a>
          </p>
        </div>
      </td>
    </tr>
    
    <!-- Footer -->
    <tr>
      <td style="background-color: #1a1a1a; padding: 25px 30px; text-align: center;">
        <p style="color: #999; font-size: 12px; margin: 0;">
          © 2025 NEP System. All rights reserved.
        </p>
        <p style="color: #666; font-size: 11px; margin: 10px 0 0 0;">
          Science-Based Parenting Solutions
        </p>
      </td>
    </tr>
    
  </table>
</body>
</html>
  `.trim();
}

// Send welcome email via OneSignal
async function sendWelcomeEmail(email: string, firstName: string): Promise<void> {
  const onesignalAppId = Deno.env.get('ONESIGNAL_APP_ID');
  const onesignalApiKey = Deno.env.get('ONESIGNAL_REST_API_KEY');

  if (!onesignalAppId || !onesignalApiKey) {
    console.warn('⚠️ OneSignal credentials not configured, skipping welcome email');
    return;
  }

  console.log('📧 Sending welcome email to:', email);

  try {
    const response = await fetch('https://api.onesignal.com/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Key ${onesignalApiKey}`,
      },
      body: JSON.stringify({
        app_id: onesignalAppId,
        target_channel: 'email',
        include_email_tokens: [email],
        email_subject: 'Welcome to NEP System! 🎉 Your Access is Ready',
        email_body: getWelcomeEmailHTML(firstName),
      }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error('❌ OneSignal email error:', result);
    } else {
      console.log('✅ Welcome email sent:', result.id || 'success');
    }
  } catch (error) {
    console.error('⚠️ Failed to send welcome email:', error);
  }
}

// Send welcome SMS via Twilio Direct API
async function sendWelcomeSMS(phone: string, firstName: string): Promise<boolean> {
  const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
  const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN');
  const twilioPhone = Deno.env.get('TWILIO_PHONE_NUMBER');

  if (!twilioAccountSid || !twilioAuthToken) {
    console.warn('⚠️ Twilio credentials not configured, skipping welcome SMS');
    return false;
  }

  if (!twilioPhone) {
    console.warn('⚠️ TWILIO_PHONE_NUMBER not configured, skipping welcome SMS');
    return false;
  }

  console.log('📱 Sending welcome SMS via Twilio to:', phone, 'from:', twilioPhone);

  try {
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(`${twilioAccountSid}:${twilioAuthToken}`),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: phone,
          From: twilioPhone,
          Body: `Hi ${firstName}! 🎉 Your NEP System access is ready. Start now: https://nepsystem.vercel.app`,
        }),
      }
    );

    const result = await response.json();
    console.log('📱 Twilio SMS response:', JSON.stringify(result));

    if (result.sid) {
      console.log('✅ Welcome SMS sent successfully, SID:', result.sid);
      return true;
    } else {
      console.error('❌ Twilio SMS error:', result);
      return false;
    }
  } catch (error) {
    console.error('⚠️ Failed to send welcome SMS:', error);
    return false;
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // ✅ SECURITY: Validate webhook secret via query parameter
    const url = new URL(req.url);
    const secretParam = url.searchParams.get('secret');
    const webhookSecret = Deno.env.get('CARTPANDA_WEBHOOK_SECRET');
    
    if (!webhookSecret) {
      console.error('❌ CARTPANDA_WEBHOOK_SECRET not configured');
      return new Response(
        JSON.stringify({ error: 'Webhook not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (secretParam !== webhookSecret) {
      console.error('❌ Invalid webhook secret');
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('🎯 Cartpanda webhook received - authenticated');
    
    // Parse request body
    let payload: CartpandaPayload = {};
    
    if (req.method === 'POST') {
      payload = await req.json();
    } else if (req.method === 'GET') {
      payload = Object.fromEntries(url.searchParams.entries()) as any;
    }

    console.log('📦 Webhook payload:', JSON.stringify(payload, null, 2));

    // Extract data from nested or flat structure
    const order = payload.order || {};
    const customer = order.customer || {};
    const lineItems = order.line_items || [];
    
    // Resolve email (try multiple locations)
    const email = (
      order.email || 
      customer.email || 
      payload.email || 
      ''
    ).toLowerCase().trim();
    
    if (!email || !email.includes('@')) {
      console.error('❌ No valid email in webhook payload');
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Resolve phone (try multiple locations) - v1.1.0
    const rawPhone = 
      customer.phone || 
      (order as any).address?.phone ||  // CartPanda sometimes uses this
      order.billing_address?.phone || 
      order.shipping_address?.phone ||
      payload.phone ||
      null;
    
    console.log('🔍 Phone extraction debug:', {
      customerPhone: customer.phone,
      addressPhone: (order as any).address?.phone,
      billingPhone: order.billing_address?.phone,
      shippingPhone: order.shipping_address?.phone,
      payloadPhone: payload.phone,
      rawPhone,
    });
    
    const phone = formatPhoneE164(rawPhone);
    
    console.log('📧 Email:', email);
    console.log('📱 Phone:', phone || 'not provided');

    // Determine event type
    const eventType = payload.event || order.status || 'order.paid';
    console.log('📌 Event type:', eventType);

    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Handle different event types
    if (eventType.includes('refund') || eventType === 'order.refunded') {
      // ========== REFUND EVENT ==========
      console.log('💸 Processing REFUND for:', email);
      
      const { error: updateError } = await supabase
        .from('approved_users')
        .update({
          status: 'refunded',
          updated_at: new Date().toISOString(),
        })
        .eq('email', email);

      if (updateError) {
        console.error('❌ Error updating approved_users for refund:', updateError);
      }

      // Revoke premium from existing profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ premium: false, updated_at: new Date().toISOString() })
        .eq('email', email);

      if (profileError) {
        console.error('⚠️ Error revoking premium:', profileError);
      }

      console.log('✅ Refund processed for:', email);
      return new Response(
        JSON.stringify({ success: true, action: 'refund', email }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else if (eventType.includes('chargeback') || eventType === 'order.chargedback') {
      // ========== CHARGEBACK EVENT ==========
      console.log('🚨 Processing CHARGEBACK for:', email);
      
      const { error: updateError } = await supabase
        .from('approved_users')
        .update({
          status: 'chargeback',
          updated_at: new Date().toISOString(),
        })
        .eq('email', email);

      if (updateError) {
        console.error('❌ Error updating approved_users for chargeback:', updateError);
      }

      // Revoke premium
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ premium: false, updated_at: new Date().toISOString() })
        .eq('email', email);

      if (profileError) {
        console.error('⚠️ Error revoking premium:', profileError);
      }

      console.log('✅ Chargeback processed for:', email);
      return new Response(
        JSON.stringify({ success: true, action: 'chargeback', email }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else {
      // ========== ORDER PAID (default) ==========
      console.log('💰 Processing ORDER PAID for:', email);

      const orderId = order.id || payload.order_id || null;
      const firstName = customer.first_name || payload.first_name || null;
      const lastName = customer.last_name || payload.last_name || null;
      const totalPrice = order.total_price || payload.total_price || null;
      const currency = order.currency || payload.currency || 'BRL';
      const productId = lineItems[0]?.product_id || payload.product_id || null;
      const productName = lineItems[0]?.name || payload.product_name || null;

      // Insert or update approved_users (now with phone)
      const { data: approvedUser, error: approvedError } = await supabase
        .from('approved_users')
        .upsert({
          email,
          phone,
          order_id: orderId,
          product_id: productId,
          product_name: productName,
          total_price: totalPrice ? parseFloat(totalPrice) : null,
          currency,
          first_name: firstName,
          last_name: lastName,
          status: 'active',
          approved_at: new Date().toISOString(),
          webhook_data: payload,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'email',
          ignoreDuplicates: false
        })
        .select()
        .single();

      if (approvedError) {
        console.error('❌ Error inserting approved_users:', approvedError);
        return new Response(
          JSON.stringify({ error: 'Database error', details: approvedError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('✅ Approved user created/updated:', approvedUser.id);

      // If user already exists in profiles, upgrade to premium
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id, email, premium')
        .eq('email', email)
        .single();

      if (existingProfile) {
        console.log('🎁 User exists, upgrading to premium...');
        
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            premium: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingProfile.id);

        if (updateError) {
          console.error('⚠️ Error upgrading to premium:', updateError);
        } else {
          console.log('✅ User upgraded to premium');
          
          // Link approved_users to profile
          await supabase
            .from('approved_users')
            .update({
              user_id: existingProfile.id,
              account_created: true,
              account_created_at: new Date().toISOString()
            })
            .eq('email', email);
        }
      }

      // 📧 Send welcome email via OneSignal
      await sendWelcomeEmail(email, firstName || 'there');

      // 📱 Send welcome SMS if phone available
      let smsSent = false;
      if (phone) {
        smsSent = await sendWelcomeSMS(phone, firstName || 'there');
        
        // Update sms_sent flag
        if (smsSent) {
          await supabase
            .from('approved_users')
            .update({ sms_sent: true })
            .eq('email', email);
        }
      }

      console.log('🎉 Order processed successfully for:', email);
      return new Response(
        JSON.stringify({ 
          success: true, 
          action: 'order_paid',
          email,
          phone,
          approved_user_id: approvedUser.id,
          welcome_email_sent: true,
          welcome_sms_sent: smsSent
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('💥 Unexpected error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});