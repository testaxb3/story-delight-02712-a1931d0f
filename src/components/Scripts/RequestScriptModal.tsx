import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useScriptRequests, CreateScriptRequestData } from '@/hooks/useScriptRequests';
import {
  ArrowRight,
  ArrowLeft,
  Loader2,
  Check,
  Home,
  School,
  Car,
  Users,
  X,
  Mic,
  MicOff,
  Sparkles,
  Save
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHaptic } from '@/hooks/useHaptic';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

// --- Types & Schemas ---

const step1Schema = z.object({
  situation_description: z.string().min(10, 'Please describe the situation in more detail (at least 10 characters).'),
});

const step2Schema = z.object({
  child_brain_profile: z.string().optional(),
  parent_emotional_state: z.string().optional(),
  location_type: z.array(z.string()).optional(),
});

const step3Schema = z.object({
  urgency_level: z.enum(['low', 'medium', 'high', 'urgent']),
  additional_notes: z.string().optional(),
});

const requestSchema = step1Schema.merge(step2Schema).merge(step3Schema);
type RequestFormValues = z.infer<typeof requestSchema>;

const STORAGE_KEY = 'script_request_draft';

// --- Speech Recognition Hook (Inline) ---
const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = 'en-US'; // Default to English, could be dynamic

        recognitionInstance.onstart = () => setIsListening(true);
        recognitionInstance.onend = () => setIsListening(false);
        recognitionInstance.onresult = (event: any) => {
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            }
          }
          if (finalTranscript) {
            setTranscript(finalTranscript);
          }
        };
        setRecognition(recognitionInstance);
      }
    }
  }, []);

  const startListening = useCallback(() => {
    if (recognition) recognition.start();
    else toast.error("Voice input not supported on this device");
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (recognition) recognition.stop();
  }, [recognition]);

  return { isListening, startListening, stopListening, transcript, setTranscript };
};

// --- Main Component ---

