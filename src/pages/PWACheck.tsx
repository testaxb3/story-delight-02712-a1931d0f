import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { usePWAInstallation } from '@/hooks/usePWAInstallation';
import { trackEvent } from '@/lib/analytics';
import confetti from 'canvas-confetti';

const PWACheck = () => {
  const navigate = useNavigate();
  const { isInstalled, justInstalled } = usePWAInstallation();
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    trackEvent('pwa_check_page_viewed');
  }, []);

  useEffect(() => {
    if (isInstalled) {
      trackEvent('pwa_check_installed_detected');
      
      // Trigger confetti celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Mark PWA flow as completed and redirect to theme selection after 2 seconds
      setTimeout(() => {
        localStorage.setItem('pwa_flow_completed', 'true');
        localStorage.setItem('pwa_install_timestamp', Date.now().toString());
        navigate('/theme-selection');
      }, 2000);
    } else {
      // Show confirmation screen if not installed
      setShowConfirmation(true);
      trackEvent('pwa_check_not_installed_shown');
    }
  }, [isInstalled, navigate]);

  const handleCheckAgain = () => {
    trackEvent('pwa_check_clicked_check_again');
    // Force re-check by hiding confirmation briefly
    setShowConfirmation(false);
    setTimeout(() => setShowConfirmation(true), 500);
  };

  const handleGoBack = () => {
    trackEvent('pwa_check_clicked_go_back');
    navigate('/pwa-install');
  };

  const handleSkipAnyway = () => {
    trackEvent('pwa_check_clicked_skip_anyway');
    localStorage.setItem('pwa_flow_completed', 'true');
    localStorage.setItem('pwa_install_skipped', Date.now().toString());
    navigate('/theme-selection');
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/10 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-6 pt-[calc(env(safe-area-inset-top)+1rem)] md:pt-[calc(env(safe-area-inset-top)+1.5rem)] pb-[calc(env(safe-area-inset-bottom)+1rem)] overflow-y-auto">
        <AnimatePresence mode="wait">
          {isInstalled ? (
            // Success Screen
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center space-y-4 md:space-y-6 max-w-md"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <CheckCircle2 className="w-20 h-20 md:w-24 md:h-24 text-green-500 mx-auto" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <h1 className="text-3xl md:text-4xl font-bold text-foreground font-relative">
                  Perfect! You're All Set! 🎉
                </h1>
                <p className="text-base md:text-lg text-muted-foreground px-4">
                  The app is installed. Let's continue to your personalized quiz.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-center gap-2 text-xs md:text-sm text-muted-foreground"
              >
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                Redirecting...
              </motion.div>
            </motion.div>
          ) : showConfirmation ? (
            // Confirmation Screen
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-2xl space-y-4 md:space-y-8"
            >
              {/* Soft Header - Not aggressive warning */}
              <div className="text-center space-y-2 md:space-y-4">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-amber-500/10 dark:bg-amber-500/20 mb-2 md:mb-4"
                >
                  <AlertCircle className="w-8 h-8 md:w-10 md:h-10 text-amber-500" />
                </motion.div>

                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground font-relative px-2">
                  Hmm, We Couldn't Detect It Yet
                </h1>

                <p className="text-base md:text-lg lg:text-xl text-muted-foreground px-2">
                  Installation can take a moment. Try checking again or go back to the instructions.
                </p>
              </div>

              {/* Info Card */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="p-3 md:p-4 rounded-lg md:rounded-xl bg-card/50 dark:bg-card border border-border/30"
              >
                <p className="text-center text-muted-foreground text-sm md:text-base">
                  After installing, you might need to <strong>close this browser tab</strong> and <strong>open the app from your home screen</strong> for detection to work.
                </p>
              </motion.div>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col gap-2 md:gap-3"
              >
                <Button
                  onClick={handleCheckAgain}
                  size="lg"
                  className="w-full text-sm md:text-base lg:text-lg h-11 md:h-12 lg:h-14 font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Check Again
                </Button>

                <Button
                  onClick={handleGoBack}
                  variant="outline"
                  size="lg"
                  className="w-full text-sm md:text-base lg:text-lg h-11 md:h-12 lg:h-14"
                >
                  ← Back to Instructions
                </Button>

                <Button
                  onClick={handleSkipAnyway}
                  variant="ghost"
                  size="lg"
                  className="w-full text-sm md:text-base lg:text-lg h-11 md:h-12 lg:h-14 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                >
                  Skip Anyway
                </Button>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PWACheck;
