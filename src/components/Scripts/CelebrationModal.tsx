import { useEffect, useCallback } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import type { CelebrationType, CelebrationData } from '@/hooks/useCelebration';

interface CelebrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  celebrationData: CelebrationData | null;
}

interface CelebrationContent {
  emoji: string;
  title: string;
  message: string;
  stat: string;
  shareMessage: string;
  confettiType: 'burst' | 'fireworks' | 'rain' | 'rainbow';
  gradientColors: string;
}

export const CelebrationModal = ({
  open,
  onOpenChange,
  celebrationData,
}: CelebrationModalProps) => {
  const navigate = useNavigate();

  // Trigger confetti animation based on type
  const triggerConfetti = useCallback((type: 'burst' | 'fireworks' | 'rain' | 'rainbow') => {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

    switch (type) {
      case 'burst':
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: colors,
        });
        break;

      case 'fireworks':
        // Multiple bursts for fireworks effect
        const duration = 2000;
        const end = Date.now() + duration;

        const frame = () => {
          confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.7 },
            colors: colors,
          });
          confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.7 },
            colors: colors,
          });

          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }
        };
        frame();
        break;

      case 'rain':
        // Gentle rain from top
        const count = 50;
        const defaults = {
          origin: { y: 0 },
          colors: colors,
        };

        const rainFrame = () => {
          confetti({
            ...defaults,
            particleCount: 2,
            angle: 90,
            spread: 45,
            startVelocity: 25,
            decay: 0.9,
          });
        };

        for (let i = 0; i < count; i++) {
          setTimeout(rainFrame, i * 30);
        }
        break;

      case 'rainbow':
        confetti({
          particleCount: 100,
          spread: 160,
          origin: { y: 0.6 },
          colors: colors,
          shapes: ['circle', 'square'],
          gravity: 1.2,
        });
        // Second burst for emphasis
        setTimeout(() => {
          confetti({
            particleCount: 50,
            spread: 100,
            origin: { y: 0.6 },
            colors: colors,
          });
        }, 200);
        break;
    }
  }, []);

  // Get celebration content based on trigger type
  const getCelebrationContent = useCallback((): CelebrationContent | null => {
    if (!celebrationData) return null;

    const { type, scriptTitle, totalScriptsUsed, streakDays, daysSinceStart } =
      celebrationData;

    switch (type) {
      case 'script_success':
        return {
          emoji: '🎉',
          title: 'It Worked!',
          message: scriptTitle
            ? `You just handled "${scriptTitle}" like a pro!`
            : 'You just handled that situation like a pro!',
          stat: `You've used ${totalScriptsUsed || 0} scripts total`,
          shareMessage: scriptTitle
            ? `I just used the "${scriptTitle}" script and it WORKED! 🎉`
            : 'I just used a NEP script and it WORKED! 🎉',
          confettiType: 'burst',
          gradientColors: 'from-purple-500 via-pink-500 to-orange-500',
        };

      case 'milestone_5':
        return {
          emoji: '🔥',
          title: "You're on Fire!",
          message: '5 scripts used! You\'re building serious momentum.',
          stat: `${totalScriptsUsed || 5} total scripts used`,
          shareMessage: `Just hit ${totalScriptsUsed || 5} scripts used! The NEP System is changing everything 🔥`,
          confettiType: 'fireworks',
          gradientColors: 'from-orange-500 via-red-500 to-pink-500',
        };

      case 'first_today':
        return {
          emoji: '☀️',
          title: 'Strong Start!',
          message: "First script of the day - you're showing up for your child!",
          stat: `Day ${daysSinceStart || 1} of your journey`,
          shareMessage: 'Starting my day strong with NEP! ☀️',
          confettiType: 'rain',
          gradientColors: 'from-yellow-400 via-orange-400 to-yellow-500',
        };

      case 'streak_3':
        return {
          emoji: '🎯',
          title: '3-Day Streak!',
          message: "Consistency is everything. You're becoming a NEP expert!",
          stat: `${streakDays || 3} days in a row`,
          shareMessage: `3 days of using NEP scripts consistently! Feeling like a better parent 🎯`,
          confettiType: 'rainbow',
          gradientColors: 'from-green-500 via-emerald-500 to-teal-500',
        };

      default:
        return null;
    }
  }, [celebrationData]);

  const content = getCelebrationContent();

  // Trigger confetti when modal opens
  useEffect(() => {
    if (open && content) {
      // Small delay to ensure modal is visible
      const timer = setTimeout(() => {
        triggerConfetti(content.confettiType);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [open, content, triggerConfetti]);

  const handleShareWin = () => {
    if (!content) return;

    navigate('/community', {
      state: {
        defaultTab: 'win',
        prefill: content.shareMessage,
      },
    });
    onOpenChange(false);
  };

  if (!content) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-none shadow-2xl overflow-hidden p-0">
        {/* Gradient Background */}
        <div
          className={`relative bg-gradient-to-br ${content.gradientColors} p-8 text-center text-white`}
        >
          {/* Decorative overlay */}
          <div className="absolute inset-0 bg-black/10" />

          {/* Content */}
          <div className="relative z-10 space-y-6">
            {/* Emoji */}
            <div className="text-7xl animate-bounce">{content.emoji}</div>

            {/* Title */}
            <h2 className="text-4xl font-bold leading-tight">
              {content.title}
            </h2>

            {/* Message */}
            <p className="text-xl text-white/90 leading-relaxed max-w-sm mx-auto">
              {content.message}
            </p>

            {/* Stat Badge */}
            <div className="inline-block">
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 font-semibold text-lg shadow-lg">
                {content.stat}
              </div>
            </div>

            {/* Share Button */}
            <Button
              onClick={handleShareWin}
              className="w-full max-w-xs mx-auto bg-white text-purple-600 font-semibold py-6 px-8 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 text-base"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Share this win to Community
            </Button>

            {/* Close Button */}
            <Button
              onClick={() => onOpenChange(false)}
              variant="ghost"
              className="text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              Continue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
