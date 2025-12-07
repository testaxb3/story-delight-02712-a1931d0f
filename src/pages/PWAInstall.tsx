import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Zap, Bell, Smartphone, Download } from 'lucide-react';
import { isIOSDevice } from '@/utils/platform';
import { trackEvent } from '@/lib/analytics';
import { useEffect, Component, ReactNode } from 'react';
import { OptimizedYouTubePlayer } from '@/components/VideoPlayer/OptimizedYouTubePlayer';
import { usePWAInstall } from '@/hooks/usePWAInstall';

// Error Boundary for YouTube Player
class YouTubeErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[PWAInstall] YouTube player error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Video unavailable</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const PWAInstall = () => {
  const navigate = useNavigate();
  const isIOS = isIOSDevice();
  const { isInstallable, isInstalled, promptInstall } = usePWAInstall();

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

  const handleNativeInstall = async () => {
    trackEvent('pwa_install_clicked_native');
    const success = await promptInstall();
    if (success) {
      trackEvent('pwa_install_native_accepted');
      navigate('/pwa-check');
    } else {
      trackEvent('pwa_install_native_dismissed');
    }
  };

  const handleInstalled = () => {
    trackEvent('pwa_install_clicked_installed');
    navigate('/pwa-check');
  };

  const handleSkip = () => {
    trackEvent('pwa_install_clicked_skip');
    localStorage.setItem('pwa_flow_completed', 'true');
    localStorage.setItem('pwa_install_skipped', Date.now().toString());
    navigate('/theme-selection');
  };

  // Show native install for Android/Chrome when available
  const showNativeInstall = isInstallable && !isIOS;

  return (
    <div 
      className="min-h-screen bg-white dark:bg-black flex flex-col"
      style={{ 
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}
    >
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm flex flex-col gap-4"
        >
          {/* Compact Header */}
          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Install the App
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {showNativeInstall 
                ? 'One tap to add to your home screen'
                : 'Watch the quick tutorial below'
              }
            </p>
          </div>

          {/* Native Install Button for Android/Chrome */}
          {showNativeInstall && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Button
                onClick={handleNativeInstall}
                size="lg"
                className="w-full h-14 text-base font-semibold bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg gap-2"
              >
                <Download className="w-5 h-5" />
                Install App
              </Button>
            </motion.div>
          )}

          {/* Video Tutorial (iOS or fallback) */}
          {(!showNativeInstall || isIOS) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              className="relative h-44 rounded-xl overflow-hidden bg-black border border-gray-200 dark:border-gray-700 shadow-sm"
            >
              <YouTubeErrorBoundary>
                <OptimizedYouTubePlayer
                  videoUrl={`https://www.youtube.com/watch?v=${isIOS ? 'dMEYRym6CGI' : 'Aibj__ZtzSE'}`}
                  videoId={`pwa-install-${isIOS ? 'ios' : 'android'}`}
                />
              </YouTubeErrorBoundary>
            </motion.div>
          )}

          {/* 3 Inline Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="flex justify-center gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="flex flex-col items-center gap-1.5"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-500/20 flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  {feature.label}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col gap-2 mt-2"
          >
            {/* Show "I've Installed It" only for iOS or when native not available */}
            {(!showNativeInstall) && (
              <Button
                onClick={handleInstalled}
                size="lg"
                className="w-full h-12 text-base font-semibold bg-emerald-500 hover:bg-emerald-600 text-white shadow-md"
              >
                I've Installed It ✓
              </Button>
            )}

            <button
              onClick={handleSkip}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors py-2"
            >
              Skip for now
            </button>
          </motion.div>

          {/* Platform indicator */}
          <p className="text-center text-xs text-gray-400 dark:text-gray-500">
            {isIOS ? 'iOS' : 'Android'} {showNativeInstall ? '• Native install available' : 'instructions'}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PWAInstall;
