import { useState } from 'react';
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
import { ArrowRight, ArrowLeft, Loader2, Check, Home, School, Car, Users, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHaptic } from '@/hooks/useHaptic';

// Wizard Steps Schema
const step1Schema = z.object({
  situation_description: z.string().min(10, 'Tell us a bit more about the situation.'),
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

// Combined Schema for final submission
const requestSchema = step1Schema.merge(step2Schema).merge(step3Schema);
type RequestFormValues = z.infer<typeof requestSchema>;

export function RequestScriptModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { createRequest, isCreating } = useScriptRequests();
  const { triggerHaptic } = useHaptic();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

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

  const { watch, setValue, handleSubmit, formState: { errors, isValid } } = form;
  const formValues = watch();

  // Navigation Handlers
  const handleNext = async () => {
    triggerHaptic('light');
    let isStepValid = false;

    if (currentStep === 1) {
      isStepValid = await form.trigger('situation_description');
    } else if (currentStep === 2) {
      isStepValid = true; // Optional fields, always valid
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
        setCurrentStep(1);
        form.reset();
        onOpenChange(false);
      },
    });
  };

  // UI Components for Steps
  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">What's happening?</h2>
        <p className="text-muted-foreground">Describe the challenge you're facing with your child.</p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Textarea
            placeholder="My child refuses to get dressed in the morning and throws a tantrum when I insist..."
            className="min-h-[200px] text-lg p-6 rounded-3xl bg-secondary/30 border-transparent focus:border-primary/20 focus:bg-secondary/50 resize-none transition-all"
            {...form.register('situation_description')}
            autoFocus
          />
          <div className="absolute bottom-4 right-4 text-xs text-muted-foreground">
            {formValues.situation_description?.length || 0} chars
          </div>
        </div>
        {errors.situation_description && (
          <p className="text-sm text-red-500 text-center animate-pulse">{errors.situation_description.message}</p>
        )}
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Add Context</h2>
        <p className="text-muted-foreground">Help us understand the environment and emotions.</p>
      </div>

      {/* Locations */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-muted-foreground ml-1">Where does it happen?</label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'home', label: 'Home', icon: Home },
            { id: 'school', label: 'School', icon: School },
            { id: 'public', label: 'Public', icon: Users },
            { id: 'transit', label: 'Transit', icon: Car },
          ].map((loc) => {
            const isSelected = formValues.location_type?.includes(loc.id);
            return (
              <button
                key={loc.id}
                type="button"
                onClick={() => {
                  triggerHaptic('selection');
                  const current = formValues.location_type || [];
                  const next = isSelected ? current.filter(i => i !== loc.id) : [...current, loc.id];
                  setValue('location_type', next, { shouldValidate: true });
                }}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-2xl border transition-all",
                  isSelected 
                    ? "bg-primary/10 border-primary text-primary" 
                    : "bg-card border-border hover:bg-accent"
                )}
              >
                <loc.icon className="w-5 h-5" />
                <span className="font-medium">{loc.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Emotions */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-muted-foreground ml-1">How do you feel?</label>
        <div className="flex flex-wrap gap-2">
          {['Stressed', 'Anxious', 'Angry', 'Exhausted', 'Calm', 'Confused'].map((emotion) => {
            const isSelected = formValues.parent_emotional_state === emotion;
            return (
              <button
                key={emotion}
                type="button"
                onClick={() => {
                  triggerHaptic('selection');
                  setValue('parent_emotional_state', isSelected ? '' : emotion, { shouldValidate: true });
                }}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium border transition-all",
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-transparent border-border hover:border-primary/50"
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

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Final Check</h2>
        <p className="text-muted-foreground">How urgent is this request?</p>
      </div>

      {/* Urgency Selection */}
      <div className="space-y-4">
        {[
          { value: 'low', label: 'Future Planning', desc: 'Just curious, no rush', color: 'bg-blue-500' },
          { value: 'medium', label: 'Regular Issue', desc: 'Happens a few times a week', color: 'bg-yellow-500' },
          { value: 'high', label: 'Daily Struggle', desc: 'Happens every day, exhausting', color: 'bg-orange-500' },
          { value: 'urgent', label: 'SOS / Crisis', desc: 'Need help immediately', color: 'bg-red-500' },
        ].map((level) => {
          const isSelected = formValues.urgency_level === level.value;
          return (
            <button
              key={level.value}
              type="button"
              onClick={() => {
                triggerHaptic('medium');
                setValue('urgency_level', level.value as any);
              }}
              className={cn(
                "w-full flex items-center p-4 rounded-2xl border transition-all relative overflow-hidden group",
                isSelected 
                  ? "border-primary ring-1 ring-primary bg-primary/5" 
                  : "border-border hover:bg-accent/50"
              )}
            >
              <div className={cn("w-3 h-full absolute left-0 top-0 bottom-0", level.color, isSelected ? "opacity-100" : "opacity-30 group-hover:opacity-60")} />
              <div className="pl-6 flex-1 text-left">
                <div className="font-bold text-foreground">{level.label}</div>
                <div className="text-sm text-muted-foreground">{level.desc}</div>
              </div>
              {isSelected && (
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Additional Notes */}
      <div className="pt-4">
        <Input 
          placeholder="Any extra details? (Optional)" 
          className="h-12 bg-secondary/30 border-transparent focus:bg-secondary/50 rounded-xl"
          {...form.register('additional_notes')}
        />
      </div>
    </motion.div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] p-0 gap-0 bg-background border-none shadow-2xl overflow-hidden flex flex-col rounded-[32px]">
        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-secondary/30">
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Header */}
        <DialogHeader className="p-6 pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
              Step {currentStep} of {totalSteps}
            </DialogTitle>
            <button 
              onClick={() => onOpenChange(false)}
              className="p-2 -mr-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 pt-2">
          <AnimatePresence mode="wait">
            <motion.div key={currentStep} className="h-full">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-background/80 backdrop-blur-xl">
          <div className="flex gap-3">
            {currentStep > 1 && (
              <Button 
                variant="outline" 
                onClick={handleBack}
                className="h-14 px-6 rounded-2xl border-2 border-border hover:bg-secondary font-semibold"
              >
                Back
              </Button>
            )}
            
            <Button 
              onClick={currentStep === totalSteps ? handleSubmit(onSubmit) : handleNext}
              disabled={isCreating || (currentStep === 1 && !formValues.situation_description)}
              className="flex-1 h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/25 transition-all active:scale-95"
            >
              {isCreating ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : currentStep === totalSteps ? (
                'Submit Request'
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

function X({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}