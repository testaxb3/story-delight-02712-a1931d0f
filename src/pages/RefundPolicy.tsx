import { MainLayout } from "@/components/Layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, XCircle, AlertTriangle, Mail, CreditCard, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function RefundPolicy() {
  return (
    <MainLayout hideBottomNav={true}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Refund Policy</h1>
          <p className="text-muted-foreground">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>

        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>90-Day Money-Back Guarantee</AlertTitle>
          <AlertDescription>
            We stand behind the quality of NEP System. If you're not satisfied within 90 days of purchase, you can request a full refund—no questions asked.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              1. Refund Eligibility
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg space-y-2">
              <h4 className="font-semibold text-green-600 dark:text-green-400 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                You are eligible for a refund if:
              </h4>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Your request is made within <strong>90 days of purchase</strong></li>
                <li>You purchased directly through our official channels</li>
                <li>You have a valid purchase confirmation</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Valid Reasons for Refund:</h4>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Product did not meet your expectations</li>
                <li>Technical issues that prevent you from using the app</li>
                <li>Content not suitable for your child's specific needs</li>
                <li>Duplicate purchase or billing error</li>
                <li>Any other reason—we honor our 30-day guarantee</li>
              </ul>
            </div>

            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Refund Not Available:</AlertTitle>
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
                  <li>More than 90 days have passed since purchase</li>
                  <li>Account has been terminated for Terms of Service violations</li>
                  <li>Fraudulent chargebacks have been initiated</li>
                </ul>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              2. How to Request a Refund
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Requesting a refund is simple and fast:
              </p>
              
              <div className="bg-muted/50 p-6 rounded-lg space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold shrink-0">1</div>
                  <div>
                    <p className="font-semibold text-foreground">Submit Request in the App</p>
                    <p className="text-sm text-muted-foreground">Go to Profile → Settings → Request Refund and fill out the form</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold shrink-0">2</div>
                  <div>
                    <p className="font-semibold text-foreground">Our Team Reviews Your Request</p>
                    <p className="text-sm text-muted-foreground">We review all requests within 2-3 business days</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold shrink-0">3</div>
                  <div>
                    <p className="font-semibold text-foreground">Refund Processed</p>
                    <p className="text-sm text-muted-foreground">Once approved, refund is issued to your original payment method within 5-10 business days</p>
                  </div>
                </div>
              </div>

              <Link to="/refund">
                <Button className="w-full sm:w-auto">
                  <Mail className="h-4 w-4 mr-2" />
                  Request Refund
                </Button>
              </Link>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Processing Time:</h4>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li><strong>Review:</strong> 2-3 business days</li>
                <li><strong>Refund issuance:</strong> 1-2 business days after approval</li>
                <li><strong>Bank processing:</strong> 5-10 business days (depends on your bank)</li>
              </ul>
              <p className="text-sm text-muted-foreground italic">
                Total time from request to funds in your account: typically 7-15 business days
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              3. Partial Refunds
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              In certain situations, we may offer a partial refund:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>If you've extensively used the platform but still wish to request a refund</li>
              <li>If you're outside the 90-day window but have extenuating circumstances</li>
              <li>If you only want to refund a specific component of a bundle purchase</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              Partial refund decisions are made on a case-by-case basis. We'll always communicate the proposed partial refund amount before processing.
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              ⚠️ IMPORTANT: Chargebacks vs. Refunds
            </CardTitle>
            <CardDescription>
              Please read this carefully to protect your financial reputation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Why You Should Always Request a Refund First</AlertTitle>
              <AlertDescription>
                We offer a no-questions-asked 90-day refund policy for a reason: to protect YOU. If you're unsatisfied, simply request a refund through the app. It's fast, easy, and safe.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <h4 className="font-semibold text-destructive text-lg">Serious Risks of Fraudulent Chargebacks:</h4>
              
              <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg space-y-3">
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">1. Credit Score Damage</p>
                    <p className="text-sm text-muted-foreground">Fraudulent chargebacks can be reported to credit agencies, potentially lowering your credit score and affecting your ability to get loans, mortgages, or credit cards.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">2. Payment Processor Blacklist</p>
                    <p className="text-sm text-muted-foreground">Your card may be flagged or permanently blocked by payment platforms like Stripe, PayPal, Visa, and Mastercard. This can prevent you from making online purchases in the future.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">3. Chargeback Fees ($50-$100+)</p>
                    <p className="text-sm text-muted-foreground">Banks charge substantial fees for processing chargebacks. If the chargeback is found to be fraudulent, these fees may be passed on to you.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">4. Legal Consequences</p>
                    <p className="text-sm text-muted-foreground">Fraudulent chargebacks constitute fraud under federal and state law. Merchants have the right to pursue legal action, which may result in civil penalties, court fees, and criminal charges in severe cases.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">5. Service Bans Across Platforms</p>
                    <p className="text-sm text-muted-foreground">Digital platforms share fraud databases. A fraudulent chargeback on one service may result in bans from other unrelated services (streaming, e-commerce, subscriptions).</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">6. Permanent Fraud Records</p>
                    <p className="text-sm text-muted-foreground">Chargebacks are permanently recorded in fraud prevention databases like Ethoca and Verifi, which are accessed by thousands of merchants worldwide. This can affect your ability to make purchases for years.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg space-y-3">
              <h4 className="font-semibold text-green-600 dark:text-green-400 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                When Chargebacks ARE Legitimate:
              </h4>
              <p className="text-sm text-muted-foreground">
                Chargebacks should ONLY be used for:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                <li><strong>Unauthorized transactions:</strong> Your card was stolen or used without permission</li>
                <li><strong>Merchant not responding:</strong> You've attempted to contact us multiple times and received no response (this won't happen—we respond within 48 hours)</li>
                <li><strong>Product not received:</strong> You paid but never received access (also extremely rare—access is instant)</li>
              </ul>
            </div>

            <Alert className="bg-primary/10 border-primary">
              <Shield className="h-4 w-4" />
              <AlertTitle className="text-primary">💡 Our Refund Process Protects You</AlertTitle>
              <AlertDescription>
                <p className="mb-2">Our refund process is designed to be:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>Fast:</strong> Reviewed within 2-3 business days</li>
                  <li><strong>Easy:</strong> One simple form in the app</li>
                  <li><strong>Safe:</strong> Protects your credit score and financial reputation</li>
                  <li><strong>Fair:</strong> No questions asked within 30 days</li>
                </ul>
                <p className="mt-3 font-semibold">Please use our refund system first. It's better for everyone!</p>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="denied">
            <AccordionTrigger className="text-lg font-semibold">What if My Refund Request is Denied?</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <p className="text-muted-foreground leading-relaxed">
                Refund requests are rarely denied, but if yours is, we will:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Provide a clear explanation of the reason for denial</li>
                <li>Give you an opportunity to provide additional information or context</li>
                <li>Offer alternative solutions (partial refund, extended access, etc.)</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                Common reasons for denial:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Request submitted more than 90 days after purchase</li>
                <li>Account has been terminated for violating Terms of Service</li>
                <li>Previous fraudulent chargeback initiated for the same purchase</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                You have the right to appeal the decision by contacting our support team at support@nepsystem.pro.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="access">
            <AccordionTrigger className="text-lg font-semibold">What Happens to My Access After a Refund?</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <p className="text-muted-foreground leading-relaxed">
                Once a refund is approved and processed:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Your account access will be revoked within 24 hours</li>
                <li>You will lose access to all scripts, ebooks, videos, and community features</li>
                <li>Any saved progress, bookmarks, or notes will be deleted</li>
                <li>You may not re-purchase at a later date with the same guarantee</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                We recommend downloading any personal notes or content you wish to keep before requesting a refund.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="repurchase">
            <AccordionTrigger className="text-lg font-semibold">Can I Re-Purchase After a Refund?</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <p className="text-muted-foreground leading-relaxed">
                Yes, you may re-purchase NEP System at any time. However:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>The 90-day money-back guarantee may not apply to repeat purchases</li>
                <li>We reserve the right to deny service to users who abuse the refund policy</li>
                <li>Promotional pricing or discounts may not be available for re-purchases</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contact Us
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about our refund policy or need assistance with a refund request:
            </p>
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <p className="text-foreground font-semibold">NEP System Support</p>
              <p className="text-muted-foreground">Email: support@nepsystem.pro</p>
              <p className="text-muted-foreground text-sm">Response time: Within 24-48 hours</p>
            </div>
          </CardContent>
        </Card>

        <Alert>
          <AlertDescription className="text-center">
            We want you to be completely satisfied with NEP System. If you have any concerns, please reach out to us first—we're here to help!
          </AlertDescription>
        </Alert>
      </div>
    </MainLayout>
  );
}
