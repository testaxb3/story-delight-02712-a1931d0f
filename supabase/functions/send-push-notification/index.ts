import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationRequest {
  type: 'new_script' | 'refund_update' | 'tracker_reminder' | 'new_content' | 'broadcast';
  target_profile?: 'INTENSE' | 'DISTRACTED' | 'DEFIANT' | 'ALL';
  target_user_id?: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  created_by?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ONESIGNAL_APP_ID = Deno.env.get('ONESIGNAL_APP_ID');
    const ONESIGNAL_REST_API_KEY = Deno.env.get('ONESIGNAL_REST_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!ONESIGNAL_APP_ID || !ONESIGNAL_REST_API_KEY) {
      console.error('[Push] OneSignal credentials not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'OneSignal credentials not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    const body: NotificationRequest = await req.json();
    const { type, target_profile, target_user_id, title, message, data, created_by } = body;

    console.log('[Push] Received request:', { type, target_profile, target_user_id, title });

    // Validate required fields
    if (!type || !title || !message) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields: type, title, message' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create log entry
    const { data: logEntry, error: logError } = await supabase
      .from('push_notification_log')
      .insert({
        notification_type: type,
        target_profile: target_profile || null,
        target_user_id: target_user_id || null,
        title,
        message,
        data: data || {},
        created_by: created_by || null,
        status: 'pending'
      })
      .select('id')
      .single();

    if (logError) {
      console.error('[Push] Failed to create log entry:', logError);
    }

    const logId = logEntry?.id;

    // Get player IDs based on target
    let playerIds: string[] = [];

    if (target_user_id) {
      // Send to specific user
      console.log('[Push] Getting player IDs for user:', target_user_id);
      const { data: userPlayerIds, error } = await supabase
        .rpc('get_player_ids_for_user', { p_user_id: target_user_id });

      if (error) {
        console.error('[Push] Error getting user player IDs:', error);
      } else {
        playerIds = (userPlayerIds || []).map((r: { player_id: string }) => r.player_id);
      }
    } else if (target_profile) {
      // Send to users with children of target profile
      console.log('[Push] Getting player IDs for profile:', target_profile);
      const { data: profilePlayerIds, error } = await supabase
        .rpc('get_player_ids_by_profile', { target_profile });

      if (error) {
        console.error('[Push] Error getting profile player IDs:', error);
      } else {
        playerIds = (profilePlayerIds || []).map((r: { player_id: string }) => r.player_id);
      }
    } else {
      // Broadcast to all
      console.log('[Push] Getting all player IDs for broadcast');
      const { data: allPlayerIds, error } = await supabase
        .rpc('get_player_ids_by_profile', { target_profile: 'ALL' });

      if (error) {
        console.error('[Push] Error getting all player IDs:', error);
      } else {
        playerIds = (allPlayerIds || []).map((r: { player_id: string }) => r.player_id);
      }
    }

    console.log('[Push] Found player IDs:', playerIds.length);

    if (playerIds.length === 0) {
      // Update log with no recipients
      if (logId) {
        await supabase
          .from('push_notification_log')
          .update({
            status: 'sent',
            recipients_count: 0,
            sent_at: new Date().toISOString()
          })
          .eq('id', logId);
      }

      return new Response(
        JSON.stringify({ success: true, recipients: 0, message: 'No subscribed users found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Send notification via OneSignal
    const onesignalPayload = {
      app_id: ONESIGNAL_APP_ID,
      include_player_ids: playerIds,
      headings: { en: title },
      contents: { en: message },
      data: {
        type,
        target_profile,
        ...data
      }
    };

    console.log('[Push] Sending to OneSignal:', { recipients: playerIds.length });

    const onesignalResponse = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${ONESIGNAL_REST_API_KEY}`
      },
      body: JSON.stringify(onesignalPayload)
    });

    const onesignalData = await onesignalResponse.json();
    console.log('[Push] OneSignal response:', onesignalData);

    if (!onesignalResponse.ok) {
      const errorMessage = onesignalData.errors?.[0] || 'OneSignal API error';
      console.error('[Push] OneSignal error:', errorMessage);

      // Update log with failure
      if (logId) {
        await supabase
          .from('push_notification_log')
          .update({
            status: 'failed',
            error_message: errorMessage,
            sent_at: new Date().toISOString()
          })
          .eq('id', logId);
      }

      return new Response(
        JSON.stringify({ success: false, error: errorMessage }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update log with success
    if (logId) {
      await supabase
        .from('push_notification_log')
        .update({
          status: 'sent',
          recipients_count: onesignalData.recipients || playerIds.length,
          onesignal_notification_id: onesignalData.id,
          sent_at: new Date().toISOString()
        })
        .eq('id', logId);
    }

    // Also create in-app notifications for users
    if (type !== 'tracker_reminder') {
      console.log('[Push] Creating in-app notifications...');
      
      // Get user IDs from player IDs
      const { data: subscriptions } = await supabase
        .from('user_push_subscriptions')
        .select('user_id')
        .in('onesignal_player_id', playerIds)
        .eq('is_active', true);

      const uniqueUserIds = [...new Set((subscriptions || []).map(s => s.user_id))];

      // Create in-app notifications
      const notificationInserts = uniqueUserIds.map(userId => ({
        user_id: userId,
        type: type,
        type_enum: type === 'new_script' ? 'new_script' : 
                   type === 'new_content' ? 'new_content' : 
                   type === 'refund_update' ? 'refund_response' : null,
        title,
        message,
        read: false,
        link: data?.link || null
      }));

      if (notificationInserts.length > 0) {
        const { error: notifError } = await supabase
          .from('notifications')
          .insert(notificationInserts);

        if (notifError) {
          console.error('[Push] Error creating in-app notifications:', notifError);
        } else {
          console.log('[Push] Created in-app notifications:', notificationInserts.length);
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        notification_id: onesignalData.id,
        recipients: onesignalData.recipients || playerIds.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('[Push] Exception:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});