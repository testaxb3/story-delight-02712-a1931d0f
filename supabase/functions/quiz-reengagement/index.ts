import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Clean Anti-Spam Email Template for Quiz Re-engagement
function getQuizReengagementEmailHTML(firstName: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Complete Your Quiz</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f7;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 500px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 32px 32px 24px; text-align: center; border-bottom: 1px solid #f0f0f0;">
              <h1 style="margin: 0; font-size: 20px; font-weight: 600; color: #1a1a1a;">
                Complete Your Profile Quiz
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 16px; font-size: 15px; color: #1a1a1a; line-height: 1.6;">
                Hi${firstName ? ` ${firstName}` : ''},
              </p>
              
              <p style="margin: 0 0 24px; font-size: 15px; color: #4a4a4a; line-height: 1.6;">
                You created your NEP account but haven't completed the quick brain profile quiz yet. This 5-minute quiz personalizes all scripts and strategies for your specific child.
              </p>
              
              <!-- Benefits -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 0 0 24px;">
                <tr>
                  <td style="padding: 16px; background-color: #fafafa; border-radius: 8px;">
                    <p style="margin: 0 0 8px; font-size: 14px; color: #1a1a1a; font-weight: 500;">After the quiz you unlock:</p>
                    <p style="margin: 0; font-size: 14px; color: #666; line-height: 1.8;">
                      ✓ Personalized scripts for your child's brain profile<br>
                      ✓ Age-appropriate strategies<br>
                      ✓ Progress tracking
                    </p>
                  </td>
                </tr>
              </table>
              
              <!-- CTA -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center">
                    <a href="https://nepsystem.vercel.app/quiz" style="display: inline-block; padding: 14px 32px; background-color: #f97316; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; border-radius: 8px;">
                      Complete Quiz Now
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 24px 0 0; font-size: 13px; color: #999; text-align: center;">
                Takes less than 5 minutes
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #fafafa; border-radius: 0 0 12px 12px; text-align: center; border-top: 1px solid #f0f0f0;">
              <p style="margin: 0; font-size: 12px; color: #999;">
                NEP - Obedience Language
              </p>
              <p style="margin: 8px 0 0; font-size: 12px;">
                <a href="mailto:support@nepsystem.pro" style="color: #f97316; text-decoration: none;">support@nepsystem.pro</a>
              </p>
              <p style="margin: 12px 0 0; font-size: 11px; color: #ccc;">
                <a href="mailto:unsubscribe@nepsystem.pro?subject=Unsubscribe" style="color: #999; text-decoration: underline;">Unsubscribe</a>
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

// Send email via Resend API
async function sendEmailViaResend(
  to: string,
  subject: string,
  html: string
): Promise<{ success: boolean; id?: string; error?: string }> {
  const resendApiKey = Deno.env.get("RESEND_API_KEY");

  if (!resendApiKey) {
    return { success: false, error: "RESEND_API_KEY not configured" };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "NEP System <support@nepsystem.pro>",
        to: [to],
        subject,
        html,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, error: JSON.stringify(result) };
    }

    return { success: true, id: result.id };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("🔵 [quiz-reengagement] Starting re-engagement email job");

    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body for email type (default: 24h)
    let emailType = "quiz_reminder_24h";
    let hoursThreshold = 24;

    try {
      const body = await req.json();
      if (body.type === "48h") {
        emailType = "quiz_reminder_48h";
        hoursThreshold = 48;
      } else if (body.type === "72h") {
        emailType = "quiz_reminder_72h";
        hoursThreshold = 72;
      }
    } catch {
      // Use defaults if no body
    }

    console.log(`🔵 [quiz-reengagement] Running ${emailType} check (${hoursThreshold}h threshold)`);

    // Query users who:
    // 1. Have quiz_completed = false
    // 2. Created account more than X hours ago
    // 3. Haven't received this email type yet
    const thresholdTime = new Date(Date.now() - hoursThreshold * 60 * 60 * 1000).toISOString();

    const { data: eligibleUsers, error: queryError } = await supabase
      .from("profiles")
      .select(`
        id,
        name,
        email,
        quiz_completed,
        created_at
      `)
      .eq("quiz_completed", false)
      .lt("created_at", thresholdTime)
      .not("email", "is", null);

    if (queryError) {
      console.error("❌ [quiz-reengagement] Query error:", queryError);
      throw queryError;
    }

    console.log(`🔵 [quiz-reengagement] Found ${eligibleUsers?.length || 0} users with incomplete quiz`);

    if (!eligibleUsers || eligibleUsers.length === 0) {
      return new Response(
        JSON.stringify({ success: true, sent: 0, message: "No eligible users found" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Filter out users who already received this email type
    const userIds = eligibleUsers.map((u) => u.id);
    const { data: alreadySent } = await supabase
      .from("email_tracking")
      .select("user_id")
      .eq("email_type", emailType)
      .in("user_id", userIds);

    const alreadySentIds = new Set(alreadySent?.map((e) => e.user_id) || []);
    const usersToEmail = eligibleUsers.filter((u) => !alreadySentIds.has(u.id));

    console.log(`🔵 [quiz-reengagement] ${usersToEmail.length} users to email (${alreadySentIds.size} already received)`);

    if (usersToEmail.length === 0) {
      return new Response(
        JSON.stringify({ success: true, sent: 0, message: "All eligible users already received email" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Send emails and track
    let sentCount = 0;
    const errors: string[] = [];

    for (const user of usersToEmail) {
      try {
        // Skip test emails
        if (user.email?.includes("test") || user.email?.includes("gabriel")) {
          console.log(`⏭️ [quiz-reengagement] Skipping test email: ${user.email}`);
          continue;
        }

        const firstName = user.name?.split(" ")[0] || "";

        // Send email via Resend
        const emailResult = await sendEmailViaResend(
          user.email!,
          "🧠 Your child's brain profile is waiting...",
          getQuizReengagementEmailHTML(firstName)
        );

        if (!emailResult.success) {
          throw new Error(emailResult.error);
        }

        console.log(`✅ [quiz-reengagement] Email sent to ${user.email}, ID: ${emailResult.id}`);

        // Track the sent email
        const { error: trackError } = await supabase.from("email_tracking").insert({
          user_id: user.id,
          email: user.email,
          email_type: emailType,
          status: "sent",
          metadata: { resend_id: emailResult.id },
        });

        if (trackError) {
          console.error(`⚠️ [quiz-reengagement] Failed to track email for ${user.email}:`, trackError);
        }

        sentCount++;

        // Rate limit: 600ms between emails
        await new Promise((resolve) => setTimeout(resolve, 600));
      } catch (emailError) {
        const errorMsg = `Failed to send to ${user.email}: ${emailError}`;
        console.error(`❌ [quiz-reengagement] ${errorMsg}`);
        errors.push(errorMsg);
      }
    }

    console.log(`✅ [quiz-reengagement] Job complete. Sent: ${sentCount}, Errors: ${errors.length}`);

    return new Response(
      JSON.stringify({
        success: true,
        sent: sentCount,
        errors: errors.length > 0 ? errors : undefined,
        emailType,
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error) {
    console.error("❌ [quiz-reengagement] Fatal error:", error);
    return new Response(JSON.stringify({ success: false, error: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
