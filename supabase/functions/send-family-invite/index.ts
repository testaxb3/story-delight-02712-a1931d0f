import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface FamilyInviteRequest {
  partner_email: string;
  invite_code: string;
  owner_name: string;
}

function getFamilyInviteEmailHTML(ownerName: string, inviteCode: string, joinUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Family Access Invitation</title>
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
            <td style="padding: 32px 32px 24px; text-align: center; border-bottom: 1px solid #f0f0f0;">
              <div style="font-size: 48px; margin-bottom: 16px;">👨‍👩‍👧</div>
              <h1 style="margin: 0; font-size: 22px; font-weight: 600; color: #111827;">
                Family Access Invitation
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 20px; font-size: 15px; line-height: 1.6; color: #374151;">
                <strong>${ownerName}</strong> has invited you to share access to their children's profiles and tracker data on NEP System.
              </p>

              <!-- Invite Code Box -->
              <div style="background-color: #fff7ed; border: 2px dashed #f97316; border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0;">
                <p style="margin: 0 0 8px; font-size: 13px; color: #9a3412; font-weight: 500;">
                  Your Invite Code
                </p>
                <p style="margin: 0; font-size: 28px; font-weight: 700; color: #c2410c; letter-spacing: 4px; font-family: monospace;">
                  ${inviteCode}
                </p>
              </div>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 28px 0;">
                <a href="${joinUrl}" style="display: inline-block; padding: 14px 28px; background-color: #f97316; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; border-radius: 8px;">
                  Accept Invitation
                </a>
              </div>

              <!-- Instructions -->
              <div style="background-color: #f9fafb; border-radius: 6px; padding: 16px; margin-top: 24px;">
                <p style="margin: 0 0 12px; font-size: 14px; font-weight: 600; color: #111827;">
                  How to join:
                </p>
                <ol style="margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.8; color: #4b5563;">
                  <li>Click the button above or go to the app</li>
                  <li>Create an account using <strong>this email address</strong></li>
                  <li>Enter the invite code when prompted</li>
                </ol>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; border-top: 1px solid #f0f0f0; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                If you didn't expect this invitation, you can safely ignore this email.
              </p>
              <p style="margin: 12px 0 0; font-size: 12px; color: #9ca3af;">
                NEP System - The Obedience Language
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

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  if (!resendApiKey) {
    console.error("RESEND_API_KEY not configured");
    return new Response(
      JSON.stringify({ success: false, error: "Email service not configured" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  try {
    const { partner_email, invite_code, owner_name }: FamilyInviteRequest = await req.json();

    console.log(`📧 Sending family invite email to ${partner_email} from ${owner_name}`);

    const joinUrl = `https://nepsystem.vercel.app/join-family?code=${invite_code}`;
    const emailHtml = getFamilyInviteEmailHTML(owner_name, invite_code, joinUrl);

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "NEP System <support@nepsystem.pro>",
        to: [partner_email],
        reply_to: "support@nepsystem.pro",
        subject: `${owner_name} invited you to join their family`,
        html: emailHtml,
        headers: {
          "List-Unsubscribe": "<mailto:unsubscribe@nepsystem.pro>",
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
          "X-Priority": "3",
        },
      }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error("❌ Failed to send family invite email:", result);
      return new Response(
        JSON.stringify({ success: false, error: result.message || "Failed to send email" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("✅ Family invite email sent successfully:", result);

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("❌ Error sending family invite email:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
