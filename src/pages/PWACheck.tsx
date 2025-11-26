import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertCircle, Bell, WifiOff, Zap, Smartphone, Lock, Download } from 'lucide-react';
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

  const handleGoBack = () => {
    trackEvent('pwa_check_clicked_go_back');
    navigate('/pwa-install');
  };

  const handleContinueAnyway = () => {
    // ✅ FIX: Add confirmation before allowing skip to increase installation rates
    const confirmed = window.confirm(
      "Are you sure you want to continue without installing the app? You'll miss out on push notifications, offline access, and other premium features."
    );
    
    if (!confirmed) {
      trackEvent('pwa_check_skip_cancelled');
      return;
    }
    
    trackEvent('pwa_check_clicked_continue_anyway');
    localStorage.setItem('pwa_flow_completed', 'true');
    localStorage.setItem('pwa_install_skipped', Date.now().toString());
    navigate('/theme-selection');
  };

  const missingFeatures = [
    {
      icon: Bell,
      title: 'Push notifications for new scripts',
    },
    {
      icon: WifiOff,
      title: 'Offline access to your content',
    },
    {
      icon: Zap,
      title: 'Faster app performance',
    },
    {
      icon: Smartphone,
      title: 'Home screen quick access',
    },
    {
      icon: Download,
      title: 'Premium app-only features',
    },
    {
      icon: Lock,
      title: 'Enhanced security',
    },
  ];

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
              {/* Warning Header */}
              <div className="text-center space-y-2 md:space-y-4">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-destructive/10 dark:bg-destructive/20 mb-2 md:mb-4"
                >
                  <AlertCircle className="w-8 h-8 md:w-10 md:h-10 text-destructive" />
                </motion.div>

                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground font-relative px-2">
                  Wait! Are You Sure?
                </h1>

                <p className="text-base md:text-lg lg:text-xl text-muted-foreground px-2">
                  Without the installed app, you'll miss out on:
                </p>
              </div>

              {/* Missing Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4"
              >
                {missingFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="flex items-center gap-2.5 md:gap-3 p-3 md:p-4 rounded-lg md:rounded-xl bg-card/50 dark:bg-card border border-border/30 opacity-60"
                  >
                    <div className="relative flex-shrink-0">
                      <feature.icon className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground" />
                      <Lock className="absolute -top-1 -right-1 w-2.5 h-2.5 md:w-3 md:h-3 text-destructive" />
                    </div>
                    <span className="text-xs md:text-sm text-muted-foreground line-through">
                      {feature.title}
                    </span>
                  </motion.div>
                ))}
              </motion.div>

              {/* Recommendation Text */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="p-3 md:p-4 rounded-lg md:rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/20"
              >
                <p className="text-center text-foreground text-sm md:text-base">
                  We <strong>highly recommend</strong> installing the app to get the full <strong>Nep System</strong> experience.
                  It only takes <strong>15 seconds</strong>!
                </p>
              </motion.div>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col gap-2 md:gap-3"
              >
                <Button
                  onClick={handleGoBack}
                  size="lg"
                  className="w-full text-sm md:text-base lg:text-lg h-11 md:h-12 lg:h-14 font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  ← Go Back and Install
                </Button>

                <Button
                  onClick={handleContinueAnyway}
                  variant="ghost"
                  size="lg"
                  className="w-full text-sm md:text-base lg:text-lg h-11 md:h-12 lg:h-14 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                >
                  Continue Without App (not recommended)
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
