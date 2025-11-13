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
          Welcome gift modal offering lifetime premium access to NEP System
        </DialogDescription>
        {/* Sparkles decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Sparkles className="absolute top-4 left-4 w-6 h-6 text-primary animate-pulse" />
          <Sparkles className="absolute top-8 right-8 w-4 h-4 text-primary/70 animate-pulse" style={{ animationDelay: '0.5s' }} />
          <Sparkles className="absolute bottom-12 left-12 w-5 h-5 text-primary/80 animate-pulse" style={{ animationDelay: '1s' }} />
          <Sparkles className="absolute bottom-8 right-16 w-6 h-6 text-primary/60 animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>

        <div className="relative p-8 sm:p-12 text-center">
          {/* Gift emoji */}
          <div className="text-7xl mb-4 animate-bounce">🎁</div>

          {/* Heading */}
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            WELCOME TO NEP SYSTEM!
          </h1>

          {/* Subheading */}
          <p className="text-xl font-semibold text-primary mb-4">
            SPECIAL LAUNCH GIFT
          </p>

          {/* Main announcement */}
          <div className="mb-4">
            <p className="text-2xl font-bold mb-2 text-foreground">
              ✨ Lifetime PREMIUM Access Unlocked!
            </p>
            <Badge className="bg-primary text-primary-foreground border-none px-4 py-1 text-sm font-semibold">
              Value: $297/year
            </Badge>
          </div>

          {/* Description */}
          <p className="text-base text-muted-foreground mb-6 max-w-xl mx-auto leading-relaxed">
            You're among the first to believe in the NEP method. As a thank you, we're unlocking ALL premium content at NO additional cost. Forever! 🚀
          </p>

          {/* Benefits card */}
          <div className="bg-muted/30 border border-border/30 rounded-lg p-6 mb-6 text-left max-w-md mx-auto">
            <h3 className="font-bold text-lg mb-4 text-center text-foreground">What you get:</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm text-foreground">25+ Advanced NEP Scripts</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm text-foreground">9 Complete Training Videos</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm text-foreground">8 Premium Exclusive PDFs</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm text-foreground">Priority WhatsApp Support</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm text-foreground">All Future Updates Included</span>
              </li>
            </ul>
          </div>

          {/* CTA Button */}
          <Button 
            size="lg" 
            className="w-full max-w-md font-semibold text-lg py-6"
            onClick={handleStartTransformation}
          >
            Start My Transformation →
          </Button>

          {/* Footer */}
          <p className="text-xs text-muted-foreground mt-6">
            This gift is exclusive to our first customers
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
