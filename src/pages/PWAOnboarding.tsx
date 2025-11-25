import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { OptimizedYouTubePlayer } from '@/components/VideoPlayer/OptimizedYouTubePlayer';
import { Smartphone, ArrowRight, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useHaptic } from '@/hooks/useHaptic';

export default function PWAOnboarding() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { triggerHaptic } = useHaptic();
  const [step, setStep] = useState<'theme' | 'pwa'>('theme');
  const [deviceType, setDeviceType] = useState<'ios' | 'android' | 'desktop'>('desktop');

  useEffect(() => {
    // Detect device type
    const userAgent = navigator.userAgent || navigator.vendor;

    if (/iPad|iPhone|iPod/.test(userAgent)) {
      setDeviceType('ios');
    } else if (/android/i.test(userAgent)) {
      setDeviceType('android');
    } else {
      setDeviceType('desktop');
    }
  }, []);

  const handleThemeSelect = (selectedTheme: 'light' | 'dark') => {
    setTheme(selectedTheme);

    // Haptic feedback
    triggerHaptic('light');

    // Move to PWA step
    setTimeout(() => {
      setStep('pwa');
    }, 300);
  };

  const handleContinue = () => {
    // Mark onboarding as completed
    localStorage.setItem('pwa_onboarding_completed', 'true');
    navigate('/quiz', { replace: true });
  };

  const handleSkip = () => {
    if (step === 'theme') {
      // If skipping theme, move to PWA step
      setStep('pwa');
    } else {
      // If skipping PWA, go directly to quiz
      localStorage.setItem('pwa_onboarding_completed', 'true');
      navigate('/quiz', { replace: true });
    }
  };

  // Video URLs and IDs
  const videos = {
    ios: {
      url: 'https://www.youtube.com/watch?v=dMEYRym6CGI',
      id: 'dMEYRym6CGI'
    },
    android: {
      url: 'https://www.youtube.com/watch?v=Aibj__ZtzSE',
      id: 'Aibj__ZtzSE'
    }
  };

  const currentVideo = deviceType === 'ios' ? videos.ios : videos.android;

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />

      <AnimatePresence mode="wait">
        {step === 'theme' ? (
          <motion.div
            key="theme"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md space-y-8 relative z-10"
          >
            {/* Header */}
            <div className="text-center space-y-3">
              <h1 className="text-3xl md:text-4xl font-black text-black dark:text-white font-relative">
                Choose Your Theme
              </h1>
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-400">
                Pick the look that feels right for you
              </p>
            </div>

            {/* Theme Options */}
            <div className="grid grid-cols-2 gap-4">
              {/* Light Theme */}
              <motion.button
                onClick={() => handleThemeSelect('light')}
                className={`relative p-6 rounded-2xl border-2 transition-all ${
                  theme === 'light'
                    ? 'border-black bg-black/5'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center">
                    <Sun className="w-8 h-8 text-yellow-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-black">Light</h3>
                    <p className="text-sm text-gray-600 mt-1">Classic & Clean</p>
                  </div>
                </div>
                {theme === 'light' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
              </motion.button>

              {/* Dark Theme */}
              <motion.button
                onClick={() => handleThemeSelect('dark')}
                className={`relative p-6 rounded-2xl border-2 transition-all ${
                  theme === 'dark'
                    ? 'border-white bg-white/10'
                    : 'border-gray-700 hover:border-gray-600 bg-gray-900'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gray-900 border-2 border-gray-700 flex items-center justify-center">
                    <Moon className="w-8 h-8 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Dark</h3>
                    <p className="text-sm text-gray-400 mt-1">Modern & Sleek</p>
                  </div>
                </div>
                {theme === 'dark' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
              </motion.button>
            </div>

            {/* Skip Button */}
            <div className="text-center">
              <button
                onClick={handleSkip}
                className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white text-sm font-medium transition-colors"
              >
                Skip for now
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="pwa"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md space-y-6 relative z-10"
          >
            {/* Header */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2">
                <Smartphone className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-black dark:text-white font-relative">
                Install NEP System
              </h1>
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-400">
                Get the app experience on your {deviceType === 'ios' ? 'iPhone' : deviceType === 'android' ? 'Android' : 'device'}
              </p>
            </div>

            {/* Video Container - Only show on mobile */}
            {deviceType !== 'desktop' && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-xl border border-gray-200 dark:border-gray-800">
                <div className="rounded-xl overflow-hidden">
                  <OptimizedYouTubePlayer
                    videoUrl={currentVideo.url}
                    videoId={currentVideo.id}
                  />
                </div>

                {/* Instructions */}
                <div className="mt-4 space-y-2">
                  <h3 className="font-semibold text-black dark:text-white">Quick Steps:</h3>
                  {deviceType === 'ios' ? (
                    <ol className="text-sm text-gray-700 dark:text-gray-300 space-y-1 list-decimal list-inside">
                      <li>Tap the <strong>Share</strong> button (square with arrow)</li>
                      <li>Scroll and tap <strong>"Add to Home Screen"</strong></li>
                      <li>Tap <strong>"Add"</strong> in the top right</li>
                    </ol>
                  ) : (
                    <ol className="text-sm text-gray-700 dark:text-gray-300 space-y-1 list-decimal list-inside">
                      <li>Tap the <strong>menu</strong> (three dots)</li>
                      <li>Tap <strong>"Add to Home screen"</strong> or <strong>"Install app"</strong></li>
                      <li>Tap <strong>"Add"</strong> or <strong>"Install"</strong></li>
                    </ol>
                  )}
                </div>
              </div>
            )}

            {/* Benefits */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 space-y-2 border border-gray-200 dark:border-gray-800">
              <h3 className="font-semibold text-black dark:text-white text-sm">Why install?</h3>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                  <span>Instant access from your home screen</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                  <span>Works offline with saved content</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                  <span>Faster loading and smoother experience</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                  <span>Get push notifications for updates</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleContinue}
                className="w-full h-12 text-base font-semibold bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90"
                size="lg"
              >
                <span className="flex items-center gap-2">
                  Continue to Quiz
                  <ArrowRight className="w-5 h-5" />
                </span>
              </Button>

              <button
                onClick={handleSkip}
                className="w-full text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white text-sm font-medium transition-colors"
              >
                I'll install it later
              </button>
            </div>

            {/* Footer */}
            <div className="text-center">
              <p className="text-gray-400 dark:text-gray-600 text-xs">
                You can always install the app later from your browser menu
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
