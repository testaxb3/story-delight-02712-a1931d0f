import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Share2, Undo2, Sparkles, Heart, Lightbulb } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import confetti from 'canvas-confetti';

interface ScriptActionButtonsProps {
  scriptId: string;
  scriptTitle: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onMarkUsed: () => void;
}

const USAGE_KEY_PREFIX = 'script_usage_count_';
const LAST_USED_KEY_PREFIX = 'script_last_used_';

export function ScriptActionButtons({
  scriptId,
  scriptTitle,
  isFavorite,
  onToggleFavorite,
  onMarkUsed,
}: ScriptActionButtonsProps) {
  const [isMarking, setIsMarking] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFavAnimating, setIsFavAnimating] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [lastUsed, setLastUsed] = useState<Date | null>(null);
  const [showUndo, setShowUndo] = useState(false);
  const [undoTimer, setUndoTimer] = useState<NodeJS.Timeout | null>(null);

  // Load usage data from localStorage
  useEffect(() => {
    const count = parseInt(localStorage.getItem(`${USAGE_KEY_PREFIX}${scriptId}`) || '0');
    const lastUsedStr = localStorage.getItem(`${LAST_USED_KEY_PREFIX}${scriptId}`);

    setUsageCount(count);
    if (lastUsedStr) {
      setLastUsed(new Date(lastUsedStr));
    }
  }, [scriptId]);

  // Cleanup timer on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (undoTimer) {
        clearTimeout(undoTimer);
      }
    };
  }, [undoTimer]);

  // Haptic feedback (vibration on mobile)
  const triggerHaptic = (pattern: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: 10,
        medium: 20,
        heavy: [10, 20, 10],
      };
      navigator.vibrate(patterns[pattern]);
    }
  };

  // Confetti animation
  const triggerConfetti = () => {
    const duration = 2000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  // Handle Mark as Used
  const handleMarkUsed = async () => {
    if (isMarking || isSuccess) return;

    setIsMarking(true);
    triggerHaptic('medium');

    // Simulate API call delay
    setTimeout(async () => {
      const newCount = usageCount + 1;
      const now = new Date();

      // Call parent handler first (updates Supabase)
      onMarkUsed();

      // Then save to localStorage for offline support
      localStorage.setItem(`${USAGE_KEY_PREFIX}${scriptId}`, newCount.toString());
      localStorage.setItem(`${LAST_USED_KEY_PREFIX}${scriptId}`, now.toISOString());

      setUsageCount(newCount);
      setLastUsed(now);
      setIsMarking(false);
      setIsSuccess(true);

      // Trigger confetti
      triggerConfetti();
      triggerHaptic('heavy');

      // Show undo option
      setShowUndo(true);
      const timer = setTimeout(() => {
        setShowUndo(false);
        setIsSuccess(false);
      }, 5000);
      setUndoTimer(timer);

      // Success toast
      toast({
        title: `🎉 Script marked as used! ${newCount === 1 ? '' : `(${newCount}x)`}`,
        description: `Great job using "${scriptTitle}"`,
        duration: 3000,
        className: 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200',
      });
    }, 500);
  };

  // Handle Undo
  const handleUndo = () => {
    if (!showUndo) return;

    const newCount = Math.max(0, usageCount - 1);
    localStorage.setItem(`${USAGE_KEY_PREFIX}${scriptId}`, newCount.toString());

    if (newCount === 0) {
      localStorage.removeItem(`${LAST_USED_KEY_PREFIX}${scriptId}`);
      setLastUsed(null);
    }

    setUsageCount(newCount);
    setShowUndo(false);
    setIsSuccess(false);

    if (undoTimer) {
      clearTimeout(undoTimer);
      setUndoTimer(null);
    }

    triggerHaptic('light');

    toast({
      title: '↩️ Undone',
      description: 'Usage removed',
      duration: 2000,
    });
  };

  // Handle Favorite Toggle
  const handleFavoriteToggle = () => {
    setIsFavAnimating(true);
    triggerHaptic('light');
    onToggleFavorite();

    setTimeout(() => setIsFavAnimating(false), 600);

    if (!isFavorite) {
      toast({
        title: '⭐ Added to favorites!',
        description: `"${scriptTitle}" saved for quick access`,
        duration: 2000,
      });
    }
  };

  // Handle Share
  const handleShare = async () => {
    triggerHaptic('light');

    if (navigator.share) {
      try {
        await navigator.share({
          title: scriptTitle,
          text: `Check out this NEP script: ${scriptTitle}`,
          url: window.location.href,
        });

        toast({
          title: '📤 Shared successfully!',
          duration: 2000,
        });
      } catch (err) {
        // User cancelled share
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(`${scriptTitle}\n${window.location.href}`);

      toast({
        title: '📋 Copied to clipboard!',
        description: 'Script link ready to share',
        duration: 2000,
      });
    }
  };

  // Format last used time
  const getLastUsedText = () => {
    if (!lastUsed) return null;

    const now = new Date();
    const diffMs = now.getTime() - lastUsed.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return lastUsed.toLocaleDateString();
  };

  return (
    <TooltipProvider>
      <div className="space-y-3">
        {/* Usage Stats Badge */}
        {usageCount > 0 && (
          <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-rose-500/10 dark:from-purple-500/20 dark:via-pink-500/20 dark:to-rose-500/20 rounded-xl border-2 border-purple-300/60 dark:border-purple-700/60 shadow-lg shadow-purple-500/10 dark:shadow-purple-500/20 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-md">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-bold text-purple-900 dark:text-purple-100">
                Used {usageCount}x
              </span>
            </div>
            {lastUsed && (
              <span className="text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/40 px-3 py-1 rounded-full">
                {getLastUsedText()}
              </span>
            )}
          </div>
        )}

        {/* Main Action Buttons */}
        <div className="space-y-3">
          {/* Mark as Used Button - Full width */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleMarkUsed}
                disabled={isMarking || isSuccess}
                className={`
                  relative w-full h-14 sm:h-16 text-sm sm:text-base font-bold
                  transition-all duration-300 overflow-hidden group
                  ${isSuccess
                    ? 'bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 shadow-xl shadow-green-500/30 dark:shadow-green-500/40 scale-[1.02]'
                    : 'bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 hover:from-green-500 hover:via-emerald-500 hover:to-teal-500 shadow-lg shadow-green-600/20 dark:shadow-green-600/30 hover:shadow-xl hover:shadow-green-500/30 dark:hover:shadow-green-500/40 hover:scale-[1.02]'
                  }
                  border-2 border-green-400/30 dark:border-green-500/30
                `}
                size="lg"
              >
                {/* Animated background shimmer */}
                <div className={`
                  absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0
                  ${isMarking ? 'animate-shimmer' : ''}
                `} />

                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Icon with animation */}
                <div className="relative flex items-center gap-3">
                  {isMarking && (
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {isSuccess && (
                    <Check className="w-6 h-6 animate-bounce drop-shadow-lg" />
                  )}
                  {!isMarking && !isSuccess && (
                    <Check className="w-6 h-6 transition-transform group-hover:scale-125 group-hover:rotate-12 drop-shadow-md" />
                  )}
                  <span className="drop-shadow-md">
                    {isMarking ? 'Marking...' : isSuccess ? 'Marked!' : 'Mark as Used'}
                  </span>
                </div>

                {/* Success particles */}
                {isSuccess && (
                  <div className="absolute inset-0 pointer-events-none">
                    <Sparkles className="absolute top-3 right-6 w-5 h-5 text-white animate-ping" />
                    <Sparkles className="absolute top-4 left-8 w-4 h-4 text-white/80 animate-ping animation-delay-100" />
                    <Heart className="absolute bottom-3 left-6 w-4 h-4 text-white/90 animate-pulse" />
                  </div>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Mark this script as successfully used</p>
            </TooltipContent>
          </Tooltip>

          {/* Favorite and Share Buttons - Side by side on mobile */}
          <div className="grid grid-cols-2 gap-3">
            {/* Favorite Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleFavoriteToggle}
                  variant="outline"
                  className={`
                    group relative h-14 sm:h-16 px-4 sm:px-8 text-sm sm:text-base font-bold border-2 sm:border-3
                    transition-all duration-300 overflow-hidden
                    ${isFavorite
                      ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 dark:from-yellow-900/30 dark:via-amber-900/30 dark:to-orange-900/30 shadow-xl shadow-yellow-400/20 dark:shadow-yellow-400/30 scale-[1.02]'
                      : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-yellow-400 dark:hover:border-yellow-400 hover:bg-gradient-to-br hover:from-yellow-50 hover:via-amber-50 hover:to-orange-50 dark:hover:from-yellow-900/20 dark:hover:via-amber-900/20 dark:hover:to-orange-900/20 shadow-lg shadow-slate-300/20 dark:shadow-slate-700/30 hover:shadow-xl hover:shadow-yellow-400/20 dark:hover:shadow-yellow-400/30 hover:scale-[1.02]'
                    }
                  `}
                  size="lg"
                >
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-yellow-200/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <Star
                    className={`
                      relative w-5 h-5 sm:w-6 sm:h-6 sm:mr-3 transition-all duration-300 drop-shadow-md
                      ${isFavorite ? 'fill-yellow-400 text-yellow-400 drop-shadow-lg' : 'text-slate-600 dark:text-slate-400 group-hover:text-yellow-500'}
                      ${isFavAnimating ? 'animate-bounce scale-150' : 'group-hover:scale-110 group-hover:rotate-12'}
                    `}
                  />
                  <span className="relative hidden sm:inline drop-shadow-sm">
                    {isFavorite ? 'Favorited' : 'Favorite'}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isFavorite ? 'Remove from favorites' : 'Add to favorites for quick access'}</p>
              </TooltipContent>
            </Tooltip>

            {/* Share Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="group relative h-14 sm:h-16 px-4 sm:px-8 text-sm sm:text-base font-bold border-2 sm:border-3 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-lg shadow-slate-300/20 dark:shadow-slate-700/30 hover:shadow-xl hover:border-blue-400 dark:hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50 hover:via-cyan-50 hover:to-sky-50 dark:hover:from-blue-900/20 dark:hover:via-cyan-900/20 dark:hover:to-sky-900/20 hover:shadow-blue-400/20 dark:hover:shadow-blue-400/30 transition-all duration-300 hover:scale-[1.02] overflow-hidden"
                  size="lg"
                >
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-200/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <Share2 className="relative w-5 h-5 sm:w-6 sm:h-6 sm:mr-3 text-slate-600 dark:text-slate-400 group-hover:text-blue-500 transition-all duration-300 group-hover:scale-110 drop-shadow-md" />
                  <span className="relative hidden sm:inline drop-shadow-sm">Share</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share this script with others</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Undo Button */}
        {showUndo && (
          <div className="animate-in slide-in-from-bottom-4 duration-300">
            <Button
              onClick={handleUndo}
              variant="ghost"
              className="group w-full h-14 text-sm font-bold hover:bg-gradient-to-r hover:from-orange-50 hover:via-amber-50 hover:to-yellow-50 dark:hover:from-orange-900/20 dark:hover:via-amber-900/20 dark:hover:to-yellow-900/20 border-2 border-orange-300 dark:border-orange-700 hover:border-orange-400 dark:hover:border-orange-500 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.01]"
            >
              <Undo2 className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
              Undo Mark as Used
            </Button>
          </div>
        )}

        {/* Tips for first time users */}
        {usageCount === 0 && (
          <div className="px-5 py-4 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-sky-500/10 dark:from-blue-500/20 dark:via-cyan-500/20 dark:to-sky-500/20 rounded-xl border-2 border-blue-300/60 dark:border-blue-700/60 shadow-md backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg shadow-md shrink-0">
                <Lightbulb className="w-4 h-4 text-white" />
              </div>
              <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                <strong className="font-bold">Tip:</strong> Mark scripts as "used" to track your progress and get personalized insights!
              </p>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}

// Add keyframes for shimmer animation to your global CSS or tailwind.config.js
// @keyframes shimmer {
//   0% { transform: translateX(-100%); }
//   100% { transform: translateX(100%); }
// }
