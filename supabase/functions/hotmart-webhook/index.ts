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
              subject: '🎉 Welcome to NEP System - Your Access is Ready!',
              html: `
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
                  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; border-radius: 16px 16px 0 0; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to NEP System!</h1>
                    <p style="color: rgba(255,255,255,0.9); margin-top: 10px;">Your parenting journey just got easier</p>
                  </div>
                  
                  <div style="background: white; padding: 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <p style="font-size: 16px; color: #333;">Hi ${firstName || 'there'}! 👋</p>
                    
                    <p style="font-size: 16px; color: #555; line-height: 1.6;">
                      Thank you for purchasing <strong>${productName}</strong>! Your access is now ready.
                    </p>
                    
                    <div style="background: #f8f9fa; border-radius: 12px; padding: 20px; margin: 20px 0;">
                      <h3 style="margin: 0 0 15px 0; color: #333;">🚀 Get Started Now:</h3>
                      <ol style="margin: 0; padding-left: 20px; color: #555;">
                        <li style="margin-bottom: 10px;">Click the button below to access the app</li>
                        <li style="margin-bottom: 10px;">Create your account using this email: <strong>${email}</strong></li>
                        <li style="margin-bottom: 10px;">Complete the quick quiz to personalize your experience</li>
                        <li>Start transforming your parenting journey!</li>
                      </ol>
                    </div>
                    
                    <a href="https://nep-ai.lovable.app/auth" style="display: block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 600; font-size: 16px; text-align: center; margin: 25px 0;">
                      Access NEP System Now →
                    </a>
                    
                    <p style="font-size: 14px; color: #888; margin-top: 20px;">
                      Need help? Reply to this email or contact us at support@nepsystem.pro
                    </p>
                  </div>
                  
                  <p style="text-align: center; color: #999; font-size: 12px; margin-top: 20px;">
                    © ${new Date().getFullYear()} NEP System. All rights reserved.
                  </p>
                </body>
                </html>
              `,
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
