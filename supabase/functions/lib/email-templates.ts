// Shared email templates for all Edge Functions
// Updated v5.0 - Account creation focus with /welcome link

export function getWelcomeEmailHTML(firstName: string): string {
  const safeFirstName = firstName || 'there';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Create Your Account - The Obedience Language</title>
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
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; }
      .mobile-padding { padding: 30px 20px !important; }
      .mobile-text { font-size: 16px !important; line-height: 26px !important; }
      .mobile-headline { font-size: 26px !important; line-height: 32px !important; }
      .mobile-btn { padding: 16px 32px !important; font-size: 16px !important; }
      .mobile-stack { display: block !important; width: 100% !important; padding: 0 !important; }
      .mobile-stack td { display: block !important; width: 100% !important; padding: 6px 0 !important; }
    }
  </style>
</head>
<body id="body" style="margin: 0; padding: 0; background-color: #0a0a0a; -webkit-font-smoothing: antialiased;">
  <div style="display: none; max-height: 0px; overflow: hidden;">
    ✓ Payment confirmed! Create your account to access your purchase.
    &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0a0a0a;">
    <tr>
      <td align="center" style="padding: 20px 10px;">
        <table role="presentation" class="container" cellpadding="0" cellspacing="0" width="560" style="max-width: 560px; background-color: #111111; border-radius: 16px; overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 50px 30px; text-align: center;">
              <div style="width: 70px; height: 70px; background-color: rgba(255,255,255,0.2); border-radius: 50%; margin: 0 auto 24px auto; line-height: 70px;">
                <span style="font-size: 36px; color: #ffffff;">✓</span>
              </div>
              <h1 class="mobile-headline" style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; line-height: 36px;">
                Payment Confirmed!
              </h1>
              <p style="color: rgba(255,255,255,0.95); margin: 14px 0 0 0; font-size: 17px; font-weight: 500;">
                One last step: Create your account below
              </p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td class="mobile-padding" style="padding: 40px 30px 24px 30px;">
              <p class="mobile-text" style="margin: 0 0 18px 0; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 17px; line-height: 28px;">
                Hey ${safeFirstName},
              </p>
              <p class="mobile-text" style="margin: 0 0 18px 0; color: #d4d4d8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 16px; line-height: 26px;">
                Thank you for purchasing The Obedience Language! Your payment was successful.
              </p>
              <p class="mobile-text" style="margin: 0; color: #d4d4d8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 16px; line-height: 26px;">
                <strong style="color: #ffffff;">To access your content, you need to create your account.</strong> It takes less than 60 seconds.
              </p>
            </td>
          </tr>

          <!-- Warning Box -->
          <tr>
            <td style="padding: 0 30px 24px 30px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="background-color: #fef3c7; border-radius: 12px; padding: 18px 20px; border-left: 4px solid #f59e0b;">
                    <p style="margin: 0; color: #92400e; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 15px; line-height: 24px; font-weight: 600;">
                      ⚠️ IMPORTANT: Use the same email you used for purchase
                    </p>
                    <p style="margin: 8px 0 0 0; color: #a16207; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 14px; line-height: 22px;">
                      If you use a different email, the system won't recognize your purchase.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Primary CTA -->
          <tr>
            <td align="center" style="padding: 0 30px 36px 30px;">
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

          <!-- Quick Start -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <h2 style="font-size: 18px; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; margin: 0 0 20px 0; font-weight: 700;">
                After creating your account:
              </h2>

              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 12px;">
                <tr>
                  <td style="background-color: #1a1a1a; border-radius: 12px; padding: 20px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td width="46" valign="top">
                          <div style="width: 36px; height: 36px; background: linear-gradient(135deg, #22c55e, #16a34a); border-radius: 50%; text-align: center; line-height: 36px; color: #fff; font-weight: 700; font-size: 15px;">1</div>
                        </td>
                        <td valign="top">
                          <p style="font-size: 16px; color: #ffffff; margin: 0 0 4px 0; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">Take the Brain Profile Quiz</p>
                          <p style="font-size: 14px; color: #a1a1aa; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">Discover your child's unique triggers (2 min)</p>
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
                          <div style="width: 36px; height: 36px; background: linear-gradient(135deg, #22c55e, #16a34a); border-radius: 50%; text-align: center; line-height: 36px; color: #fff; font-weight: 700; font-size: 15px;">2</div>
                        </td>
                        <td valign="top">
                          <p style="font-size: 16px; color: #ffffff; margin: 0 0 4px 0; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">Pick Your First Script</p>
                          <p style="font-size: 14px; color: #a1a1aa; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">Bedtime? Tantrums? Start with your #1 struggle</p>
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
                          <div style="width: 36px; height: 36px; background: linear-gradient(135deg, #22c55e, #16a34a); border-radius: 50%; text-align: center; line-height: 36px; color: #fff; font-weight: 700; font-size: 15px;">3</div>
                        </td>
                        <td valign="top">
                          <p style="font-size: 16px; color: #ffffff; margin: 0 0 4px 0; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">Use It Tonight</p>
                          <p style="font-size: 14px; color: #a1a1aa; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">See your child respond the first time</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- What's Included -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <h2 style="font-size: 18px; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; margin: 0 0 16px 0; font-weight: 700;">
                What's waiting for you:
              </h2>

              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="background-color: #1a1a1a; border-radius: 10px; padding: 16px 18px; border-left: 3px solid #22c55e;">
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td width="36" valign="middle"><span style="font-size: 22px;">📝</span></td>
                        <td valign="middle">
                          <p style="font-size: 15px; color: #ffffff; margin: 0 0 2px 0; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">Complete Scripts Library</p>
                          <p style="font-size: 13px; color: #71717a; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">Word-for-word phrases for every situation</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 10px;">
                <tr>
                  <td style="background-color: #1a1a1a; border-radius: 10px; padding: 16px 18px; border-left: 3px solid #a855f7;">
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td width="36" valign="middle"><span style="font-size: 22px;">🎧</span></td>
                        <td valign="middle">
                          <p style="font-size: 15px; color: #ffffff; margin: 0 0 2px 0; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">Audio Collection</p>
                          <p style="font-size: 13px; color: #71717a; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">Listen while you drive or cook</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 10px;">
                <tr>
                  <td style="background-color: #1a1a1a; border-radius: 10px; padding: 16px 18px; border-left: 3px solid #8b5cf6;">
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td width="36" valign="middle"><span style="font-size: 22px;">🎬</span></td>
                        <td valign="middle">
                          <p style="font-size: 15px; color: #ffffff; margin: 0 0 2px 0; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">Video Training + Bonuses</p>
                          <p style="font-size: 13px; color: #71717a; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">SmartKid, Siblings & more</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Second CTA -->
          <tr>
            <td align="center" style="padding: 0 30px 36px 30px;">
              <a href="https://nepsystem.vercel.app/welcome" target="_blank" style="display: inline-block; padding: 16px 40px; color: #ffffff; background-color: #27272a; border-radius: 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 16px; font-weight: 600; text-decoration: none;">
                Create My Account
              </a>
            </td>
          </tr>

          <!-- Support -->
          <tr>
            <td style="padding: 0 30px 40px 30px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="background-color: #1a1a1a; border-radius: 12px; padding: 24px; text-align: center;">
                    <p style="font-size: 16px; color: #ffffff; margin: 0 0 6px 0; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
                      Questions? We're Here to Help
                    </p>
                    <p style="font-size: 14px; color: #a1a1aa; margin: 0 0 20px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
                      Real humans. Real fast.
                    </p>
                    <table role="presentation" class="mobile-stack" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td width="50%" style="padding-right: 6px;">
                          <a href="https://wa.me/27617525578?text=Hi!%20I%20need%20help%20creating%20my%20account" target="_blank" style="display: block; background-color: #22c55e; color: #ffffff; text-decoration: none; padding: 14px 16px; border-radius: 10px; font-size: 15px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
                            WhatsApp
                          </a>
                        </td>
                        <td width="50%" style="padding-left: 6px;">
                          <a href="mailto:support@nepsystem.pro" target="_blank" style="display: block; background-color: #3b82f6; color: #ffffff; text-decoration: none; padding: 14px 16px; border-radius: 10px; font-size: 15px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
                            Email Us
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0a0a0a; padding: 28px 30px; text-align: center; border-top: 1px solid #1f1f1f;">
              <p style="color: #52525b; font-size: 13px; margin: 0 0 12px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
                Made with care for parents who refuse to give up
              </p>
              <p style="color: #3f3f46; font-size: 12px; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
                © 2025 The Obedience Language<br>
                <a href="mailto:unsubscribe@nepsystem.pro" style="color: #3f3f46;">Unsubscribe</a>
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
