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
      price?: string;
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

// Welcome email HTML template - Premium v3.0
function getWelcomeEmailHTML(firstName: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to The Obedience Language</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0a0a0a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; margin: 0 auto; background-color: #111111;">
    
    <!-- Header with Logo -->
    <tr>
      <td style="background: linear-gradient(135deg, #ec4899 0%, #a855f7 50%, #8b5cf6 100%); padding: 50px 30px; text-align: center;">
        <!-- Brain Logo SVG -->
        <svg width="80" height="80" viewBox="0 0 100 100" style="margin-bottom: 20px;">
          <defs>
            <linearGradient id="brainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#fda4d4;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#a855f7;stop-opacity:1" />
            </linearGradient>
          </defs>
          <path d="M 30 40 Q 20 35 20 45 Q 20 55 25 60 Q 30 65 35 62 Q 40 59 38 50 Q 36 42 30 40 Z" fill="url(#brainGradient)" stroke="#a855f7" stroke-width="2"/>
          <path d="M 70 40 Q 80 35 80 45 Q 80 55 75 60 Q 70 65 65 62 Q 60 59 62 50 Q 64 42 70 40 Z" fill="url(#brainGradient)" stroke="#a855f7" stroke-width="2"/>
          <ellipse cx="50" cy="50" rx="15" ry="20" fill="url(#brainGradient)" stroke="#a855f7" stroke-width="2"/>
          <path d="M 45 65 L 45 80 Q 45 85 50 85 Q 55 85 55 80 L 55 65" fill="#8b5cf6" stroke="#7c3aed" stroke-width="2"/>
        </svg>
        
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Welcome to The Obedience Language</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 12px 0 0 0; font-size: 15px;">Your access is ready, ${firstName}</p>
      </td>
    </tr>
    
    <!-- Access Button -->
    <tr>
      <td style="padding: 40px 30px 30px 30px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center">
              <a href="https://nepsystem.vercel.app/" style="display: inline-block; background: linear-gradient(135deg, #ec4899 0%, #a855f7 100%); color: #ffffff; text-decoration: none; padding: 18px 48px; border-radius: 12px; font-size: 17px; font-weight: 600;">
                Access Your Dashboard
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    
    <!-- Quick Start -->
    <tr>
      <td style="padding: 0 30px 30px 30px;">
        <h2 style="font-size: 18px; color: #ffffff; margin: 0 0 20px 0;">Quick Start:</h2>
        
        <div style="background-color: #1a1a1a; border-radius: 12px; padding: 20px; margin-bottom: 12px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="40" style="vertical-align: top; padding-right: 15px;">
                <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #ec4899, #a855f7); border-radius: 50%; text-align: center; line-height: 32px; color: #fff; font-weight: 700; font-size: 14px;">1</div>
              </td>
              <td style="vertical-align: top;">
                <p style="font-size: 15px; color: #ffffff; margin: 0 0 4px 0; font-weight: 600;">Take the 5-minute quiz</p>
                <p style="font-size: 14px; color: #a1a1aa; margin: 0;">Identify your child's brain profile</p>
              </td>
            </tr>
          </table>
        </div>
        
        <div style="background-color: #1a1a1a; border-radius: 12px; padding: 20px; margin-bottom: 12px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="40" style="vertical-align: top; padding-right: 15px;">
                <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #ec4899, #a855f7); border-radius: 50%; text-align: center; line-height: 32px; color: #fff; font-weight: 700; font-size: 14px;">2</div>
              </td>
              <td style="vertical-align: top;">
                <p style="font-size: 15px; color: #ffffff; margin: 0 0 4px 0; font-weight: 600;">Browse your scripts</p>
                <p style="font-size: 14px; color: #a1a1aa; margin: 0;">200+ strategies for specific situations</p>
              </td>
            </tr>
          </table>
        </div>
        
        <div style="background-color: #1a1a1a; border-radius: 12px; padding: 20px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="40" style="vertical-align: top; padding-right: 15px;">
                <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #ec4899, #a855f7); border-radius: 50%; text-align: center; line-height: 32px; color: #fff; font-weight: 700; font-size: 14px;">3</div>
              </td>
              <td style="vertical-align: top;">
                <p style="font-size: 15px; color: #ffffff; margin: 0 0 4px 0; font-weight: 600;">Try your first script today</p>
                <p style="font-size: 14px; color: #a1a1aa; margin: 0;">Start with the most pressing challenge</p>
              </td>
            </tr>
          </table>
        </div>
      </td>
    </tr>
    
    <!-- Resources -->
    <tr>
      <td style="padding: 0 30px 30px 30px;">
        <h2 style="font-size: 18px; color: #ffffff; margin: 0 0 16px 0;">Your Resources:</h2>
        
        <table width="100%" cellpadding="0" cellspacing="0">
          <!-- Scripts -->
          <tr>
            <td style="padding-bottom: 10px;">
              <a href="https://nepsystem.vercel.app/scripts" style="display: block; background-color: #1a1a1a; border-radius: 8px; padding: 16px; text-decoration: none; color: #ffffff;">
                <p style="font-size: 15px; margin: 0 0 4px 0; font-weight: 600;">📝 Scripts Library</p>
                <p style="font-size: 13px; color: #71717a; margin: 0;">200+ word-for-word strategies for real situations</p>
              </a>
            </td>
          </tr>
          <!-- Audio -->
          <tr>
            <td style="padding-bottom: 10px;">
              <a href="https://nepsystem.vercel.app/listen" style="display: block; background-color: #1a1a1a; border-radius: 8px; padding: 16px; text-decoration: none; color: #ffffff;">
                <p style="font-size: 15px; margin: 0 0 4px 0; font-weight: 600;">🎧 Audio Collection</p>
                <p style="font-size: 13px; color: #71717a; margin: 0;">Guided audio for calm, confident parenting</p>
              </a>
            </td>
          </tr>
          <!-- Videos -->
          <tr>
            <td style="padding-bottom: 10px;">
              <a href="https://nepsystem.vercel.app/bonuses" style="display: block; background-color: #1a1a1a; border-radius: 8px; padding: 16px; text-decoration: none; color: #ffffff;">
                <p style="font-size: 15px; margin: 0 0 4px 0; font-weight: 600;">🎬 Video Training</p>
                <p style="font-size: 13px; color: #71717a; margin: 0;">Expert guidance and demonstrations</p>
              </a>
            </td>
          </tr>
          <!-- Ebooks -->
          <tr>
            <td style="padding-bottom: 10px;">
              <a href="https://nepsystem.vercel.app/bonuses" style="display: block; background-color: #1a1a1a; border-radius: 8px; padding: 16px; text-decoration: none; color: #ffffff;">
                <p style="font-size: 15px; margin: 0 0 4px 0; font-weight: 600;">📚 Ebooks</p>
                <p style="font-size: 13px; color: #71717a; margin: 0;">Deep-dive guides and resources</p>
              </a>
            </td>
          </tr>
          <!-- Tracker -->
          <tr>
            <td style="padding-bottom: 10px;">
              <a href="https://nepsystem.vercel.app/tracker" style="display: block; background-color: #1a1a1a; border-radius: 8px; padding: 16px; text-decoration: none; color: #ffffff;">
                <p style="font-size: 15px; margin: 0 0 4px 0; font-weight: 600;">📊 Daily Tracker</p>
                <p style="font-size: 13px; color: #71717a; margin: 0;">Track your progress and build streaks</p>
              </a>
            </td>
          </tr>
          <!-- Achievements -->
          <tr>
            <td>
              <a href="https://nepsystem.vercel.app/achievements" style="display: block; background-color: #1a1a1a; border-radius: 8px; padding: 16px; text-decoration: none; color: #ffffff;">
                <p style="font-size: 15px; margin: 0 0 4px 0; font-weight: 600;">🏆 Achievements</p>
                <p style="font-size: 13px; color: #71717a; margin: 0;">Earn badges as you grow</p>
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    
    <!-- Support -->
    <tr>
      <td style="padding: 0 30px 40px 30px;">
        <div style="background-color: #1a1a1a; border-radius: 12px; padding: 24px; text-align: center;">
          <p style="font-size: 15px; color: #ffffff; margin: 0 0 12px 0; font-weight: 600;">Need Help?</p>
          <p style="font-size: 14px; color: #a1a1aa; margin: 0 0 20px 0;">We're here to support you on your journey</p>
          
          <!-- Buttons side by side -->
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="50%" style="padding-right: 6px;">
                <a href="https://wa.me/27617525578?text=Hi!%20I%20need%20help%20with%20The%20Obedience%20Language" style="display: block; background-color: #22c55e; color: #ffffff; text-decoration: none; padding: 14px 12px; border-radius: 8px; font-size: 14px; font-weight: 600;">
                  💬 WhatsApp
                </a>
              </td>
              <td width="50%" style="padding-left: 6px;">
                <a href="mailto:support@nepsystem.pro" style="display: block; background-color: #3b82f6; color: #ffffff; text-decoration: none; padding: 14px 12px; border-radius: 8px; font-size: 14px; font-weight: 600;">
                  ✉️ Email
                </a>
              </td>
            </tr>
          </table>
        </div>
      </td>
    </tr>
    
    <!-- Footer -->
    <tr>
      <td style="background-color: #0a0a0a; padding: 25px 30px; text-align: center; border-top: 1px solid #1a1a1a;">
        <p style="color: #52525b; font-size: 12px; margin: 0;">
          © 2025 The Obedience Language · Powered by NEP System
        </p>
      </td>
    </tr>
    
  </table>
</body>
</html>
  `.trim();
}

// Send welcome email via Resend
async function sendWelcomeEmail(email: string, firstName: string): Promise<void> {
  const resendApiKey = Deno.env.get('RESEND_API_KEY');

  if (!resendApiKey) {
    console.warn('⚠️ RESEND_API_KEY not configured, skipping welcome email');
    return;
  }

  console.log('📧 Sending welcome email via Resend to:', email);

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'NEP System <support@nepsystem.pro>',
        to: [email],
        subject: 'Welcome to NEP System! 🎉 Your Access is Ready',
        html: getWelcomeEmailHTML(firstName),
      }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error('❌ Resend email error:', result);
    } else {
      console.log('✅ Welcome email sent via Resend:', result.id);
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

      // 🎯 Build products array from ALL line_items (not just first)
      const purchasedProducts = lineItems.map((item, index) => ({
        id: item.product_id || '',
        name: item.name || '',
        type: index === 0 ? 'main' : 'addon', // First = main product, rest = order bumps/upsells
        price: item.price ? parseFloat(item.price) : null,
        purchased_at: new Date().toISOString()
      })).filter(p => p.id); // Remove empty products

      console.log('🛍️ Purchased products:', purchasedProducts);

      // Fetch existing approved_users record to merge products
      const { data: existingApprovedUser } = await supabase
        .from('approved_users')
        .select('products')
        .eq('email', email)
        .single();

      // Merge existing products with new purchases (avoid duplicates)
      const existingProducts = (existingApprovedUser?.products as any[]) || [];
      const existingProductIds = new Set(existingProducts.map((p: any) => p.id));
      
      const mergedProducts = [
        ...existingProducts,
        ...purchasedProducts.filter(p => !existingProductIds.has(p.id))
      ];

      console.log('🔄 Merged products:', mergedProducts);

      // 🐛 FIX: Only set approved_at for NEW records, not updates
      const isExistingUser = !!existingApprovedUser;
      const now = new Date().toISOString();

      // Insert or update approved_users (now with phone AND products array)
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
          ...(isExistingUser ? {} : { approved_at: now }), // ✅ Only set approved_at if NEW
          webhook_data: payload,
          products: mergedProducts, // ✅ Save ALL purchased products
          updated_at: now,
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

      // If user already exists in profiles, upgrade to premium and assign badges
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

        // 🎖️ Assign membership badges based on purchased products
        const NEP_MEMBER_BADGE_ID = 'a1b2c3d4-5678-90ab-cdef-111111111111';
        const NEP_LISTEN_BADGE_ID = 'a1b2c3d4-5678-90ab-cdef-222222222222';
        const NEP_MEMBER_PRODUCTS = ['27499673', '27577169'];
        const NEP_LISTEN_PRODUCTS = ['27845678', '27851448'];

        for (const product of mergedProducts) {
          const productIdStr = String(product.id);
          
          // Main product -> NEP Member badge
          if (NEP_MEMBER_PRODUCTS.includes(productIdStr)) {
            console.log('🎖️ Assigning NEP Member badge...');
            await supabase
              .from('user_badges')
              .upsert({
                user_id: existingProfile.id,
                badge_id: NEP_MEMBER_BADGE_ID,
                unlocked_at: new Date().toISOString()
              }, { onConflict: 'user_id,badge_id' });
          }
          
          // Audio upsell -> NEP Listen badge
          if (NEP_LISTEN_PRODUCTS.includes(productIdStr)) {
            console.log('🎧 Assigning NEP Listen badge...');
            await supabase
              .from('user_badges')
              .upsert({
                user_id: existingProfile.id,
                badge_id: NEP_LISTEN_BADGE_ID,
                unlocked_at: new Date().toISOString()
              }, { onConflict: 'user_id,badge_id' });
          }
        }
      }

      // 📧 Send welcome email via Resend
      await sendWelcomeEmail(email, firstName || 'there');
      
      // ✅ Mark email as sent
      await supabase
        .from('approved_users')
        .update({ email_sent: true })
        .eq('email', email);

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
          products_count: purchasedProducts.length,
          products: purchasedProducts.map(p => ({ id: p.id, name: p.name, type: p.type })),
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