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

// Welcome email HTML template - Premium v4.0
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
                Payment Confirmed! ✓
              </h1>
              <p style="color: rgba(255,255,255,0.95); margin: 14px 0 0 0; font-size: 17px; font-weight: 400;">
                One last step: Create your account below
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
                    <a href="https://nepsystem.vercel.app/welcome" target="_blank" class="mobile-btn" style="display: inline-block; padding: 18px 48px; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 18px; font-weight: 700; text-decoration: none; letter-spacing: 0.5px;">
                      Create My Account Now →
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
                          <p style="font-size: 14px; color: #a1a1aa; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">Start with your #1 frustration (bedtime, tantrums, etc.)</p>
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
                Everything You Get:
              </h2>

              <a href="https://nepsystem.vercel.app/scripts" target="_blank" style="display: block; background-color: #1a1a1a; border-radius: 10px; padding: 16px 18px; text-decoration: none; margin-bottom: 10px; border-left: 3px solid #ec4899;">
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td width="36" valign="middle">
                      <span style="font-size: 22px;">&#128221;</span>
                    </td>
                    <td valign="middle">
                      <p style="font-size: 15px; color: #ffffff; margin: 0 0 2px 0; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">Scripts Library</p>
                      <p style="font-size: 13px; color: #71717a; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">200+ word-for-word phrases</p>
                    </td>
                    <td width="24" valign="middle" align="right">
                      <span style="color: #71717a; font-size: 18px;">&#8250;</span>
                    </td>
                  </tr>
                </table>
              </a>

              <a href="https://nepsystem.vercel.app/listen" target="_blank" style="display: block; background-color: #1a1a1a; border-radius: 10px; padding: 16px 18px; text-decoration: none; margin-bottom: 10px; border-left: 3px solid #a855f7;">
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td width="36" valign="middle">
                      <span style="font-size: 22px;">&#127911;</span>
                    </td>
                    <td valign="middle">
                      <p style="font-size: 15px; color: #ffffff; margin: 0 0 2px 0; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">Audio Collection</p>
                      <p style="font-size: 13px; color: #71717a; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">Listen while you drive or cook</p>
                    </td>
                    <td width="24" valign="middle" align="right">
                      <span style="color: #71717a; font-size: 18px;">&#8250;</span>
                    </td>
                  </tr>
                </table>
              </a>

              <a href="https://nepsystem.vercel.app/bonuses" target="_blank" style="display: block; background-color: #1a1a1a; border-radius: 10px; padding: 16px 18px; text-decoration: none; margin-bottom: 10px; border-left: 3px solid #8b5cf6;">
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td width="36" valign="middle">
                      <span style="font-size: 22px;">&#127916;</span>
                    </td>
                    <td valign="middle">
                      <p style="font-size: 15px; color: #ffffff; margin: 0 0 2px 0; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">Video Training + Bonuses</p>
                      <p style="font-size: 13px; color: #71717a; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">SmartKid, Siblings & more ($335 value)</p>
                    </td>
                    <td width="24" valign="middle" align="right">
                      <span style="color: #71717a; font-size: 18px;">&#8250;</span>
                    </td>
                  </tr>
                </table>
              </a>

              <a href="https://nepsystem.vercel.app/tracker" target="_blank" style="display: block; background-color: #1a1a1a; border-radius: 10px; padding: 16px 18px; text-decoration: none; margin-bottom: 10px; border-left: 3px solid #22c55e;">
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td width="36" valign="middle">
                      <span style="font-size: 22px;">&#128200;</span>
                    </td>
                    <td valign="middle">
                      <p style="font-size: 15px; color: #ffffff; margin: 0 0 2px 0; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">Progress Tracker</p>
                      <p style="font-size: 13px; color: #71717a; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">Build streaks & see your growth</p>
                    </td>
                    <td width="24" valign="middle" align="right">
                      <span style="color: #71717a; font-size: 18px;">&#8250;</span>
                    </td>
                  </tr>
                </table>
              </a>

              <a href="https://nepsystem.vercel.app/achievements" target="_blank" style="display: block; background-color: #1a1a1a; border-radius: 10px; padding: 16px 18px; text-decoration: none; border-left: 3px solid #f59e0b;">
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td width="36" valign="middle">
                      <span style="font-size: 22px;">&#127942;</span>
                    </td>
                    <td valign="middle">
                      <p style="font-size: 15px; color: #ffffff; margin: 0 0 2px 0; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">Achievements</p>
                      <p style="font-size: 13px; color: #71717a; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">Unlock badges as you level up</p>
                    </td>
                    <td width="24" valign="middle" align="right">
                      <span style="color: #71717a; font-size: 18px;">&#8250;</span>
                    </td>
                  </tr>
                </table>
              </a>
            </td>
          </tr>

          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="background: linear-gradient(135deg, rgba(236,72,153,0.15) 0%, rgba(168,85,247,0.15) 100%); border: 1px solid rgba(168,85,247,0.3); border-radius: 12px; padding: 24px; text-align: center;">
                    <p style="font-size: 28px; margin: 0 0 12px 0;">&#128170;</p>
                    <p style="font-size: 15px; color: #ffffff; margin: 0 0 8px 0; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
                      30-Day Money-Back Guarantee
                    </p>
                    <p style="font-size: 14px; color: #a1a1aa; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; line-height: 22px;">
                      Try it risk-free. If it doesn't work for your family, get a full refund. No questions asked.
                    </p>
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
                      Questions? We've Got You.
                    </p>
                    <p style="font-size: 14px; color: #a1a1aa; margin: 0 0 20px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
                      Real humans. Real fast.
                    </p>

                    <table role="presentation" class="mobile-stack" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td width="50%" style="padding-right: 6px;">
                          <a href="https://wa.me/27617525578?text=Hi!%20I%20need%20help%20with%20The%20Obedience%20Language" target="_blank" style="display: block; background-color: #22c55e; color: #ffffff; text-decoration: none; padding: 14px 16px; border-radius: 10px; font-size: 15px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
                            &#128172; WhatsApp
                          </a>
                        </td>
                        <td width="50%" style="padding-left: 6px;">
                          <a href="mailto:support@nepsystem.pro" target="_blank" style="display: block; background-color: #3b82f6; color: #ffffff; text-decoration: none; padding: 14px 16px; border-radius: 10px; font-size: 15px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
                            &#9993; Email Us
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
                Made with &#10084; for parents who refuse to give up
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