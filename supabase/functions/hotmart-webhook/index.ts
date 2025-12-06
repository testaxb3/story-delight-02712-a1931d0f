import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-hotmart-hottok',
};

// Hotmart event types
type HotmartEvent = 
  | 'PURCHASE_COMPLETE' 
  | 'PURCHASE_APPROVED' 
  | 'PURCHASE_CANCELED' 
  | 'PURCHASE_REFUNDED' 
  | 'PURCHASE_CHARGEBACK'
  | 'PURCHASE_BILLET_PRINTED'
  | 'PURCHASE_PROTEST'
  | 'PURCHASE_DELAYED';

interface HotmartPayload {
  id: string;
  creation_date: number;
  event: HotmartEvent;
  version: string;
  data: {
    product: {
      id: number;
      ucode: string;
      name: string;
      warranty_date: string;
      support_email: string;
      has_co_production: boolean;
      is_physical_product: boolean;
    };
    buyer: {
      email: string;
      name: string;
      first_name: string;
      last_name: string;
      checkout_phone: string;
      address?: {
        city: string;
        country: string;
        country_iso: string;
        state: string;
        zipcode: string;
        address: string;
      };
    };
    purchase: {
      approved_date: number;
      full_price: { value: number; currency_value: string };
      price: { value: number; currency_value: string };
      status: string;
      transaction: string;
      payment: { installments_number: number; type: string };
      offer: { code: string };
      order_date: number;
    };
    subscription?: {
      subscriber: { code: string };
      plan: { id: number; name: string };
      status: string;
    };
  };
}

// Optimized Welcome Email HTML - Outlook-friendly v2.0
function getWelcomeEmailHTML(firstName: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Welcome to The Obedience Language</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    body, table, td, p, a, li { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { margin: 0 !important; padding: 0 !important; width: 100% !important; }
    a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; }
    u + #body a { color: inherit; text-decoration: none; }
    @media (prefers-color-scheme: dark) {
      .dark-bg { background-color: #0a0a0a !important; }
    }
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; }
      .mobile-padding { padding: 30px 20px !important; }
      .mobile-text { font-size: 16px !important; line-height: 26px !important; }
      .mobile-headline { font-size: 26px !important; line-height: 32px !important; }
      .mobile-btn { padding: 16px 32px !important; font-size: 16px !important; }
      .mobile-stack { display: block !important; width: 100% !important; padding: 0 !important; }
      .mobile-stack td { display: block !important; width: 100% !important; padding: 6px 0 !important; }
      .resource-card { padding: 18px !important; }
    }
  </style>
