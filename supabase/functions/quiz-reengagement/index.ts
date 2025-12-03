import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Email template for quiz re-engagement
function getQuizReengagementEmailHTML(firstName: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Child's Profile is Waiting</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f7;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 48px 40px 24px; text-align: center; background: linear-gradient(135deg, #F97316 0%, #EA580C 100%); border-radius: 16px 16px 0 0;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff; line-height: 1.3;">
                🧠 You're 1 Quiz Away from Understanding Your Child's Brain
              </h1>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; font-size: 18px; color: #1a1a1a; line-height: 1.6;">
                Hi ${firstName || "there"},
              </p>
              
              <p style="margin: 0 0 24px; font-size: 16px; color: #4a4a4a; line-height: 1.7;">
                You created your NEP account but haven't completed the quick brain profile quiz yet.
              </p>
              
              <p style="margin: 0 0 24px; font-size: 16px; color: #4a4a4a; line-height: 1.7;">
                This 5-minute quiz is how we personalize everything for <strong>your specific child</strong>—the scripts, strategies, and content you'll see are all based on their unique profile.
              </p>
              
              <!-- Stats Box -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 32px 0;">
                <tr>
                  <td style="background: linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%); border-radius: 12px; padding: 24px; text-align: center;">
                    <p style="margin: 0 0 8px; font-size: 32px; font-weight: 700; color: #EA580C;">
                      847+
                    </p>
                    <p style="margin: 0; font-size: 14px; color: #9A3412; font-weight: 500;">
                      parents discovered their child's profile this week
                    </p>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 32px; font-size: 16px; color: #4a4a4a; line-height: 1.7;">
                Once you complete the quiz, you'll unlock:
              </p>
              
              <ul style="margin: 0 0 32px; padding-left: 24px; color: #4a4a4a; font-size: 16px; line-height: 2;">
                <li><strong>Personalized scripts</strong> matched to your child's brain profile</li>
                <li><strong>Age-appropriate strategies</strong> filtered for their developmental stage</li>
                <li><strong>Progress tracking</strong> to see your parenting transformation</li>
              </ul>
              
              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center">
                    <a href="https://nepsystem.vercel.app/quiz" style="display: inline-block; padding: 18px 48px; background: linear-gradient(135deg, #F97316 0%, #EA580C 100%); color: #ffffff; text-decoration: none; font-size: 18px; font-weight: 600; border-radius: 12px; box-shadow: 0 4px 16px rgba(249, 115, 22, 0.4);">
                      Complete Your Quiz Now →
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 32px 0 0; font-size: 14px; color: #9a9a9a; text-align: center;">
                Takes less than 5 minutes. Your personalized scripts are waiting.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #fafafa; border-radius: 0 0 16px 16px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #9a9a9a;">
                NEP - Obedience Language<br>
                <a href="mailto:support@nepsystem.pro" style="color: #F97316; text-decoration: none;">support@nepsystem.pro</a>
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
