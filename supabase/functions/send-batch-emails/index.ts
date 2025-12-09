import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const resendApiKey = Deno.env.get('RESEND_API_KEY');
  
  if (!resendApiKey) {
    return new Response(JSON.stringify({ error: 'RESEND_API_KEY not configured' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  let recipients: { email: string; firstName: string }[] = [];
  
  try {
    const body = await req.json();
    if (body.recipients && Array.isArray(body.recipients)) {
      recipients = body.recipients;
    }
  } catch {
    return new Response(JSON.stringify({ error: 'No recipients provided. Send { recipients: [{ email, firstName }] }' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  if (recipients.length === 0) {
    return new Response(JSON.stringify({ error: 'Recipients array is empty' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  console.log(`📧 Starting batch email send to ${recipients.length} recipients...`);

  const results = [];
  
  for (const { email, firstName } of recipients) {
    console.log(`📤 Sending to: ${email}`);
    
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
          subject: `${firstName || 'Hey'}, create your account to access your purchase`,
          html: getWelcomeEmailHTML(firstName),
          headers: {
            'List-Unsubscribe': '<mailto:unsubscribe@nepsystem.pro>',
            'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
            'X-Priority': '3',
          },
        }),
      });

      const result = await response.json();
      const success = response.ok;
      
      results.push({ email, firstName, success, result });
      console.log(success ? `✅ Sent to ${email}` : `❌ Failed: ${email} - ${JSON.stringify(result)}`);
      
      // Rate limiting: 600ms between emails (Resend allows 2/sec)
      await new Promise(r => setTimeout(r, 600));
    } catch (error) {
      console.error(`❌ Error sending to ${email}:`, error);
      results.push({ email, firstName, success: false, error: String(error) });
    }
  }

  const successCount = results.filter(r => r.success).length;
  console.log(`📊 Batch complete: ${successCount}/${recipients.length} emails sent`);

  return new Response(JSON.stringify({ 
    total: recipients.length,
    success: successCount,
    failed: recipients.length - successCount,
    results 
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
