import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Welcome email HTML template
function getWelcomeEmailHTML(firstName: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to NEP System</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">🎉 Welcome to NEP System!</h1>
              <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">Your access is ready</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; color: #18181b; font-size: 18px; line-height: 1.6;">
                Hi ${firstName}! 👋
              </p>
              <p style="margin: 0 0 20px 0; color: #3f3f46; font-size: 16px; line-height: 1.6;">
                Thank you for joining the NEP System family! Your purchase has been confirmed and your account is ready to use.
              </p>
              <p style="margin: 0 0 30px 0; color: #3f3f46; font-size: 16px; line-height: 1.6;">
                NEP System gives you access to science-backed scripts and strategies to help your child thrive. Here's what you can do right now:
              </p>
              
              <!-- Features List -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 30px;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e4e4e7;">
                    <span style="color: #f97316; font-size: 18px; margin-right: 10px;">✓</span>
                    <span style="color: #3f3f46; font-size: 15px;">Access 70+ behavior scripts for any situation</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e4e4e7;">
                    <span style="color: #f97316; font-size: 18px; margin-right: 10px;">✓</span>
                    <span style="color: #3f3f46; font-size: 15px;">Track your child's progress with the 30-Day Challenge</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e4e4e7;">
                    <span style="color: #f97316; font-size: 18px; margin-right: 10px;">✓</span>
                    <span style="color: #3f3f46; font-size: 15px;">Read exclusive parenting guides and ebooks</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0;">
                    <span style="color: #f97316; font-size: 18px; margin-right: 10px;">✓</span>
                    <span style="color: #3f3f46; font-size: 15px;">Join our supportive parent community</span>
                  </td>
                </tr>
              </table>
              
              <!-- CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="https://nepsystem.vercel.app" style="display: inline-block; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-size: 18px; font-weight: 600; box-shadow: 0 4px 14px rgba(249, 115, 22, 0.4);">
                      Start Using NEP System →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #fafafa; padding: 30px; text-align: center; border-top: 1px solid #e4e4e7;">
              <p style="margin: 0 0 10px 0; color: #71717a; font-size: 14px;">
                Need help? Reply to this email or contact us at
              </p>
              <a href="mailto:support@nepsystem.pro" style="color: #f97316; text-decoration: none; font-weight: 500;">support@nepsystem.pro</a>
              <p style="margin: 20px 0 0 0; color: #a1a1aa; font-size: 12px;">
                © 2024 NEP System. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
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

  // 4 remaining buyers who hit rate limit
  const recipients = [
    { email: 'lovettsales@gmail.com', firstName: 'Patricia' },
    { email: 'shultzlk@aol.com', firstName: 'Linda' },
    { email: 'bbcakes53@yahoo.com', firstName: 'Gloria' },
    { email: 'gwftlaud@hotmail.com', firstName: 'Gwenn' },
  ];

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
          from: 'NEP System <support@nepsystem.pro>',
          to: [email],
          subject: 'Welcome to NEP System! 🎉 Your Access is Ready',
          html: getWelcomeEmailHTML(firstName),
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
