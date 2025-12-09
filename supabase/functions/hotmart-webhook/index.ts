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

// Clean Welcome Email HTML - Anti-Spam Optimized (matches cartpanda-webhook)
function getWelcomeEmailHTML(firstName: string): string {
  const safeFirstName = firstName || 'there';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Your Access is Ready</title>
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
              <p style="margin: 0; font-size: 14px; color: #22c55e; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                Order Confirmed
              </p>
              <h1 style="margin: 12px 0 0 0; font-size: 24px; color: #111827; font-weight: 700; line-height: 1.3;">
                Welcome to The Obedience Language, ${safeFirstName}
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 24px 40px;">
              <p style="margin: 0 0 16px 0; font-size: 16px; color: #374151; line-height: 1.6;">
                Thank you for your purchase. Your account is ready to be activated.
              </p>
              <p style="margin: 0 0 24px 0; font-size: 16px; color: #374151; line-height: 1.6;">
                Click the button below to create your password and access the complete program:
              </p>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td align="center" style="padding: 0 40px 32px 40px;">
              <a href="https://nepsystem.vercel.app/welcome" target="_blank" style="display: inline-block; padding: 16px 32px; background-color: #22c55e; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 8px;">
                Activate My Account
              </a>
            </td>
          </tr>

          <!-- What's Next -->
          <tr>
            <td style="padding: 0 40px 32px 40px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 24px 0 16px 0; font-size: 14px; color: #6b7280; font-weight: 600; text-transform: uppercase;">
                What happens next:
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="padding: 8px 0; font-size: 15px; color: #374151;">
                    1. Create your account (takes 30 seconds)
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 15px; color: #374151;">
                    2. Take the quick Brain Profile quiz
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 15px; color: #374151;">
                    3. Get your personalized phrases immediately
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Support -->
          <tr>
            <td style="padding: 24px 40px; background-color: #f9fafb; border-radius: 0 0 8px 8px;">
              <p style="margin: 0; font-size: 14px; color: #6b7280; line-height: 1.6;">
                Questions? Reply to this email or contact us at<br>
                <a href="mailto:support@nepsystem.pro" style="color: #22c55e; text-decoration: none;">support@nepsystem.pro</a>
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
                You received this email because you purchased our program.
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
              from: 'The Obedience Language <support@nepsystem.pro>',
              to: [email],
              reply_to: 'support@nepsystem.pro',
              subject: `${firstName || 'Hey'}, create your account to access your purchase`,
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
