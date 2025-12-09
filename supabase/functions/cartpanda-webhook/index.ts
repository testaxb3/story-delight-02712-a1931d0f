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

// Clean Welcome Email HTML - Anti-Spam Optimized (Unified Template)
function getWelcomeEmailHTML(firstName: string): string {
  const name = firstName || "there";
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Welcome to The Obedience Language</title>
  <style>
    body, table, td, p, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    body { margin: 0 !important; padding: 0 !important; width: 100% !important; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">

  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f9fafb;">
    <tr>
      <td align="center" style="padding: 40px 20px;">

        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width: 520px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 0 40px;">
              <p style="margin: 0; font-size: 14px; color: #10b981; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                Payment Confirmed
              </p>
              <h1 style="margin: 12px 0 0 0; font-size: 24px; color: #111827; font-weight: 700; line-height: 1.3;">
                Welcome, ${name}!
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 24px 40px;">
              <p style="margin: 0 0 20px 0; font-size: 16px; color: #374151; line-height: 1.6;">
                Your purchase was successful. Now create your account to access everything:
              </p>
              
              <!-- Steps -->
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="padding: 12px 0;">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width: 28px; height: 28px; background-color: #f97316; border-radius: 50%; text-align: center; vertical-align: middle;">
                          <span style="color: #ffffff; font-size: 14px; font-weight: 600;">1</span>
                        </td>
                        <td style="padding-left: 12px; font-size: 15px; color: #374151;">
                          Click the button below
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0;">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width: 28px; height: 28px; background-color: #f97316; border-radius: 50%; text-align: center; vertical-align: middle;">
                          <span style="color: #ffffff; font-size: 14px; font-weight: 600;">2</span>
                        </td>
                        <td style="padding-left: 12px; font-size: 15px; color: #374151;">
                          Use this same email to register
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0;">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width: 28px; height: 28px; background-color: #f97316; border-radius: 50%; text-align: center; vertical-align: middle;">
                          <span style="color: #ffffff; font-size: 14px; font-weight: 600;">3</span>
                        </td>
                        <td style="padding-left: 12px; font-size: 15px; color: #374151;">
                          Access all your content instantly
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td align="center" style="padding: 0 40px 32px 40px;">
              <a href="https://nepsystem.vercel.app/welcome" target="_blank" style="display: inline-block; padding: 16px 32px; background-color: #f97316; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 8px;">
                Create My Account
              </a>
            </td>
          </tr>

          <!-- Warning -->
          <tr>
            <td style="padding: 0 40px 32px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fef3c7; border-radius: 6px; border-left: 4px solid #f59e0b;">
                <tr>
                  <td style="padding: 12px 16px;">
                    <p style="margin: 0; font-size: 14px; color: #92400e;">
                      <strong>Important:</strong> Use this email address when creating your account, or your purchase won't be recognized.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Support -->
          <tr>
            <td style="padding: 24px 40px; background-color: #f9fafb; border-radius: 0 0 8px 8px;">
              <p style="margin: 0; font-size: 14px; color: #6b7280; line-height: 1.6;">
                Need help? Reply to this email or contact<br>
                <a href="mailto:support@nepsystem.pro" style="color: #f97316; text-decoration: none;">support@nepsystem.pro</a>
              </p>
            </td>
          </tr>

        </table>

        <!-- Footer -->
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width: 520px;">
          <tr>
            <td style="padding: 24px 20px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                The Obedience Language<br>
                You received this because you made a purchase.
              </p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
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
        from: 'The Obedience Language <support@nepsystem.pro>',
        to: [email],
        reply_to: 'support@nepsystem.pro',
        subject: `${firstName}, create your account to access your purchase`,
        html: getWelcomeEmailHTML(firstName),
        headers: {
          'List-Unsubscribe': '<mailto:unsubscribe@nepsystem.pro>',
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
          'X-Priority': '3',
        },
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