</head>
<body id="body" style="margin: 0; padding: 0; background-color: #0a0a0a; -webkit-font-smoothing: antialiased;">

  <div style="display: none; max-height: 0px; overflow: hidden;">
    Your account is ready. Here's how to get started.
    &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>

  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0a0a0a;">
    <tr>
      <td align="center" style="padding: 20px 10px;">

        <table role="presentation" class="container" cellpadding="0" cellspacing="0" width="560" style="max-width: 560px; background-color: #111111; border-radius: 16px; overflow: hidden;">

          <tr>
            <td style="background: linear-gradient(135deg, #ec4899 0%, #a855f7 50%, #8b5cf6 100%); padding: 50px 30px; text-align: center;">
              <div style="width: 70px; height: 70px; background-color: rgba(255,255,255,0.2); border-radius: 50%; margin: 0 auto 24px auto; line-height: 70px;">
                <span style="font-size: 36px; color: #ffffff;">&#10003;</span>
              </div>
              <h1 class="mobile-headline" style="color: #ffffff; margin: 0; font-size: 30px; font-weight: 700; line-height: 38px;">
                You're In!
              </h1>
              <p style="color: rgba(255,255,255,0.95); margin: 14px 0 0 0; font-size: 17px; font-weight: 400;">
                Welcome to The Obedience Language
              </p>
            </td>
          </tr>

          <tr>
            <td class="mobile-padding" style="padding: 40px 30px 24px 30px;">
              <p class="mobile-text" style="margin: 0 0 18px 0; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 17px; line-height: 28px;">
                Hey ${firstName},
              </p>
              <p class="mobile-text" style="margin: 0 0 18px 0; color: #d4d4d8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 16px; line-height: 26px;">
                Congratulations on taking this step. You just joined thousands of parents who decided to stop the daily battles and start being heard.
              </p>
              <p class="mobile-text" style="margin: 0; color: #d4d4d8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 16px; line-height: 26px;">
                Your complete system is ready. Let's get started.
              </p>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding: 0 30px 36px 30px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="border-radius: 12px; background: linear-gradient(135deg, #ec4899 0%, #a855f7 100%); box-shadow: 0 8px 24px rgba(168, 85, 247, 0.35);">
                    <a href="https://nepsystem.vercel.app/" target="_blank" class="mobile-btn" style="display: inline-block; padding: 18px 48px; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 18px; font-weight: 700; text-decoration: none; letter-spacing: 0.5px;">
                      Access My Dashboard
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <h2 style="font-size: 18px; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; margin: 0 0 20px 0; font-weight: 700;">
                Quick Start (5 minutes):
              </h2>

              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 12px;">
                <tr>
                  <td style="background-color: #1a1a1a; border-radius: 12px; padding: 20px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td width="46" valign="top">
                          <div style="width: 36px; height: 36px; background: linear-gradient(135deg, #ec4899, #a855f7); border-radius: 50%; text-align: center; line-height: 36px; color: #fff; font-weight: 700; font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">1</div>
                        </td>
                        <td valign="top">
                          <p style="font-size: 16px; color: #ffffff; margin: 0 0 4px 0; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">Take the Brain Profile Quiz</p>
                          <p style="font-size: 14px; color: #a1a1aa; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">Discover your child's unique emotional triggers</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 12px;">
                <tr>
                  <td style="background-color: #1a1a1a; border-radius: 12px; padding: 20px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td width="46" valign="top">
                          <div style="width: 36px; height: 36px; background: linear-gradient(135deg, #ec4899, #a855f7); border-radius: 50%; text-align: center; line-height: 36px; color: #fff; font-weight: 700; font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">2</div>
                        </td>
                        <td valign="top">
                          <p style="font-size: 16px; color: #ffffff; margin: 0 0 4px 0; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">Pick Your First Script</p>
                          <p style="font-size: 14px; color: #a1a1aa; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">Start with your biggest frustration (bedtime, tantrums, etc.)</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="background-color: #1a1a1a; border-radius: 12px; padding: 20px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td width="46" valign="top">
                          <div style="width: 36px; height: 36px; background: linear-gradient(135deg, #ec4899, #a855f7); border-radius: 50%; text-align: center; line-height: 36px; color: #fff; font-weight: 700; font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">3</div>
                        </td>
                        <td valign="top">
                          <p style="font-size: 16px; color: #ffffff; margin: 0 0 4px 0; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">Use It Tonight</p>
                          <p style="font-size: 14px; color: #a1a1aa; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">Watch your child respond the first time</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <h2 style="font-size: 18px; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; margin: 0 0 16px 0; font-weight: 700;">
                What's Included:
              </h2>

              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="background-color: #1a1a1a; border-radius: 10px; padding: 16px 18px; border-left: 3px solid #ec4899;">
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td width="36" valign="middle">
                          <span style="font-size: 22px;">&#128221;</span>
                        </td>
                        <td valign="middle">
                          <p style="font-size: 15px; color: #ffffff; margin: 0 0 2px 0; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">Complete Scripts Library</p>
                          <p style="font-size: 13px; color: #71717a; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">Word-for-word phrases for every situation</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 10px;">
                <tr>
                  <td style="background-color: #1a1a1a; border-radius: 10px; padding: 16px 18px; border-left: 3px solid #a855f7;">
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td width="36" valign="middle">
                          <span style="font-size: 22px;">&#127911;</span>
                        </td>
                        <td valign="middle">
                          <p style="font-size: 15px; color: #ffffff; margin: 0 0 2px 0; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">Audio Collection</p>
                          <p style="font-size: 13px; color: #71717a; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">Listen while you drive or cook</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 10px;">
                <tr>
                  <td style="background-color: #1a1a1a; border-radius: 10px; padding: 16px 18px; border-left: 3px solid #8b5cf6;">
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td width="36" valign="middle">
                          <span style="font-size: 22px;">&#127916;</span>
                        </td>
                        <td valign="middle">
                          <p style="font-size: 15px; color: #ffffff; margin: 0 0 2px 0; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">Video Training + Bonuses</p>
                          <p style="font-size: 13px; color: #71717a; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">SmartKid, Siblings & more</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 0 30px 40px 30px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="background-color: #1a1a1a; border-radius: 12px; padding: 24px; text-align: center;">
                    <p style="font-size: 16px; color: #ffffff; margin: 0 0 6px 0; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
                      Questions? We're Here to Help
                    </p>
                    <p style="font-size: 14px; color: #a1a1aa; margin: 0 0 20px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
                      Real humans. Real fast.
                    </p>

                    <table role="presentation" class="mobile-stack" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td width="50%" style="padding-right: 6px;">
                          <a href="https://wa.me/27617525578?text=Hi!%20I%20need%20help%20with%20The%20Obedience%20Language" target="_blank" style="display: block; background-color: #22c55e; color: #ffffff; text-decoration: none; padding: 14px 16px; border-radius: 10px; font-size: 15px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
                            WhatsApp
                          </a>
                        </td>
                        <td width="50%" style="padding-left: 6px;">
                          <a href="mailto:support@nepsystem.pro" target="_blank" style="display: block; background-color: #3b82f6; color: #ffffff; text-decoration: none; padding: 14px 16px; border-radius: 10px; font-size: 15px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
                            Email Us
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="background-color: #0a0a0a; padding: 28px 30px; text-align: center; border-top: 1px solid #1f1f1f;">
              <p style="color: #52525b; font-size: 13px; margin: 0 0 12px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
                Made with care for parents who refuse to give up
              </p>
              <p style="color: #3f3f46; font-size: 12px; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
                &copy; 2025 The Obedience Language
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

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  console.log('=== HOTMART WEBHOOK START ===');
  console.log('Timestamp:', new Date().toISOString());

  try {
    // Validate Hottok
    const hottok = req.headers.get('x-hotmart-hottok');
    const expectedToken = Deno.env.get('HOTMART_WEBHOOK_TOKEN');

    if (!hottok || hottok !== expectedToken) {
      console.error('Invalid or missing Hottok');
      console.log('Received:', hottok?.substring(0, 10) + '...');
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Hottok validated successfully');

    // Parse payload
    const payload: HotmartPayload = await req.json();
    console.log('Event:', payload.event);
    console.log('Transaction:', payload.data?.purchase?.transaction);
    console.log('Buyer email:', payload.data?.buyer?.email);
    console.log('Product ID:', payload.data?.product?.id);
    console.log('Product name:', payload.data?.product?.name);

    // Extract data
    const { event, data } = payload;
    const { buyer, product, purchase } = data;

    if (!buyer?.email) {
      console.error('No buyer email in payload');
      return new Response(
        JSON.stringify({ error: 'Missing buyer email' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const email = buyer.email.toLowerCase().trim();
    const firstName = buyer.first_name || buyer.name?.split(' ')[0] || '';
    const lastName = buyer.last_name || '';
    const phone = buyer.checkout_phone || null;
    const productId = String(product.id);
    const productName = product.name;
    const totalPrice = purchase?.price?.value || purchase?.full_price?.value || 0;
    const currency = purchase?.price?.currency_value || 'USD';
    const orderId = purchase?.transaction || payload.id;

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Determine status based on event
    let status: string;
    let shouldSendWelcomeEmail = false;

    switch (event) {
      case 'PURCHASE_COMPLETE':
      case 'PURCHASE_APPROVED':
        status = 'active';
        shouldSendWelcomeEmail = true;
        break;
      case 'PURCHASE_REFUNDED':
        status = 'refunded';
        break;
      case 'PURCHASE_CHARGEBACK':
        status = 'chargeback';
        break;
      case 'PURCHASE_CANCELED':
        status = 'canceled';
        break;
      case 'PURCHASE_BILLET_PRINTED':
      case 'PURCHASE_DELAYED':
      case 'PURCHASE_PROTEST':
        console.log(`Ignoring event: ${event}`);
        return new Response(
          JSON.stringify({ success: true, message: `Event ${event} ignored` }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      default:
        console.log(`Unknown event: ${event}`);
        return new Response(
          JSON.stringify({ success: true, message: `Unknown event ${event}` }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    console.log('Determined status:', status);

    // Get product config for unlocks
    const { data: productConfig } = await supabase
      .from('product_config')
      .select('unlocks, product_name')
      .eq('product_id', productId)
      .single();

    console.log('Product config:', productConfig);

    // Build products array
    const productEntry = {
      id: productId,
      name: productConfig?.product_name || productName,
      unlocks: productConfig?.unlocks || ['app_access'],
      source: 'hotmart'
    };

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('approved_users')
      .select('id, products, approved_at, email_sent, account_created')
      .eq('email', email)
      .single();

    if (existingUser) {
      console.log('Existing user found:', existingUser.id);

      // Merge products array
      const existingProducts = (existingUser.products as any[]) || [];
      const productExists = existingProducts.some((p: any) => String(p.id) === productId);
      
      let updatedProducts = existingProducts;
      if (!productExists && status === 'active') {
        updatedProducts = [...existingProducts, productEntry];
      }

      // Update existing user
      const { error: updateError } = await supabase
        .from('approved_users')
        .update({
          status,
          first_name: firstName || undefined,
          last_name: lastName || undefined,
          phone: phone || undefined,
          products: updatedProducts,
          order_id: orderId,
          product_id: productId,
          product_name: productName,
          total_price: totalPrice,
          currency,
          webhook_data: payload,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingUser.id);

      if (updateError) {
        console.error('Error updating user:', updateError);
        throw updateError;
      }

      console.log('User updated successfully');
    } else {
      console.log('Creating new user');

      // Insert new user
      const { error: insertError } = await supabase
        .from('approved_users')
        .insert({
          email,
          first_name: firstName,
          last_name: lastName,
          phone,
          status,
          order_id: orderId,
          product_id: productId,
          product_name: productName,
          total_price: totalPrice,
          currency,
          products: [productEntry],
          webhook_data: payload,
          approved_at: new Date().toISOString(),
        });

      if (insertError) {
        console.error('Error inserting user:', insertError);
        throw insertError;
      }

      console.log('New user created successfully');
    }

    // Send welcome email if purchase approved
    // Send if: (1) never sent email before, OR (2) user hasn't created account + 7+ days since approval (reminder)
    const daysSinceApproval = existingUser?.approved_at 
      ? Math.floor((Date.now() - new Date(existingUser.approved_at).getTime()) / (1000 * 60 * 60 * 24))
      : 0;
    const shouldActuallySendEmail = shouldSendWelcomeEmail && (
      !existingUser?.email_sent || 
      (!existingUser?.account_created && daysSinceApproval > 7)
    );

    if (shouldActuallySendEmail) {
      console.log('Sending welcome email...');
      
      const resendApiKey = Deno.env.get('RESEND_API_KEY');
      if (resendApiKey) {
        try {
          const emailResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'NEP System <support@nepsystem.pro>',
              to: [email],
              reply_to: 'support@nepsystem.pro',
              subject: `${firstName || 'Hey'}, your account is ready`,
              html: getWelcomeEmailHTML(firstName || 'there'),
              headers: {
                'List-Unsubscribe': '<mailto:unsubscribe@nepsystem.pro>',
                'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
                'X-Priority': '3',
              },
            }),
          });

          if (emailResponse.ok) {
            console.log('Welcome email sent successfully');
            
            // Update email_sent flag
            await supabase
              .from('approved_users')
              .update({ email_sent: true })
              .eq('email', email);
          } else {
            const emailError = await emailResponse.text();
            console.error('Email send failed:', emailError);
          }
        } catch (emailErr) {
          console.error('Email error:', emailErr);
        }
      } else {
        console.log('Resend API key not configured, skipping email');
      }
    }

    const duration = Date.now() - startTime;
    console.log(`=== HOTMART WEBHOOK COMPLETE (${duration}ms) ===`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        event,
        email,
        status,
        duration: `${duration}ms`
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('=== HOTMART WEBHOOK ERROR ===');
    console.error('Error:', error);
    
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
