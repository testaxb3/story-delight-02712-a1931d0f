import { useEffect, useState } from 'react';
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
  const [isClosing, setIsClosing] = useState(false);

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
      console.log('🎁 Welcome modal fully closed, calling onClose callback');
      onClose();
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent 
        className={`max-w-2xl border border-border/50 bg-card backdrop-blur-xl p-0 overflow-hidden ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogDescription className="sr-only">
          Welcome celebration modal for The Obedience Language purchase
        </DialogDescription>
        {/* Sparkles decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Sparkles className="absolute top-4 left-4 w-6 h-6 text-primary animate-pulse" />
          <Sparkles className="absolute top-8 right-8 w-4 h-4 text-primary/70 animate-pulse" style={{ animationDelay: '0.5s' }} />
          <Sparkles className="absolute bottom-12 left-12 w-5 h-5 text-primary/80 animate-pulse" style={{ animationDelay: '1s' }} />
          <Sparkles className="absolute bottom-8 right-16 w-6 h-6 text-primary/60 animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>

        <div className="relative p-8 sm:p-12 text-center">
          {/* Celebration emoji */}
          <div className="text-7xl mb-4 animate-bounce">🎉</div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl font-bold mb-2 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Welcome to The Obedience Language!
          </h1>
          
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
            Your $47 Investment Just Unlocked Something Incredible
          </h2>
          
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-xl mx-auto">
            You've just gained access to the complete <span className="font-bold text-primary">NEP System</span> - a science-backed method that's already helped thousands of parents transform their relationship with their children.
          </p>

          {/* Benefits list */}
          <div className="bg-gradient-to-br from-muted/30 to-primary/5 backdrop-blur-sm rounded-2xl p-6 mb-8 text-left space-y-4 border border-primary/10">
            <h3 className="font-semibold text-lg mb-4 text-center flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Here's what you just unlocked:
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <span className="text-foreground"><strong>300+ personalized scripts</strong> tailored to your child's brain type</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <span className="text-foreground"><strong>Expert video training library</strong> with step-by-step guidance</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <span className="text-foreground"><strong>Brain Profile Quiz</strong> to discover your child's unique wiring</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <span className="text-foreground"><strong>Exclusive bonuses</strong> including ebooks and tools</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <span className="text-foreground"><strong>Lifetime access</strong> to all future updates and content</span>
              </div>
            </div>
          </div>

          {/* CTA Badge */}
          <Badge variant="outline" className="mb-4 px-4 py-2 text-sm border-primary/30 bg-primary/5">
            <Sparkles className="w-4 h-4 mr-2 text-primary" />
            Everything is ready for you to start
          </Badge>

          {/* CTA Button */}
          <Button
            onClick={handleStartTransformation}
            size="lg"
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <Gift className="w-5 h-5 mr-2" />
            Start My Transformation Now
          </Button>

          <p className="text-xs text-muted-foreground mt-4">
            🚀 Your purchase is complete - Let's discover your child's brain type and unlock their personalized strategies!
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
