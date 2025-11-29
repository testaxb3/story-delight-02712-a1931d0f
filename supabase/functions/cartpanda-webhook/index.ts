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
      // Some webhooks send via GET with query params
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

    console.log('📧 Email:', email);

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

      // Insert or update approved_users
      const { data: approvedUser, error: approvedError } = await supabase
        .from('approved_users')
        .upsert({
          email,
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

      console.log('🎉 Order processed successfully for:', email);
      return new Response(
        JSON.stringify({ 
          success: true, 
          action: 'order_paid',
          email,
          approved_user_id: approvedUser.id
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