export function RequestScriptModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { createRequest, isCreating } = useScriptRequests();
  const { triggerHaptic } = useHaptic();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // Voice Input
  const { isListening, startListening, stopListening, transcript, setTranscript } = useSpeechRecognition();

  const form = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      situation_description: '',
      urgency_level: 'medium',
      location_type: [],
      parent_emotional_state: '',
      additional_notes: '',
    },
    mode: 'onChange',
  });

  const { watch, setValue, handleSubmit, formState: { errors }, reset } = form;

  // Load Draft
  useEffect(() => {
    if (open) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          reset(parsed); // Restore draft
          // toast.info("Draft restored");
        } catch (e) {
          console.error("Failed to load draft", e);
        }
      }
    }
  }, [open, reset]);

  // Save Draft (Debounced-ish by effect)
  useEffect(() => {
    const subscription = watch((value) => {
      if (open) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, open]);

  // Handle Voice Transcript
  useEffect(() => {
    if (transcript) {
      const current = form.getValues('situation_description');
      setValue('situation_description', current + (current ? ' ' : '') + transcript, { shouldValidate: true });
      setTranscript(''); // Clear buffer
    }
  }, [transcript, setValue, form]);

  const handleNext = async () => {
    triggerHaptic('light');
    let isStepValid = false;

    if (currentStep === 1) {
      isStepValid = await form.trigger('situation_description');
    } else if (currentStep === 2) {
      isStepValid = true;
    }

    if (isStepValid) setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handleBack = () => {
    triggerHaptic('light');
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = (values: RequestFormValues) => {
    triggerHaptic('medium');
    const requestData: CreateScriptRequestData = {
      situation_description: values.situation_description,
      child_brain_profile: values.child_brain_profile,
      location_type: values.location_type,
      parent_emotional_state: values.parent_emotional_state,
      urgency_level: values.urgency_level,
      additional_notes: values.additional_notes,
    };

    createRequest(requestData, {
      onSuccess: () => {
        triggerHaptic('success');

        // Trigger Confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FFD700', '#FFA500', '#FF4500'] // Gold/Orange theme
        });

        setCurrentStep(1);
        form.reset();
        localStorage.removeItem(STORAGE_KEY); // Clear draft
        onOpenChange(false);
        toast.success("Request sent successfully!");
      },
      onError: () => {
        triggerHaptic('error');
        toast.error("Failed to send request. Please try again.");
      }
    });
  };

  // --- Step Renderers ---

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20, filter: 'blur(5px)' }}
      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, x: -20, filter: 'blur(5px)' }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight flex items-center justify-center gap-2">
          What's happening? <Sparkles className="w-5 h-5 text-amber-400" />
        </h2>
        <p className="text-muted-foreground">Describe the challenge. You can type or speak.</p>
      </div>

      <div className="space-y-4">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-[26px] blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
          <div className="relative">
            <Textarea
              placeholder="E.g., My child refuses to brush their teeth and runs away laughing..."
              className="min-h-[200px] text-lg p-6 rounded-3xl bg-card/50 backdrop-blur-sm border-border/50 resize-none transition-all focus:bg-card focus:ring-0 placeholder:text-muted-foreground/50"
              {...form.register('situation_description')}
              autoFocus
            />

            {/* Voice Button */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic('medium');
                isListening ? stopListening() : startListening();
              }}
              className={cn(
                "absolute bottom-4 right-4 p-3 rounded-full transition-all duration-300 flex items-center justify-center shadow-sm",
                isListening
                  ? "bg-red-500 text-white animate-pulse shadow-red-500/40"
                  : "bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
              )}
              title="Toggle Voice Input"
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {errors.situation_description && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-500 text-center font-medium"
          >
            {errors.situation_description.message}
          </motion.p>
        )}
      </div>
    </motion.div>
  );

  const renderStep2 = () => {
    const locationTypes = watch('location_type');
    const parentState = watch('parent_emotional_state');

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-8"
      >
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Context</h2>
          <p className="text-muted-foreground">Set the scene and the mood.</p>
        </div>

        {/* Locations */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Location</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'home', label: 'Home', icon: Home },
              { id: 'school', label: 'School', icon: School },
              { id: 'public', label: 'Public', icon: Users },
              { id: 'transit', label: 'Transit', icon: Car },
            ].map((loc) => {
              const isSelected = locationTypes?.includes(loc.id);
              return (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    const current = locationTypes || [];
                    const next = isSelected ? current.filter(i => i !== loc.id) : [...current, loc.id];
                    setValue('location_type', next, { shouldValidate: true });
                  }}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-2xl border transition-all duration-200 relative overflow-hidden",
                    isSelected
                      ? "bg-primary/10 border-primary text-primary shadow-inner"
                      : "bg-card/50 border-border/50 hover:bg-card hover:border-border"
                  )}
                >
                  <loc.icon className="w-5 h-5 relative z-10" />
                  <span className="font-medium relative z-10">{loc.label}</span>
                  {isSelected && <motion.div layoutId="locHighlight" className="absolute inset-0 bg-primary/5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Emotions */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Your Feeling</label>
          <div className="flex flex-wrap gap-2">
            {['Stressed', 'Anxious', 'Angry', 'Exhausted', 'Calm', 'Confused'].map((emotion) => {
              const isSelected = parentState === emotion;
              return (
                <button
                  key={emotion}
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setValue('parent_emotional_state', isSelected ? '' : emotion, { shouldValidate: true });
                  }}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200",
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                      : "bg-transparent border-border/50 hover:border-primary/50 hover:bg-primary/5"
                  )}
                >
                  {emotion}
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>
    );
  };

  const renderStep3 = () => {
    const urgencyLevel = watch('urgency_level');

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-8"
      >
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Priority</h2>
          <p className="text-muted-foreground">How urgent is this?</p>
        </div>

        {/* Urgency Selection */}
        <div className="space-y-3">
          {[
            { value: 'low', label: 'Future Planning', desc: 'No rush', color: 'bg-blue-500' },
            { value: 'medium', label: 'Regular Issue', desc: 'Weekly occurrence', color: 'bg-yellow-500' },
            { value: 'high', label: 'Daily Struggle', desc: 'Happens daily', color: 'bg-orange-500' },
            { value: 'urgent', label: 'SOS / Crisis', desc: 'Immediate help needed', color: 'bg-red-500' },
          ].map((level) => {
            const isSelected = urgencyLevel === level.value;
            return (
              <motion.button
                key={level.value}
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  triggerHaptic('medium');
                  setValue('urgency_level', level.value as any);
                }}
                className={cn(
                  "w-full flex items-center p-4 rounded-2xl border transition-all relative overflow-hidden",
                  isSelected
                    ? "border-primary ring-1 ring-primary bg-primary/5"
                    : "border-border/50 hover:bg-accent/50"
                )}
              >
                <div className={cn("w-1.5 h-full absolute left-0 top-0 bottom-0 transition-opacity", level.color, isSelected ? "opacity-100" : "opacity-40")} />
                <div className="pl-4 flex-1 text-left">
                  <div className="font-bold text-foreground flex items-center gap-2">
                    {level.label}
                    {level.value === 'urgent' && <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />}
                  </div>
                  <div className="text-xs text-muted-foreground font-medium opacity-80">{level.desc}</div>
                </div>
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>

        {/* Additional Notes */}
        <div className="pt-2">
          <Input
            placeholder="Any extra notes? (Optional)"
            className="h-12 bg-card/50 border-border/50 focus:bg-card rounded-xl"
            {...form.register('additional_notes')}
          />
        </div>
      </motion.div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] p-0 gap-0 bg-background/95 backdrop-blur-xl border-none shadow-2xl overflow-hidden flex flex-col rounded-[32px]">
        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-secondary/30">
          <motion.div
            className="h-full bg-primary shadow-[0_0_10px_rgba(0,0,0,0.2)] shadow-primary/50"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
            transition={{ duration: 0.4, ease: "circOut" }}
          />
        </div>

        {/* Header */}
        <DialogHeader className="p-6 pb-2 relative">
          <DialogTitle className="sr-only">Request a Script</DialogTitle>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-widest">
              Step {currentStep} <span className="text-muted-foreground/40">/</span> {totalSteps}
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 pt-2 scrollbar-none">
          <AnimatePresence mode="wait" custom={currentStep}>
            <motion.div key={currentStep} className="h-full outline-none">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border/50 bg-background/80 backdrop-blur-xl">
          <div className="flex gap-3">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="h-14 px-6 rounded-2xl border-2 border-border/50 hover:bg-secondary font-bold text-muted-foreground"
              >
                Back
              </Button>
            )}

            <Button
              onClick={currentStep === totalSteps ? handleSubmit(onSubmit) : handleNext}
              disabled={isCreating || (currentStep === 1 && !watch('situation_description'))}
              className={cn(
                "flex-1 h-14 rounded-2xl text-lg font-bold shadow-lg transition-all active:scale-95",
                isCreating ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground shadow-primary/25 hover:shadow-primary/40"
              )}
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="ml-2">Thinking...</span>
                </>
              ) : currentStep === totalSteps ? (
                <>
                  Submit Request <Sparkles className="w-5 h-5 ml-2" />
                </>
              ) : (
                <>
                  Next <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
