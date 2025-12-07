import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Reminder email template - More urgent than welcome email
function getReminderEmailHTML(firstName: string, reminderNumber: number): string {
  const safeFirstName = firstName || 'there';
  
  const headlines = {
    1: "You Haven't Activated Your Account Yet",
    2: "Your Purchase is Waiting for You",
    3: "Last Reminder: Don't Lose Your Access"
  };
  
  const urgencyTexts = {
    1: "It's been 24 hours since you purchased The Obedience Language, but you haven't created your account yet.",
    2: "It's been 3 days and your content is still waiting. Other parents are already seeing results with their scripts.",
    3: "This is your final reminder. Your purchase gives you lifetime access, but you need to create an account to use it."
  };

  const headline = headlines[reminderNumber as 1 | 2 | 3] || headlines[1];
  const urgencyText = urgencyTexts[reminderNumber as 1 | 2 | 3] || urgencyTexts[1];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Complete Your Account Setup</title>
  <style>
    body, table, td, p, a, li { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    body { margin: 0 !important; padding: 0 !important; width: 100% !important; }
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; }
      .mobile-padding { padding: 30px 20px !important; }
      .mobile-btn { padding: 16px 32px !important; font-size: 16px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a;">
  <div style="display: none; max-height: 0px; overflow: hidden;">
    ⚠️ Action required: Create your account to access your purchase
  </div>
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0a0a0a;">
    <tr>
      <td align="center" style="padding: 20px 10px;">
        <table role="presentation" class="container" cellpadding="0" cellspacing="0" width="560" style="max-width: 560px; background-color: #111111; border-radius: 16px; overflow: hidden;">
          
          <!-- Warning Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 30px; text-align: center;">
              <div style="width: 60px; height: 60px; background-color: rgba(255,255,255,0.2); border-radius: 50%; margin: 0 auto 20px auto; line-height: 60px;">
                <span style="font-size: 30px; color: #ffffff;">⚠️</span>
              </div>
              <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 700; line-height: 34px;">
                ${headline}
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td class="mobile-padding" style="padding: 40px 30px;">
              <p style="margin: 0 0 18px 0; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 17px; line-height: 28px;">
                Hey ${safeFirstName},
              </p>
              <p style="margin: 0 0 18px 0; color: #d4d4d8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 16px; line-height: 26px;">
                ${urgencyText}
              </p>
              
              <!-- Warning Box -->
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin: 24px 0;">
                <tr>
                  <td style="background-color: #fef3c7; border-radius: 12px; padding: 20px; border-left: 4px solid #f59e0b;">
                    <p style="margin: 0; color: #92400e; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 15px; line-height: 24px; font-weight: 600;">
                      ⚠️ IMPORTANT: Use the same email you used for purchase
                    </p>
                    <p style="margin: 8px 0 0 0; color: #a16207; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 14px; line-height: 22px;">
                      If you use a different email, the system won't recognize your purchase.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 24px 0; color: #d4d4d8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 16px; line-height: 26px;">
                It takes less than 60 seconds:
              </p>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td align="center" style="padding: 0 30px 40px 30px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="border-radius: 12px; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); box-shadow: 0 8px 24px rgba(34, 197, 94, 0.35);">
                    <a href="https://nepsystem.vercel.app/welcome" target="_blank" class="mobile-btn" style="display: inline-block; padding: 20px 56px; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 18px; font-weight: 700; text-decoration: none; letter-spacing: 0.5px;">
                      Create My Account Now →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- What You're Missing -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <p style="font-size: 16px; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; margin: 0 0 16px 0; font-weight: 600;">
                What you're missing right now:
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="padding: 8px 0; color: #a1a1aa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 15px;">
                    ❌ Scripts that work tonight for bedtime battles
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #a1a1aa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 15px;">
                    ❌ Audio you can listen to while driving
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #a1a1aa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 15px;">
                    ❌ Video training for tough situations
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #a1a1aa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 15px;">
                    ❌ Progress tracker to see your growth
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Second CTA -->
          <tr>
            <td align="center" style="padding: 0 30px 40px 30px;">
              <a href="https://nepsystem.vercel.app/welcome" target="_blank" style="display: inline-block; padding: 16px 40px; color: #ffffff; background-color: #27272a; border-radius: 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 16px; font-weight: 600; text-decoration: none;">
                Activate My Account
              </a>
            </td>
          </tr>

          <!-- Support -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="background-color: #1a1a1a; border-radius: 12px; padding: 20px; text-align: center;">
                    <p style="font-size: 15px; color: #ffffff; margin: 0 0 12px 0; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
                      Having trouble? We'll help you.
                    </p>
                    <a href="https://wa.me/27617525578?text=Hi!%20I%20purchased%20but%20can't%20create%20my%20account" target="_blank" style="display: inline-block; background-color: #22c55e; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
                      Chat on WhatsApp
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0a0a0a; padding: 24px 30px; text-align: center; border-top: 1px solid #1f1f1f;">
              <p style="color: #52525b; font-size: 12px; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
                You received this because you purchased The Obedience Language.<br>
                <a href="mailto:unsubscribe@nepsystem.pro" style="color: #52525b;">Unsubscribe</a>
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

// Calculate which reminder to send based on time since purchase
function getReminderNumber(approvedAt: string, reminderCount: number): number | null {
  const now = new Date();
  const approved = new Date(approvedAt);
  const hoursSinceApproval = (now.getTime() - approved.getTime()) / (1000 * 60 * 60);
  
  // Already sent all reminders
  if (reminderCount >= 3) return null;
  
  // Reminder 1: After 24 hours (if not sent yet)
  if (reminderCount === 0 && hoursSinceApproval >= 24) return 1;
  
  // Reminder 2: After 72 hours (if reminder 1 already sent)
  if (reminderCount === 1 && hoursSinceApproval >= 72) return 2;
  
  // Reminder 3: After 168 hours / 7 days (if reminder 2 already sent)
  if (reminderCount === 2 && hoursSinceApproval >= 168) return 3;
  
  return null;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const resendApiKey = Deno.env.get('RESEND_API_KEY');
  
  if (!resendApiKey) {
    console.error('❌ RESEND_API_KEY not configured');
    return new Response(JSON.stringify({ error: 'RESEND_API_KEY not configured' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  console.log('🔔 Starting reminder check for uncreated accounts...');

  // Fetch users who:
  // - Haven't created account
  // - Status is active
  // - Approved more than 24 hours ago
  // - Reminder count < 3
  // - Exclude test emails
  const { data: pendingUsers, error: fetchError } = await supabase
    .from('approved_users')
    .select('id, email, first_name, approved_at, reminder_count')
    .eq('account_created', false)
    .eq('status', 'active')
    .lt('reminder_count', 3)
    .not('email', 'ilike', '%test%')
    .not('email', 'ilike', '%lovable%')
    .order('approved_at', { ascending: true });

  if (fetchError) {
    console.error('❌ Error fetching pending users:', fetchError);
    return new Response(JSON.stringify({ error: fetchError.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  console.log(`📋 Found ${pendingUsers?.length || 0} users without accounts`);

  if (!pendingUsers || pendingUsers.length === 0) {
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'No pending reminders to send',
      sent: 0 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const results = [];
  let sentCount = 0;

  for (const user of pendingUsers) {
    const reminderNumber = getReminderNumber(user.approved_at, user.reminder_count || 0);
    
    if (!reminderNumber) {
      console.log(`⏳ ${user.email}: Not time for next reminder yet`);
      continue;
    }

    console.log(`📤 Sending reminder #${reminderNumber} to: ${user.email}`);

    const subjects = {
      1: `${user.first_name || 'Hey'}, you haven't activated your account yet`,
      2: `${user.first_name || 'Hey'}, your purchase is still waiting`,
      3: `⚠️ Final reminder: Activate your account, ${user.first_name || 'friend'}`
    };

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'The Obedience Language <support@nepsystem.pro>',
          to: [user.email],
          reply_to: 'support@nepsystem.pro',
          subject: subjects[reminderNumber as 1 | 2 | 3],
          html: getReminderEmailHTML(user.first_name || '', reminderNumber),
          headers: {
            'List-Unsubscribe': '<mailto:unsubscribe@nepsystem.pro>',
            'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
            'X-Priority': '3',
          },
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Update reminder count
        await supabase
          .from('approved_users')
          .update({ 
            reminder_count: reminderNumber,
            last_reminder_at: new Date().toISOString()
          })
          .eq('id', user.id);

        console.log(`✅ Reminder #${reminderNumber} sent to ${user.email}`);
        results.push({ email: user.email, reminderNumber, success: true });
        sentCount++;
      } else {
        console.error(`❌ Failed to send to ${user.email}:`, result);
        results.push({ email: user.email, reminderNumber, success: false, error: result });
      }
    } catch (error) {
      console.error(`❌ Error sending to ${user.email}:`, error);
      results.push({ email: user.email, reminderNumber, success: false, error: String(error) });
    }

    // Rate limiting: wait 500ms between emails
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`📧 Reminder job complete: ${sentCount} emails sent`);

  return new Response(JSON.stringify({ 
    success: true,
    sent: sentCount,
    total_pending: pendingUsers.length,
    results 
  }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
