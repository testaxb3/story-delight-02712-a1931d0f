import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gift, Sparkles, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface WelcomeGiftModalProps {
  open: boolean;
  onClose: () => void;
}

export function WelcomeGiftModal({ open, onClose }: WelcomeGiftModalProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isClosing, setIsClosing] = useState(false);

  // Debug: Log when modal opens/closes
  useEffect(() => {
    console.log('🔍 WelcomeGiftModal open state changed:', open);
  }, [open]);

  useEffect(() => {
    if (open) {
      // Trigger confetti when modal opens
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
          colors: ['#9b87f5', '#D6BCFA', '#FFD700', '#FFA500'],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
          colors: ['#9b87f5', '#D6BCFA', '#FFD700', '#FFA500'],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [open]);

  const handleStartTransformation = async () => {
    console.log('🚀 User clicked Start My Transformation');

    // Big confetti burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#9b87f5', '#D6BCFA', '#FFD700', '#FFA500'],
    });

    // Save to localStorage (fallback)
    localStorage.setItem('welcome_gift_shown', 'true');
    console.log('💾 Saved welcome_gift_shown to localStorage');

    // Save to database
    if (user?.profileId) {
      const { error } = await supabase
        .from('profiles')
        .update({ welcome_modal_shown: true })
        .eq('id', user.profileId);

      if (error) {
        console.error('❌ Failed to update welcome_modal_shown in database:', error);
        // Don't block the user if database update fails
      } else {
        console.log('✅ Saved welcome_modal_shown to database');
      }
    }

    // Close with animation
    setIsClosing(true);
    setTimeout(() => {
      console.log('🎁 Welcome modal fully closed, navigating to quiz');
      onClose();
      navigate('/quiz');
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent 
        className={`w-[95vw] sm:w-full max-w-2xl border border-border/50 bg-card backdrop-blur-xl p-0 overflow-hidden ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogDescription className="sr-only">
          Welcome celebration modal for The Obedience Language purchase
        </DialogDescription>
        {/* Sparkles decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Sparkles className="absolute top-4 left-4 w-5 h-5 sm:w-6 sm:h-6 text-primary animate-pulse" />
          <Sparkles className="absolute top-8 right-8 w-3 h-3 sm:w-4 sm:h-4 text-primary/70 animate-pulse" style={{ animationDelay: '0.5s' }} />
          <Sparkles className="absolute bottom-12 left-12 w-4 h-4 sm:w-5 sm:h-5 text-primary/80 animate-pulse" style={{ animationDelay: '1s' }} />
          <Sparkles className="absolute bottom-8 right-16 w-5 h-5 sm:w-6 sm:h-6 text-primary/60 animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>

        <div className="relative p-4 sm:p-6 md:p-8 text-center">
          {/* Celebration emoji */}
          <div className="text-4xl sm:text-5xl md:text-7xl mb-3 sm:mb-4 md:mb-6 animate-bounce">🧠</div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            You're In! 🎉
          </h1>
          
          <h2 className="text-base sm:text-lg md:text-2xl font-semibold text-foreground mb-2 sm:mb-3">
            Everything Starts with ONE Quiz
          </h2>
          
          <p className="text-xs sm:text-sm md:text-lg text-muted-foreground mb-4 sm:mb-6 md:mb-8 leading-relaxed max-w-xl mx-auto">
            In just 3 minutes, you'll discover your child's brain type and unlock a completely personalized system designed specifically for <span className="font-bold text-primary">how their brain works</span>.
          </p>

          {/* What's Next */}
          <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-8 mb-4 sm:mb-6 md:mb-8 text-left space-y-3 sm:space-y-4 md:space-y-6 border-2 border-primary/20">
            <div className="text-center">
              <h3 className="font-bold text-base sm:text-lg md:text-2xl mb-1 text-foreground">Here's What Happens Next:</h3>
              <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">The exact roadmap to transformation</p>
            </div>
            
            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              <div className="flex items-start gap-2 sm:gap-3 md:gap-4 bg-card/50 p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl">
                <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-sm sm:text-base">
                  1
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground mb-0.5 text-xs sm:text-sm md:text-base">Take the Brain Profile Quiz</p>
                  <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">Discover if your child is INTENSE, DISTRACTED, or DEFIANT</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2 sm:gap-3 md:gap-4 bg-card/50 p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl">
                <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-sm sm:text-base">
                  2
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground mb-0.5 text-xs sm:text-sm md:text-base">Get Your Personalized Scripts</p>
                  <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">Access hundreds of word-for-word scripts for YOUR child's brain</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2 sm:gap-3 md:gap-4 bg-card/50 p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl">
                <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-sm sm:text-base">
                  3
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground mb-0.5 text-xs sm:text-sm md:text-base">Start Seeing Results Today</p>
                  <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">Use your first script within minutes and watch the magic happen</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            onClick={handleStartTransformation}
            size="lg"
            className="w-full h-12 sm:h-14 md:h-16 text-sm sm:text-base md:text-xl font-bold bg-gradient-to-r from-primary via-accent to-primary hover:from-primary/90 hover:via-accent/90 hover:to-primary/90 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <span className="hidden sm:inline">Let's Discover Your Child's Brain Type! 🚀</span>
            <span className="sm:hidden">Start Brain Profile Quiz! 🚀</span>
          </Button>

          <p className="text-[10px] sm:text-xs text-muted-foreground mt-3 sm:mt-4">
            ⏱️ Takes only 3 minutes • 10,000+ parents have already done this
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
