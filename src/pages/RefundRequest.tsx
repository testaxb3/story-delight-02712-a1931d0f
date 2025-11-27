import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ArrowLeft, AlertTriangle, CheckCircle, DollarSign, Mail, Shield, Zap, RefreshCcw, X, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function RefundRequest() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState<'policy' | 'reason' | 'offer' | 'submitted'>('policy');
  const [reason, setReason] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
  const [acceptedOffer, setAcceptedOffer] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [purchaseEmail, setPurchaseEmail] = useState('');
  const [hasExistingRequest, setHasExistingRequest] = useState(false);
  const [checkingExisting, setCheckingExisting] = useState(true);

  useEffect(() => {
    const checkExistingRequest = async () => {
      if (!user?.id) {
        setCheckingExisting(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('refund_requests')
          .select('id')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (!error && data) {
          setHasExistingRequest(true);
        }
      } catch (error) {
        // No existing request
      } finally {
        setCheckingExisting(false);
      }
    };

    checkExistingRequest();
  }, [user]);

  const reasons = [
    { id: 'not-satisfied', icon: '😕', label: "Content didn't meet expectations", desc: "I expected something different." },
    { id: 'technical-issues', icon: '🔧', label: "Technical difficulties", desc: "I couldn't access or use the content." },
    { id: 'financial', icon: '💰', label: "Financial reasons", desc: "I can't afford it right now." },
    { id: 'not-using', icon: '⏳', label: "I don't have time", desc: "I haven't used it enough." },
    { id: 'other', icon: '📝', label: "Other reason", desc: "Something else." }
  ];

  const handleSubmitRefund = async () => {
    if (!user?.id) return toast.error('User identification failed.');
    if (!selectedReason || !customerName || !purchaseEmail) return toast.error('Please complete all fields.');

    setSubmitting(true);
    try {
      const { error } = await supabase.from('refund_requests').insert({
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
      toast.success('Request received successfully.');
    } catch (error) {
      console.error('Refund Error:', error);
      toast.error('Failed to submit request.');
    } finally {
      setSubmitting(false);
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 20, scale: 0.98 },
    visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.4 } },
    exit: { opacity: 0, x: -20, scale: 0.98, transition: { duration: 0.3 } }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Floating Header */}
      <div className="fixed top-0 left-0 right-0 z-50 px-6 pb-4 pt-[calc(env(safe-area-inset-top)+1rem)] flex justify-between items-center bg-background/80 backdrop-blur-xl border-b border-border/40">
        <Button variant="ghost" size="icon" onClick={() => step === 'policy' ? navigate('/profile') : setStep(prev => prev === 'offer' ? 'reason' : prev === 'reason' ? 'policy' : 'policy')} className="rounded-full hover:bg-muted/50">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="text-sm font-bold tracking-widest uppercase opacity-60">Refund Request</div>
        <div className="w-10" /> {/* Spacer */}
      </div>

      <main className="flex-1 flex items-center justify-center p-4 pt-24 pb-12">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait">
            {/* STEP 1: POLICY INFO */}
            {step === 'policy' && (
              <motion.div key="policy" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-4 rotate-3">
                    <Shield className="w-8 h-8 text-primary" />
                  </div>
                  <h1 className="text-3xl md:text-4xl font-black tracking-tight font-relative">Before you go...</h1>
                  <p className="text-muted-foreground">Please review our 30-Day Guarantee policy.</p>
                </div>

                {/* Existing Request Banner */}
                {hasExistingRequest && !checkingExisting && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/30 dark:border-blue-500/40 rounded-2xl p-5"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500/20 dark:bg-blue-500/30 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-1">
                          You Already Have a Refund Request
                        </h3>
                        <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                          We found an active refund request associated with your account. You can track its status instead of submitting a new one.
                        </p>
                        <Button
                          onClick={() => navigate('/refund-status')}
                          variant="outline"
                          className="h-10 bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30 text-blue-900 dark:text-blue-100 font-semibold rounded-xl"
                        >
                          View Refund Status
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="space-y-4">
                  <div className="bg-card/50 border border-border/50 rounded-2xl p-5 backdrop-blur-sm">
                    <h3 className="flex items-center gap-2 font-bold text-foreground mb-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      Money-Back Guarantee
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      If you're not satisfied with NEP System, we offer a full refund within 30 days of purchase. No hassle, no hard feelings.
                    </p>
                  </div>

                  <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-5 backdrop-blur-sm">
                    <h3 className="flex items-center gap-2 font-bold text-destructive mb-2">
                      <AlertTriangle className="w-5 h-5" />
                      Important Warning
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      <strong>Do NOT request a bank chargeback.</strong> This damages your credit score and freezes funds for 90+ days.
                    </p>
                    <div className="flex items-center gap-3 text-xs font-medium text-destructive/80 bg-destructive/10 p-3 rounded-lg">
                      <Zap className="w-4 h-4" />
                      Our direct refund is processed in just 5-7 days.
                    </div>
                  </div>
                </div>

                <Button onClick={() => setStep('reason')} className="w-full h-14 text-base font-bold rounded-xl shadow-lg shadow-primary/20">
                  I Understand, Continue Request
                </Button>
                
                <div className="text-center">
                  <a href="mailto:support@nepsystem.pro" className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-1.5">
                    <Mail className="w-3 h-3" /> Contact Support First
                  </a>
                </div>
              </motion.div>
            )}

            {/* STEP 2: REASON FORM */}
            {step === 'reason' && (
              <motion.div key="reason" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-black tracking-tight">What happened?</h2>
                  <p className="text-sm text-muted-foreground mt-1">Your feedback is critical for us.</p>
                </div>

                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Name</label>
                      <Input placeholder="Full Name" value={customerName} onChange={e => setCustomerName(e.target.value)} className="h-12 bg-card/50 border-border/50 rounded-xl" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Email</label>
                      <Input placeholder="Purchase Email" value={purchaseEmail} onChange={e => setPurchaseEmail(e.target.value)} className="h-12 bg-card/50 border-border/50 rounded-xl" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Reason</label>
                    <div className="grid gap-2">
                      {reasons.map((r) => (
                        <button
                          key={r.id}
                          onClick={() => setSelectedReason(r.id)}
                          className={cn(
                            "flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left group",
                            selectedReason === r.id 
                              ? "bg-primary/10 border-primary shadow-sm ring-1 ring-primary/20" 
                              : "bg-card/30 border-border/40 hover:bg-card/60 hover:border-border/80"
                          )}
                        >
                          <span className="text-xl group-hover:scale-110 transition-transform duration-300">{r.icon}</span>
                          <div>
                            <div className="font-bold text-sm text-foreground">{r.label}</div>
                            <div className="text-xs text-muted-foreground">{r.desc}</div>
                          </div>
                          {selectedReason === r.id && <CheckCircle className="w-4 h-4 text-primary ml-auto" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Details (Optional)</label>
                    <Textarea 
                      placeholder="Tell us more..." 
                      value={reason} 
                      onChange={e => setReason(e.target.value)} 
                      className="min-h-[100px] bg-card/50 border-border/50 rounded-xl resize-none" 
                    />
                  </div>
                </div>

                <Button 
                  onClick={() => setStep('offer')} 
                  disabled={!selectedReason || !customerName || !purchaseEmail}
                  className="w-full h-14 text-base font-bold rounded-xl shadow-lg"
                >
                  Review Request
                </Button>
              </motion.div>
            )}

            {/* STEP 3: OFFER / NEGOTIATION */}
            {step === 'offer' && (
              <motion.div key="offer" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-3xl p-6 md:p-8 text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50" />
                  
                  <div className="w-16 h-16 mx-auto bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-4 shadow-inner">
                    <DollarSign className="w-8 h-8" />
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-black text-foreground mb-2 font-relative">Keep Access for Less?</h2>
                  <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-8">
                    We'd hate to see you go completely. Choose a partial refund and keep lifetime access to all your materials.
                  </p>

                  <div className="grid gap-4 mb-8">
                    {[
                      { val: '50%', label: '50% Refund', sub: 'Keep Full Access', tag: 'Best Value' },
                      { val: '30%', label: '30% Refund', sub: 'Keep Full Access', tag: null }
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        onClick={() => setAcceptedOffer(opt.val)}
                        className={cn(
                          "relative flex items-center justify-between p-4 rounded-2xl border-2 transition-all",
                          acceptedOffer === opt.val
                            ? "bg-green-500/10 border-green-500 shadow-lg shadow-green-500/10"
                            : "bg-card border-border/50 hover:border-green-500/50"
                        )}
                      >
                        {opt.tag && (
                          <span className="absolute -top-3 left-4 px-2 py-0.5 bg-green-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
                            {opt.tag}
                          </span>
                        )}
                        <div className="text-left">
                          <div className="font-black text-lg">{opt.label}</div>
                          <div className="text-xs text-muted-foreground font-medium">{opt.sub}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-black text-green-600 dark:text-green-400">{opt.val}</div>
                          <div className="text-[10px] font-bold text-muted-foreground uppercase">Cashback</div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button 
                      onClick={handleSubmitRefund} 
                      disabled={submitting}
                      className={cn(
                        "w-full h-14 text-base font-bold rounded-xl transition-all",
                        acceptedOffer 
                          ? "bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/20"
                          : "bg-foreground text-background hover:bg-foreground/90"
                      )}
                    >
                      {acceptedOffer ? `Accept ${acceptedOffer} & Keep Access` : 'No thanks, process full refund'}
                    </Button>
                    
                    <p className="text-xs text-muted-foreground">
                      {acceptedOffer 
                        ? "Refund processed in 2-3 business days." 
                        : "Full refund takes 5-7 business days."}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 4: SUBMITTED */}
            {step === 'submitted' && (
              <motion.div key="submitted" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="text-center space-y-6">
                <div className="w-24 h-24 mx-auto bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-12 h-12" />
                </div>
                
                <div>
                  <h2 className="text-3xl font-black tracking-tight mb-2">Request Received</h2>
                  <p className="text-muted-foreground max-w-xs mx-auto">
                    We've sent a confirmation email to <strong>{purchaseEmail}</strong>.
                  </p>
                </div>

                {acceptedOffer && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 max-w-sm mx-auto">
                    <p className="font-bold text-green-700 dark:text-green-400 text-sm">
                      {acceptedOffer} Refund Approved!
                    </p>
                    <p className="text-xs text-green-600/80 dark:text-green-400/80 mt-1">
                      Your access remains active forever.
                    </p>
                  </div>
                )}

                <div className="grid gap-3 pt-4">
                  <Button onClick={() => navigate('/refund-status')} variant="outline" className="h-12 rounded-xl font-bold border-border/50">
                    Track Status
                  </Button>
                  <Button onClick={() => navigate('/profile')} className="h-12 rounded-xl font-bold shadow-lg">
                    Return to Profile
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}