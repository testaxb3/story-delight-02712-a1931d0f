import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Moon, Sun, Bell, Check, ChevronRight, X, Smartphone } from 'lucide-react';
import { useTheme } from 'next-themes';
import { initOneSignal, showPermissionPrompt } from '@/lib/onesignal';
import { useAuth } from '@/contexts/AuthContext';
import { isStandaloneMode, isIOSDevice } from '@/utils/platform';
import { toast } from 'sonner';

interface OnboardingModalProps {
  onComplete: () => void;
}

type Step = 'pwa' | 'theme' | 'notifications';

export function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>('pwa');
  const [isVisible, setIsVisible] = useState(true);
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(isStandaloneMode());

  // Listen for PWA install prompt
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Check if already in standalone mode
  useEffect(() => {
    if (isStandaloneMode()) {
      setIsInstalled(true);
      // Auto-skip PWA step if already installed
      if (currentStep === 'pwa') {
        setCurrentStep('theme');
      }
    }
  }, [currentStep]);

  const handleInstallPWA = useCallback(async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        toast.success('App installed!');
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else if (isIOSDevice()) {
      // Show iOS instructions
      toast.info('Tap the Share button, then "Add to Home Screen"', {
        duration: 5000,
      });
    }
    // Move to next step regardless
    setCurrentStep('theme');
  }, [deferredPrompt]);

  const handleThemeSelect = useCallback((selectedTheme: 'light' | 'dark') => {
    setTheme(selectedTheme);
    localStorage.setItem('theme_selected', 'true');
    setCurrentStep('notifications');
  }, [setTheme]);

  const handleNotifications = useCallback(async (enable: boolean) => {
    if (enable) {
      try {
        await initOneSignal();
        await showPermissionPrompt(user?.id);
        localStorage.setItem('notification_prompted', 'true');
        toast.success('Notifications enabled!');
      } catch (err) {
        console.error('Failed to enable notifications:', err);
        localStorage.setItem('notification_prompted', 'true');
      }
    } else {
      localStorage.setItem('notification_prompted', 'true');
    }

    // Complete onboarding
    localStorage.setItem('onboarding_completed', 'true');
    setIsVisible(false);
    setTimeout(onComplete, 300);
  }, [user?.id, onComplete]);

  const handleSkip = useCallback(() => {
    if (currentStep === 'pwa') {
      setCurrentStep('theme');
    } else if (currentStep === 'theme') {
      localStorage.setItem('theme_selected', 'true');
      setCurrentStep('notifications');
    } else {
      localStorage.setItem('notification_prompted', 'true');
      localStorage.setItem('onboarding_completed', 'true');
      setIsVisible(false);
      setTimeout(onComplete, 300);
    }
  }, [currentStep, onComplete]);

  const handleClose = useCallback(() => {
    // Mark all as completed when closing
    localStorage.setItem('pwa_flow_completed', 'true');
    localStorage.setItem('theme_selected', 'true');
    localStorage.setItem('notification_prompted', 'true');
    localStorage.setItem('onboarding_completed', 'true');
    setIsVisible(false);
    setTimeout(onComplete, 300);
  }, [onComplete]);

  const steps: { key: Step; label: string }[] = [
    { key: 'pwa', label: 'Install' },
    { key: 'theme', label: 'Theme' },
    { key: 'notifications', label: 'Notifications' },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === currentStep);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md mx-4 mb-20 sm:mb-0"
            style={{
              paddingBottom: 'env(safe-area-inset-bottom)',
            }}
          >
            <div className="bg-card rounded-t-3xl sm:rounded-3xl border border-border shadow-2xl overflow-hidden">
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors z-10"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>

              {/* Progress dots */}
              <div className="flex items-center justify-center gap-2 pt-6 pb-2">
                {steps.map((step, index) => (
                  <div
                    key={step.key}
                    className={`h-1.5 rounded-full transition-all duration-300 ${index === currentStepIndex
                        ? 'w-6 bg-primary'
                        : index < currentStepIndex
                          ? 'w-1.5 bg-primary/50'
                          : 'w-1.5 bg-muted'
                      }`}
                  />
                ))}
              </div>

              {/* Content */}
              <div className="px-6 pb-6 pt-4">
                <AnimatePresence mode="wait">
                  {/* PWA Step - Enhanced with instructions */}
                  {currentStep === 'pwa' && (
                    <motion.div
                      key="pwa"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="text-center"
                    >
                      {/* Important badge */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold mb-4"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        IMPORTANT STEP
                      </motion.div>

                      <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                        <Smartphone className="w-10 h-10 text-white" />
                      </div>

                      <h2 className="text-xl font-bold text-foreground mb-2">
                        Install the App
                      </h2>
                      <p className="text-muted-foreground text-sm mb-5">
                        Get the <strong>full experience</strong> with faster access and notifications
                      </p>

                      {isInstalled ? (
                        <motion.div
                          initial={{ scale: 0.9 }}
                          animate={{ scale: 1 }}
                          className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-green-500/10 text-green-600 dark:text-green-400 mb-4"
                        >
                          <Check className="w-5 h-5" />
                          <span className="font-semibold">Already installed!</span>
                        </motion.div>
                      ) : (
                        <>
                          {/* Installation instructions based on platform */}
                          <div className="text-left bg-muted/50 rounded-2xl p-4 mb-4 space-y-3">
                            {isIOSDevice() ? (
                              <>
                                <div className="flex items-center gap-3">
                                  <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">1</div>
                                  <p className="text-sm text-foreground">
                                    Tap <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-500"><Download className="w-3.5 h-3.5" /></span> Share button below
                                  </p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">2</div>
                                  <p className="text-sm text-foreground">
                                    Select "<strong>Add to Home Screen</strong>"
                                  </p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">3</div>
                                  <p className="text-sm text-foreground">
                                    Tap "<strong>Add</strong>" to install
                                  </p>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex items-center gap-3">
                                  <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">1</div>
                                  <p className="text-sm text-foreground">
                                    Tap the <strong>Install</strong> button below
                                  </p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">2</div>
                                  <p className="text-sm text-foreground">
                                    Confirm by tapping "<strong>Install</strong>"
                                  </p>
                                </div>
                              </>
                            )}
                          </div>

                          <button
                            onClick={handleInstallPWA}
                            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity mb-3 shadow-lg shadow-orange-500/30"
                          >
                            <Download className="w-5 h-5" />
                            Install App Now
                          </button>
                        </>
                      )}

                      <button
                        onClick={handleSkip}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {isInstalled ? 'Continue →' : 'Skip for now'}
                      </button>
                    </motion.div>
                  )}

                  {/* Theme Step */}
                  {currentStep === 'theme' && (
                    <motion.div
                      key="theme"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="text-center"
                    >
                      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                        {theme === 'dark' ? (
                          <Moon className="w-8 h-8 text-primary" />
                        ) : (
                          <Sun className="w-8 h-8 text-primary" />
                        )}
                      </div>
                      <h2 className="text-xl font-bold text-foreground mb-2">
                        Choose Your Theme
                      </h2>
                      <p className="text-muted-foreground text-sm mb-6">
                        Select your preferred appearance
                      </p>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <button
                          onClick={() => handleThemeSelect('light')}
                          className={`p-4 rounded-2xl border-2 transition-all ${theme === 'light'
                              ? 'border-primary bg-primary/10'
                              : 'border-border hover:border-primary/50'
                            }`}
                        >
                          <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-white border border-gray-200 flex items-center justify-center">
                            <Sun className="w-6 h-6 text-amber-500" />
                          </div>
                          <span className="text-sm font-medium text-foreground">Light</span>
                        </button>

                        <button
                          onClick={() => handleThemeSelect('dark')}
                          className={`p-4 rounded-2xl border-2 transition-all ${theme === 'dark'
                              ? 'border-primary bg-primary/10'
                              : 'border-border hover:border-primary/50'
                            }`}
                        >
                          <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-gray-900 border border-gray-700 flex items-center justify-center">
                            <Moon className="w-6 h-6 text-indigo-400" />
                          </div>
                          <span className="text-sm font-medium text-foreground">Dark</span>
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Notifications Step */}
                  {currentStep === 'notifications' && (
                    <motion.div
                      key="notifications"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="text-center"
                    >
                      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Bell className="w-8 h-8 text-primary" />
                      </div>
                      <h2 className="text-xl font-bold text-foreground mb-2">
                        Stay Updated
                      </h2>
                      <p className="text-muted-foreground text-sm mb-6">
                        Get reminders and new content notifications
                      </p>

                      <button
                        onClick={() => handleNotifications(true)}
                        className="w-full py-3.5 px-6 rounded-2xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity mb-3"
                      >
                        <Bell className="w-5 h-5" />
                        Enable Notifications
                      </button>

                      <button
                        onClick={() => handleNotifications(false)}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Maybe later
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
