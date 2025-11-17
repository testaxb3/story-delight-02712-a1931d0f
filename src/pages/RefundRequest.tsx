import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { ArrowLeft, AlertTriangle, CheckCircle, DollarSign, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function RefundRequest() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState<'info' | 'reason' | 'offer' | 'submitted'>('info');
  const [reason, setReason] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
  const [acceptedOffer, setAcceptedOffer] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [purchaseEmail, setPurchaseEmail] = useState('');

  const reasons = [
    { value: 'not-satisfied', label: "Not satisfied with the content" },
    { value: 'technical-issues', label: "Had technical issues" },
    { value: 'not-using', label: "Not using the product" },
    { value: 'financial', label: "Financial reasons" },
    { value: 'other', label: "Other reason" }
  ];

  const handleSubmitRefund = async () => {
    if (!user?.id) {
      toast.error('Error identifying user');
      return;
    }

    if (!selectedReason || !customerName || !purchaseEmail) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);

    try {
      // Save refund request to database
      const { error } = await supabase
        .from('refund_requests')
        .insert({
          user_id: user.id,
          email: purchaseEmail,
          customer_name: customerName,
          reason_type: selectedReason,
          reason_details: reason,
          accepted_partial_refund: acceptedOffer,
          status: acceptedOffer ? 'partial_accepted' : 'pending'
        });

      if (error) throw error;

      setStep('submitted');
      toast.success('Request submitted successfully!');
    } catch (error) {
      console.error('Error submitting refund:', error);
      toast.error('Error submitting request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (step === 'info') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-3 sm:p-4">
        <div className="max-w-3xl mx-auto pt-4 sm:pt-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/profile')}
            className="mb-4 sm:mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Button>

          <Card className="border border-border shadow-lg">
            <CardHeader className="text-center p-4 sm:p-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
              <CardTitle className="text-xl sm:text-2xl">Refund Policy</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Please read carefully before requesting your refund
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6">
              {/* Money Back Guarantee */}
              <div className="bg-success/10 border border-success/20 rounded-lg p-3 sm:p-4">
                <div className="flex items-start gap-2 sm:gap-3">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-success mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-success-foreground mb-1 text-sm sm:text-base">
                      30-Day Money-Back Guarantee
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      If you're not satisfied with NEP System, we offer a full refund within 30 days of purchase, no questions asked.
                    </p>
                  </div>
                </div>
              </div>

              {/* Warning about Chargeback */}
              <div className="bg-destructive/10 border-2 border-destructive/30 rounded-lg p-3 sm:p-4">
                <div className="flex items-start gap-2 sm:gap-3">
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-destructive mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-destructive mb-2 text-sm sm:text-base">
                      ⚠️ IMPORTANT: DO NOT request a chargeback from your bank
                    </h3>
                    <ul className="text-xs sm:text-sm text-muted-foreground space-y-1.5 sm:space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-destructive mt-0.5">•</span>
                        <span>
                          <strong>Damages your credit reputation:</strong> Chargebacks are recorded in your history and may cause your card to be blocked for future purchases
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-destructive mt-0.5">•</span>
                        <span>
                          <strong>Slower process:</strong> Bank chargebacks take 30-90 days, while our refund is processed in 5-7 business days
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-destructive mt-0.5">•</span>
                        <span>
                          <strong>We have dedicated support:</strong> We're a serious company and want to solve your problem. Talk to us first!
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* How to Request */}
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 sm:p-4">
                <h3 className="font-semibold text-foreground mb-2 sm:mb-3 text-sm sm:text-base">
                  How to request a refund correctly:
                </h3>
                <ol className="text-xs sm:text-sm text-muted-foreground space-y-1.5 sm:space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-primary">1.</span>
                    <span>Click the "Request Refund" button below</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-primary">2.</span>
                    <span>Tell us the reason (this helps us improve)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-primary">3.</span>
                    <span>Receive a response within 24 hours</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-primary">4.</span>
                    <span>Refund processed in 5-7 business days</span>
                  </li>
                </ol>
              </div>

              {/* Contact Support First */}
              <div className="bg-accent/10 border border-accent/20 rounded-lg p-3 sm:p-4">
                <div className="flex items-start gap-2 sm:gap-3">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-accent mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1 text-sm sm:text-base">
                      📧 Before requesting a refund...
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
                      We can help! Many issues can be quickly resolved by our support team.
                    </p>
                    <a
                      href="mailto:support@nepsystem.com"
                      className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-accent hover:text-accent/80 transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      Contact Support: support@nepsystem.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-2 sm:pt-4">
                <Button
                  size="lg"
                  onClick={() => setStep('reason')}
                  className="w-full h-11 sm:h-12 text-sm sm:text-base"
                >
                  Continue with Refund Request
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/profile')}
                  className="w-full h-11 sm:h-12 text-sm sm:text-base"
                >
                  Back to Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (step === 'reason') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="max-w-2xl mx-auto pt-8">
          <Button
            variant="ghost"
            onClick={() => setStep('info')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <Card>
            <CardHeader>
              <CardTitle>Tell us the reason</CardTitle>
              <CardDescription>
                Your feedback helps us improve NEP System
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="purchase-email">
                  Purchase Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="purchase-email"
                  type="email"
                  placeholder="Email used to purchase NEP System"
                  value={purchaseEmail}
                  onChange={(e) => setPurchaseEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-4">
                <Label>What's the main reason? <span className="text-red-500">*</span></Label>
                <RadioGroup value={selectedReason} onValueChange={setSelectedReason}>
                  {reasons.map((r) => (
                    <div key={r.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={r.value} id={r.value} />
                      <Label htmlFor={r.value} className="font-normal cursor-pointer">
                        {r.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="details">
                  Additional details (optional)
                </Label>
                <Textarea
                  id="details"
                  placeholder="Tell us more about your experience..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={5}
                />
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  size="lg"
                  onClick={() => setStep('offer')}
                  disabled={!selectedReason || !customerName || !purchaseEmail}
                  className="w-full"
                >
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (step === 'offer') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="max-w-2xl mx-auto pt-8">
          <Button
            variant="ghost"
            onClick={() => setStep('reason')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <Card className="border-2 border-primary/20">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Special Offer For You</CardTitle>
              <CardDescription className="text-base">
                Before processing your refund, we have a proposal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
                <h3 className="font-bold text-xl text-green-900 mb-4 text-center">
                  How about keeping your access with a discount?
                </h3>
                <p className="text-gray-700 mb-6 text-center">
                  We want you to succeed with NEP System. Choose one of the options below:
                </p>

                <div className="grid gap-4">
                  <button
                    onClick={() => setAcceptedOffer('50%')}
                    className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                      acceptedOffer === '50%'
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 bg-white hover:border-green-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <p className="font-bold text-lg text-gray-900">50% Refund</p>
                        <p className="text-sm text-gray-600">Keep full access to NEP System</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">50%</p>
                        <p className="text-xs text-gray-500">back</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setAcceptedOffer('30%')}
                    className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                      acceptedOffer === '30%'
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 bg-white hover:border-green-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <p className="font-bold text-lg text-gray-900">30% Refund</p>
                        <p className="text-sm text-gray-600">Keep full access to NEP System</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">30%</p>
                        <p className="text-xs text-gray-500">back</p>
                      </div>
                    </div>
                  </button>
                </div>

                <div className="mt-6 p-4 bg-white rounded-lg">
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>✓</strong> You get the partial refund
                  </p>
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>✓</strong> Keep full access forever
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>✓</strong> Continue receiving updates and new content
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  size="lg"
                  onClick={handleSubmitRefund}
                  disabled={submitting}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {acceptedOffer
                    ? `Accept ${acceptedOffer} Refund`
                    : 'No, I Want Full Refund'}
                </Button>
                <p className="text-xs text-center text-gray-500">
                  {acceptedOffer
                    ? 'You will receive the refund in 5-7 business days'
                    : 'We will process the full refund according to our 30-day policy'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // step === 'submitted'
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 flex items-center justify-center">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Request Submitted!</CardTitle>
          <CardDescription>
            We've received your refund request
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-gray-700">
            Our team will process your request and you'll receive a confirmation email within 24 hours.
          </p>
          {acceptedOffer && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                <strong>{acceptedOffer} Refund approved!</strong><br />
                You will keep full access to NEP System.
              </p>
            </div>
          )}
          <p className="text-sm text-gray-600">
            The refund will be processed in 5-7 business days using the same payment method used for purchase.
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/refund-status')}
            className="w-full mt-6"
          >
            View Refund Status
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
