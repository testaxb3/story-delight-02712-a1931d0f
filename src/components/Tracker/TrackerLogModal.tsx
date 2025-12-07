import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useHaptic } from '@/hooks/useHaptic';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';
import type { TrackerDay } from '@/hooks/useTrackerDays';

interface TrackerLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  nextDay: TrackerDay | null;
  onComplete: () => void;
}

export function TrackerLogModal({ isOpen, onClose, nextDay, onComplete }: TrackerLogModalProps) {
  const [stressLevel, setStressLevel] = useState<number>(3);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { triggerHaptic } = useHaptic();

  const handleSave = async () => {
    if (!nextDay) return;

    setSaving(true);
    triggerHaptic('success');
    
    // 1. SHOW SUCCESS UI
    setShowSuccess(true);
    
    // 2. TRIGGER CONFETTI
    const end = Date.now() + 1000;
    const colors = ['#bb0000', '#ffffff'];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
        zIndex: 9999
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
        zIndex: 9999
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();

    // 3. DB UPDATE
    const { error } = await supabase
      .from('tracker_days')
      .update({
        completed: true,
        stress_level: stressLevel,
        completed_at: new Date().toISOString(),
      })
      .eq('id', nextDay.id);

    if (error) {
      toast.error('Connection error. Please check your internet.');
      setSaving(false);
      setShowSuccess(false);
      return;
    }

    // 4. CLOSE MODAL AFTER DELAY
    setTimeout(() => {
      onComplete();
      onClose();
      setSaving(false);
      setShowSuccess(false);
      setStressLevel(3);
    }, 1800);
  };

  const handleClose = () => {
    if (!saving && !showSuccess) {
      onClose();
      setStressLevel(3);
    }
  };

  if (!nextDay) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ y: "100%", scale: 0.95 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: "100%", scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-card border-t border-border/40 rounded-t-[32px] sm:rounded-[32px] p-6 pb-10 shadow-2xl overflow-hidden"
          >
            {/* Success View Overlay */}
            <AnimatePresence>
              {showSuccess && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20 bg-green-500 flex flex-col items-center justify-center text-white p-6 text-center"
                >
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", damping: 15 }}
                    className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-md"
                  >
                    <Check className="w-12 h-12 stroke-[4]" />
                  </motion.div>
                  <h3 className="text-3xl font-black font-relative mb-2">Day Completed!</h3>
                  <p className="text-white/90 font-medium">Streak updated successfully.</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-muted/30 rounded-full" />
            
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted/20 transition-colors"
              disabled={saving || showSuccess}
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>

            <div className="mt-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-black font-relative text-foreground">Day {nextDay.day_number}</h3>
                  <p className="text-sm text-muted-foreground font-medium">Log your progress</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-foreground mb-3">
                    How was your stress level today?
                  </label>
                  <div className="flex gap-2 justify-between">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <button
                        key={level}
                        onClick={() => !saving && setStressLevel(level)}
                        disabled={saving}
                        className={cn(
                          "flex-1 aspect-square rounded-2xl border-2 font-bold text-lg transition-all",
                          stressLevel === level
                            ? "bg-primary border-primary text-primary-foreground shadow-lg scale-105"
                            : "bg-card border-border/40 text-muted-foreground hover:border-primary/50 hover:bg-card/80"
                        )}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 px-1">
                    <span className="text-xs text-muted-foreground font-medium">Calm</span>
                    <span className="text-xs text-muted-foreground font-medium">Stressed</span>
                  </div>
                </div>

                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg rounded-2xl shadow-xl"
                >
                  {saving ? "Saving..." : "Complete Day"}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
