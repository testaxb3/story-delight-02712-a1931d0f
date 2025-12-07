import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Zap, Bell, Smartphone, Download } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import { useEffect, useState } from 'react';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { PWAInstallSheet } from '@/components/PWAInstallSheet';

const PWAInstall = () => {
  const navigate = useNavigate();
  const { isInstallable, isInstalled, promptInstall } = usePWAInstall();
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    try {
      trackEvent('pwa_install_page_viewed');
    } catch (err) {
      console.error('[PWAInstall] Analytics tracking failed:', err);
    }
  }, []);

  // If already installed, redirect to check
  useEffect(() => {
    if (isInstalled) {
      navigate('/pwa-check');
    }
  }, [isInstalled, navigate]);

  const features = [
    { icon: Smartphone, label: 'Home Screen' },
    { icon: Zap, label: 'Fast Access' },
    { icon: Bell, label: 'Notifications' },
  ];

  const handleInstallClick = async () => {
    // If native prompt available (Android/Chrome), use it directly
    if (isInstallable) {
      trackEvent('pwa_install_clicked_native');
      const success = await promptInstall();
      if (success) {
        trackEvent('pwa_install_native_accepted');
        navigate('/pwa-check');
      } else {
        trackEvent('pwa_install_native_dismissed');
      }
    } else {
      // Otherwise show step-by-step instructions sheet
      trackEvent('pwa_install_clicked_instructions');
      setShowInstructions(true);
    }
  };

  const handleComplete = () => {
    trackEvent('pwa_install_completed');
    setShowInstructions(false);
    navigate('/pwa-check');
  };

  const handleSkip = () => {
    trackEvent('pwa_install_clicked_skip');
    localStorage.setItem('pwa_flow_completed', 'true');
    localStorage.setItem('pwa_install_skipped', Date.now().toString());
    navigate('/theme-selection');
  };

  return (
    <div 
      className="min-h-screen bg-white dark:bg-black flex flex-col"
      style={{ 
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}
    >
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm flex flex-col items-center gap-6"
        >
          {/* App Icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          >
            <img 
              src="/icon-192.png" 
              alt="NEP System" 
              className="w-24 h-24 rounded-3xl shadow-2xl"
            />
          </motion.div>

          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Get the Full Experience
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Install our app for instant access
            </p>
          </div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center gap-8 py-4"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + index * 0.05 }}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-500/20 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  {feature.label}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="w-full flex flex-col gap-3 mt-4"
          >
            <Button
              onClick={handleInstallClick}
              size="lg"
              className="w-full h-14 text-base font-semibold bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg gap-2"
            >
              <Download className="w-5 h-5" />
              INSTALL APP
            </Button>

            <button
              onClick={handleSkip}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors py-2"
            >
              Skip for now
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Instructions Sheet */}
      <PWAInstallSheet 
        open={showInstructions}
        onOpenChange={setShowInstructions}
        onComplete={handleComplete}
      />
    </div>
  );
};

export default PWAInstall;
