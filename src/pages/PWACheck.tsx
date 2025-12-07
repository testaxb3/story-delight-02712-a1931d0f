import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { usePWAInstallation } from '@/hooks/usePWAInstallation';
import { trackEvent } from '@/lib/analytics';
import confetti from 'canvas-confetti';

const PWACheck = () => {
  const navigate = useNavigate();
  const { isInstalled } = usePWAInstallation();
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    trackEvent('pwa_check_page_viewed');
  }, []);

  useEffect(() => {
    if (isInstalled) {
      trackEvent('pwa_check_installed_detected');
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      setTimeout(() => {
        localStorage.setItem('pwa_flow_completed', 'true');
        localStorage.setItem('pwa_install_timestamp', Date.now().toString());
        navigate('/theme-selection');
      }, 2000);
    } else {
      setShowConfirmation(true);
      trackEvent('pwa_check_not_installed_shown');
    }
  }, [isInstalled, navigate]);

  const handleCheckAgain = () => {
    trackEvent('pwa_check_clicked_check_again');
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
    <div 
      className="min-h-screen bg-secondary/30 dark:bg-background flex flex-col"
      style={{ 
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}
    >
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">
        <AnimatePresence mode="wait">
          {isInstalled ? (
            // Success Screen
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center space-y-5 max-w-sm"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-500/20"
              >
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <h1 className="text-2xl font-bold text-foreground">
                  You're All Set! 🎉
                </h1>
                <p className="text-muted-foreground">
                  The app is installed. Let's continue.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
              >
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                Redirecting...
              </motion.div>
            </motion.div>
          ) : showConfirmation ? (
            // Confirmation Screen - Light Mode Optimized
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-sm space-y-5"
            >
              {/* Header */}
              <div className="text-center space-y-3">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-500/20 border-2 border-amber-200 dark:border-amber-500/30"
                >
                  <AlertCircle className="w-8 h-8 text-amber-500" />
                </motion.div>

                <h1 className="text-xl font-bold text-foreground">
                  Not Detected Yet
                </h1>

                <p className="text-sm text-muted-foreground">
                  Installation can take a moment. Try again or go back.
                </p>
              </div>

              {/* Info Card */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="p-4 rounded-xl bg-card border border-border shadow-sm"
              >
                <p className="text-center text-sm text-muted-foreground">
                  After installing, <span className="font-medium text-foreground">close this browser</span> and <span className="font-medium text-foreground">open from home screen</span>.
                </p>
              </motion.div>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col gap-2"
              >
                <Button
                  onClick={handleCheckAgain}
                  size="lg"
                  className="w-full h-12 font-semibold bg-emerald-500 hover:bg-emerald-600 text-white shadow-md"
                >
                  Check Again
                </Button>

                <Button
                  onClick={handleGoBack}
                  variant="outline"
                  size="lg"
                  className="w-full h-12 font-medium bg-card border-border hover:bg-secondary"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Instructions
                </Button>

                <button
                  onClick={handleSkipAnyway}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2 mt-1"
                >
                  Skip anyway
                </button>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PWACheck;
