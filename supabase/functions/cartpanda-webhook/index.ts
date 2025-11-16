import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CartpandaWebhookData {
  email?: string;
  order_id?: string;
  product_id?: string;
  product_name?: string;
  total_price?: string;
  currency?: string;
  first_name?: string;
  last_name?: string;
  datetime_unix?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🎯 Cartpanda webhook received');
    
    // Parse request - can be GET or POST
    let webhookData: CartpandaWebhookData = {};
    
    if (req.method === 'POST') {
      webhookData = await req.json();
    } else if (req.method === 'GET') {
      // Cartpanda may send via GET with query params
      const url = new URL(req.url);
      webhookData = Object.fromEntries(url.searchParams.entries());
    }

    console.log('📦 Webhook data:', JSON.stringify(webhookData, null, 2));

    // Validate required email
    if (!webhookData.email) {
      console.error('❌ Email missing in webhook data');
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Normalize email
    const email = webhookData.email.toLowerCase().trim();

    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Insert or update approved_users
    const { data: approvedUser, error: approvedError } = await supabase
      .from('approved_users')
      .upsert({
        email,
        order_id: webhookData.order_id || null,
        product_id: webhookData.product_id || null,
        product_name: webhookData.product_name || null,
        total_price: webhookData.total_price ? parseFloat(webhookData.total_price) : null,
        currency: webhookData.currency || 'USD',
        first_name: webhookData.first_name || null,
        last_name: webhookData.last_name || null,
        status: 'active',
        approved_at: new Date().toISOString(),
        webhook_data: webhookData, // Save complete data for audit
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'email',
        ignoreDuplicates: false
      })
      .select()
      .single();

    if (approvedError) {
      console.error('❌ Error inserting approved user:', approvedError);
      return new Response(
        JSON.stringify({ error: 'Database error', details: approvedError.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('✅ Approved user created/updated:', approvedUser.id);

    // If user already exists, upgrade to premium
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id, email, premium')
      .eq('email', email)
      .single();

    if (existingProfile && !existingProfile.premium) {
      console.log('🎁 User exists, upgrading to premium...');
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          premium: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingProfile.id);

      if (updateError) {
        console.error('⚠️  Error upgrading user to premium:', updateError);
      } else {
        console.log('✅ User upgraded to premium');
        
        // Update approved_users with user_id
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

    // Success log
    console.log('🎉 Webhook processed successfully for:', email);

    // Return success to Cartpanda
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Webhook processed successfully',
        email,
        approved_user_id: approvedUser.id
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('💥 Unexpected error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
