import { MainLayout } from "@/components/Layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Shield, Lock, Eye, Database, Users, Mail, Download } from "lucide-react";

export default function Privacy() {
  return (
    <MainLayout hideBottomNav={true}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Privacy Policy</h1>
          <p className="text-muted-foreground">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>

        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Your privacy is important to us. This policy explains how we collect, use, protect, and share your personal information when you use NEP System.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              1. Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">1.1 Account Information</h4>
              <p className="text-muted-foreground leading-relaxed">
                When you create an account, we collect:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Name and email address</li>
                <li>Profile photo (optional)</li>
                <li>Authentication data (managed securely by Supabase)</li>
                <li>Account creation date and last login</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">1.2 Child Profile Information</h4>
              <p className="text-muted-foreground leading-relaxed">
                To personalize recommendations, you may provide:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Child's first name (or nickname)</li>
                <li>Age range</li>
                <li>Brain profile type (INTENSE, DEFIANT, DISTRACTED, UNIVERSAL)</li>
                <li>Behavioral notes (optional)</li>
                <li>Profile photo (optional)</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed text-sm italic">
                Note: We encourage using nicknames rather than full names for privacy.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">1.3 Usage Data</h4>
              <p className="text-muted-foreground leading-relaxed">
                We automatically collect information about how you use NEP System:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Scripts viewed and marked as favorites</li>
                <li>Videos watched and progress</li>
                <li>Ebooks read and bookmarks</li>
                <li>Quiz responses and completion status</li>
                <li>Community posts, comments, and reactions</li>
                <li>Daily tracking data and streaks</li>
                <li>Script feedback and ratings</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">1.4 Technical Information</h4>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Device type, operating system, and browser</li>
                <li>IP address and general location (country/region)</li>
                <li>Session duration and app interactions</li>
                <li>Error logs and performance data</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              2. How We Use Your Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              We use collected information to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li><strong>Provide personalized content:</strong> Recommend scripts, videos, and resources based on your child's brain profile and behavior patterns</li>
              <li><strong>Improve our service:</strong> Analyze usage patterns to enhance features and create better content</li>
              <li><strong>Communicate with you:</strong> Send important updates, new content notifications, and respond to support requests</li>
              <li><strong>Maintain security:</strong> Detect and prevent fraud, abuse, and unauthorized access</li>
              <li><strong>Provide customer support:</strong> Troubleshoot issues and respond to refund requests</li>
              <li><strong>Ensure compliance:</strong> Meet legal obligations and enforce our Terms of Service</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              3. Information Sharing and Third Parties
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription className="font-semibold">
                We DO NOT sell your personal information to third parties.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">We share limited data with:</h4>
              
              <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                <div>
                  <p className="font-semibold text-foreground">Supabase (Database & Authentication)</p>
                  <p className="text-sm text-muted-foreground">Hosts our database and manages secure authentication. SOC 2 Type II certified.</p>
                </div>
                
                <div>
                  <p className="font-semibold text-foreground">Sentry (Error Tracking)</p>
                  <p className="text-sm text-muted-foreground">Receives anonymized error logs to help us fix bugs and improve stability.</p>
                </div>
                
                <div>
                  <p className="font-semibold text-foreground">PostHog (Analytics)</p>
                  <p className="text-sm text-muted-foreground">Tracks anonymous usage patterns to understand how features are used.</p>
                </div>
                
                <div>
                  <p className="font-semibold text-foreground">OneSignal (Push Notifications)</p>
                  <p className="text-sm text-muted-foreground">Delivers notifications about new content and updates (only if you opt in).</p>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed text-sm">
                All third-party services are carefully vetted and contractually required to protect your data.
              </p>
            </div>
          </CardContent>
        </Card>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="security">
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                4. Data Security
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <p className="text-muted-foreground leading-relaxed">
                We implement industry-standard security measures to protect your information:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li><strong>Encryption:</strong> All data is encrypted in transit (SSL/TLS) and at rest</li>
                <li><strong>Row-Level Security (RLS):</strong> Database policies ensure users can only access their own data</li>
                <li><strong>Authentication:</strong> Secure password hashing and session management via Supabase Auth</li>
                <li><strong>Regular backups:</strong> Automated daily backups to prevent data loss</li>
                <li><strong>Monitoring:</strong> 24/7 automated security monitoring and alerts</li>
                <li><strong>Access controls:</strong> Strict internal access policies for our team</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed text-sm italic">
                While we take extensive precautions, no system is 100% secure. You are responsible for keeping your password confidential.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="cookies">
            <AccordionTrigger className="text-lg font-semibold">5. Cookies and Tracking</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <p className="text-muted-foreground leading-relaxed">
                We use cookies and similar technologies to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Keep you logged in to your account</li>
                <li>Remember your preferences (theme, language)</li>
                <li>Understand usage patterns via analytics</li>
                <li>Deliver personalized content recommendations</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                You can control cookies through your browser settings, but disabling them may affect functionality.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="retention">
            <AccordionTrigger className="text-lg font-semibold">6. Data Retention</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <p className="text-muted-foreground leading-relaxed">
                We retain your personal information for as long as:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Your account is active</li>
                <li>Needed to provide you services</li>
                <li>Required by law (tax records, refund documentation)</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                When you delete your account, we permanently remove all personal data within 30 days, except for information we're legally required to retain (e.g., transaction records for accounting purposes).
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="rights">
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                7. Your Rights (LGPD/GDPR)
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <p className="text-muted-foreground leading-relaxed">
                You have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li><strong>Access:</strong> Request a copy of all data we have about you</li>
                <li><strong>Correction:</strong> Update inaccurate or incomplete information</li>
                <li><strong>Deletion:</strong> Request complete removal of your account and data</li>
                <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
                <li><strong>Object:</strong> Opt out of marketing communications</li>
                <li><strong>Restrict processing:</strong> Limit how we use your data in certain circumstances</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                To exercise these rights, contact us at privacy@nepsystem.com or use the data export/deletion tools in your profile settings.
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm">
                We will respond to requests within 30 days as required by LGPD (Brazil) and GDPR (EU).
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="children">
            <AccordionTrigger className="text-lg font-semibold">8. Children's Privacy</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <p className="text-muted-foreground leading-relaxed">
                NEP System is intended for use by parents and caregivers, not children. We do not knowingly collect personal information directly from children under 13.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                While you may create child profiles to personalize content, these profiles are managed by you (the parent) and should only contain non-sensitive information like nicknames and general behavioral patterns.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="international">
            <AccordionTrigger className="text-lg font-semibold">9. International Data Transfers</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <p className="text-muted-foreground leading-relaxed">
                NEP System is operated from Brazil, but our infrastructure (Supabase) may store data in data centers located in other countries. By using our service, you consent to the transfer of your information to countries outside your country of residence, which may have different data protection laws.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We ensure all data transfers comply with applicable laws and use appropriate safeguards.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="changes">
            <AccordionTrigger className="text-lg font-semibold">10. Changes to This Policy</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy periodically to reflect changes in our practices, technology, or legal requirements. Material changes will be communicated via:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Email notification to your registered email address</li>
                <li>Prominent notice in the app</li>
                <li>Updated "Last Updated" date at the top of this page</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                Continued use of NEP System after changes constitutes acceptance of the updated policy.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              11. Contact Us
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              If you have questions, concerns, or requests regarding your privacy or this policy, please contact:
            </p>
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <p className="text-foreground font-semibold">NEP System Support</p>
              <p className="text-muted-foreground">Email: support@nepsystem.pro</p>
              <p className="text-muted-foreground text-sm">We respond to all privacy inquiries within 30 days.</p>
            </div>
          </CardContent>
        </Card>

        <Alert>
          <AlertDescription className="text-center">
            By using NEP System, you acknowledge that you have read and understood this Privacy Policy.
          </AlertDescription>
        </Alert>
      </div>
    </MainLayout>
  );
}
