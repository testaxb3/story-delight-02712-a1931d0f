import { MainLayout } from "@/components/Layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertTriangle, Shield, BookOpen, Users, Scale } from "lucide-react";

export default function Terms() {
  return (
    <MainLayout hideBottomNav={true}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Terms of Service</h1>
          <p className="text-muted-foreground">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            By accessing and using NEP System, you agree to be bound by these Terms of Service. Please read them carefully.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              1. Service Description
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              NEP System is a digital platform providing evidence-based parenting strategies, educational content, and tools designed to help parents understand and support children with different neurological profiles (INTENSE, DEFIANT, DISTRACTED, and UNIVERSAL).
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our service includes access to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Parenting scripts based on neuroscience research</li>
              <li>Educational ebooks and digital resources</li>
              <li>Video content and training materials</li>
              <li>Bonus materials and tools</li>
              <li>Community features and support</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              2. License and Usage Rights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              Upon purchase, you receive a personal, non-exclusive, non-transferable, limited license to access and use NEP System content for personal, non-commercial purposes only.
            </p>
            
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <h4 className="font-semibold text-foreground">You MAY:</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Access content from any device you own</li>
                <li>Download materials for personal offline use</li>
                <li>Print content for personal reference</li>
                <li>Share your personal success stories in our community</li>
              </ul>
            </div>

            <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg space-y-2">
              <h4 className="font-semibold text-destructive">You MAY NOT:</h4>
              <ul className="list-disc list-inside space-y-1 text-destructive ml-4">
                <li>Share your account credentials with others</li>
                <li>Reproduce, distribute, or resell our content</li>
                <li>Use content for commercial purposes or training programs</li>
                <li>Copy, modify, or create derivative works</li>
                <li>Remove copyright notices or watermarks</li>
                <li>Reverse engineer or extract source content</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              3. Medical Disclaimer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="font-semibold">
                IMPORTANT: NEP System provides educational content only and does not replace professional medical, psychological, or therapeutic advice.
              </AlertDescription>
            </Alert>

            <p className="text-muted-foreground leading-relaxed">
              Our content is based on research and neuroscience principles, but:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>We do not diagnose, treat, or cure any medical or psychological conditions</li>
              <li>Our strategies are educational tools, not medical interventions</li>
              <li>Each child is unique and may require professional evaluation</li>
              <li>Always consult qualified healthcare providers for medical concerns</li>
              <li>In emergencies, contact appropriate emergency services immediately</li>
            </ul>

            <p className="text-muted-foreground leading-relaxed font-semibold">
              By using NEP System, you acknowledge that you are responsible for decisions regarding your child's care and that our content supplements, but does not replace, professional guidance.
            </p>
          </CardContent>
        </Card>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="account">
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                4. User Account Responsibilities
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <p className="text-muted-foreground leading-relaxed">
                You are responsible for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of unauthorized access</li>
                <li>Providing accurate and current information</li>
                <li>Complying with all applicable laws when using our service</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent activity.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="intellectual">
            <AccordionTrigger className="text-lg font-semibold">5. Intellectual Property Rights</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <p className="text-muted-foreground leading-relaxed">
                All content, materials, features, and functionality on NEP System, including but not limited to text, graphics, logos, scripts, ebooks, videos, and software, are the exclusive property of NEP System and are protected by international copyright, trademark, and other intellectual property laws.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our content is based on research from experts including Dr. Ross Greene, Dr. Russell Barkley, and Dr. Daniel Siegel, and is synthesized and adapted specifically for our platform. Unauthorized reproduction or distribution constitutes copyright infringement and may result in legal action.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="community">
            <AccordionTrigger className="text-lg font-semibold">6. Community Guidelines</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <p className="text-muted-foreground leading-relaxed">
                When using our community features, you agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Be respectful and supportive of other parents</li>
                <li>Protect the privacy of your children and others</li>
                <li>Not share harmful, offensive, or illegal content</li>
                <li>Not use the community for commercial solicitation</li>
                <li>Not impersonate others or misrepresent your identity</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to remove content or ban users who violate these guidelines.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="modifications">
            <AccordionTrigger className="text-lg font-semibold">7. Service Modifications</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Modify, suspend, or discontinue any part of the service at any time</li>
                <li>Update content and add new features</li>
                <li>Change pricing for future purchases (existing purchases honored)</li>
                <li>Update these Terms of Service with reasonable notice</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                Material changes to these terms will be communicated via email or in-app notification. Continued use after changes constitutes acceptance.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="liability">
            <AccordionTrigger className="text-lg font-semibold">8. Limitation of Liability</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <p className="text-muted-foreground leading-relaxed">
                NEP System is provided "as is" without warranties of any kind. To the maximum extent permitted by law:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>We do not guarantee specific outcomes or results</li>
                <li>We are not liable for decisions you make based on our content</li>
                <li>We are not responsible for technical issues beyond our control</li>
                <li>Our total liability is limited to the amount you paid for the service</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                Some jurisdictions do not allow limitation of liability, so these limitations may not apply to you.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="termination">
            <AccordionTrigger className="text-lg font-semibold">9. Termination</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <p className="text-muted-foreground leading-relaxed">
                We may terminate or suspend your access immediately, without prior notice, for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Violation of these Terms of Service</li>
                <li>Fraudulent chargebacks or payment disputes</li>
                <li>Sharing account credentials or reselling content</li>
                <li>Abusive behavior toward our team or community</li>
                <li>Any illegal activity</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                Upon termination, your right to use the service ceases immediately. If you wish to delete your account, you may do so in your profile settings.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              10. Governing Law and Disputes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              These Terms of Service shall be governed by and construed in accordance with international commercial law principles. In the event of any dispute arising from these terms or your use of NEP System, both parties agree to first attempt resolution through good faith negotiation.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              If negotiation is unsuccessful, disputes may be resolved through binding arbitration or the appropriate legal jurisdiction based on your country of residence.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>11. Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about these Terms of Service, please contact us at:
            </p>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-foreground font-semibold">NEP System Support</p>
              <p className="text-muted-foreground">Email: support@nepsystem.pro</p>
            </div>
          </CardContent>
        </Card>

        <Alert>
          <AlertDescription className="text-center">
            By using NEP System, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
          </AlertDescription>
        </Alert>
      </div>
    </MainLayout>
  );
}
