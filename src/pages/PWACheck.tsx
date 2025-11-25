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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex flex-col items-center justify-center p-6">
      <AnimatePresence mode="wait">
        {isInstalled ? (
          // Success Screen
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center space-y-6 max-w-md"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <CheckCircle2 className="w-24 h-24 text-green-500 mx-auto" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              <h1 className="text-4xl font-bold text-foreground">
                Perfect! You're All Set! 🎉
              </h1>
              <p className="text-lg text-muted-foreground">
                The app is installed. Let's continue to your personalized quiz.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
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
            className="w-full max-w-2xl space-y-8"
          >
            {/* Warning Header */}
            <div className="text-center space-y-4">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10 mb-4"
              >
                <AlertCircle className="w-10 h-10 text-destructive" />
              </motion.div>
              
              <h1 className="text-4xl font-bold text-foreground">
                Wait! Are You Sure?
              </h1>
              
              <p className="text-xl text-muted-foreground">
                Without the installed app, you'll miss out on:
              </p>
            </div>

            {/* Missing Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {missingFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border opacity-60"
                >
                  <div className="relative">
                    <feature.icon className="w-6 h-6 text-muted-foreground" />
                    <Lock className="absolute -top-1 -right-1 w-3 h-3 text-destructive" />
                  </div>
                  <span className="text-sm text-muted-foreground line-through">
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
              className="p-4 rounded-lg bg-primary/5 border border-primary/20"
            >
              <p className="text-center text-foreground">
                We <strong>highly recommend</strong> installing the app to get the full NEP System experience. 
                It only takes <strong>15 seconds</strong>!
              </p>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col gap-3"
            >
              <Button
                onClick={handleGoBack}
                size="lg"
                className="w-full text-lg h-14"
              >
                ← Go Back and Install
              </Button>
              
              <Button
                onClick={handleContinueAnyway}
                variant="ghost"
                size="lg"
                className="w-full text-lg h-14 text-muted-foreground hover:text-foreground"
              >
                Continue Without App (not recommended)
              </Button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default PWACheck;
