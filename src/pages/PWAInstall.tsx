import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Bell, Download, Zap, Lock, WifiOff, Rocket } from 'lucide-react';
import { isIOSDevice } from '@/utils/platform';
import { trackEvent } from '@/lib/analytics';
import { useEffect, useState, Component, ReactNode } from 'react';
import { OptimizedYouTubePlayer } from '@/components/VideoPlayer/OptimizedYouTubePlayer';

// ✅ Local Error Boundary for YouTube Player
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
        <div className="w-full h-full flex items-center justify-center bg-muted/50 rounded-xl">
          <p className="text-muted-foreground text-sm">Video unavailable</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const PWAInstall = () => {
  const navigate = useNavigate();
  const isIOS = isIOSDevice();
  const [trackingError, setTrackingError] = useState(false);

  useEffect(() => {
    // ✅ FIX: Wrap analytics in try-catch to prevent crashes
    try {
      trackEvent('pwa_install_page_viewed');
    } catch (err) {
      console.error('[PWAInstall] Analytics tracking failed:', err);
      setTrackingError(true);
    }
  }, []);

  const features = [
    {
      icon: Zap,
      title: 'Instant Access',
      description: 'Launch from your home screen like a native app'
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description: 'Get real-time updates on new scripts and insights'
    },
    {
      icon: WifiOff,
      title: 'Offline Mode',
      description: 'Access all your content without internet connection'
    },
    {
      icon: Rocket,
      title: 'Blazing Fast',
      description: '3x faster loading with advanced caching'
    },
    {
      icon: Download,
      title: 'Exclusive Features',
      description: 'App-only tools for deeper insights'
    },
    {
      icon: Lock,
      title: 'Enhanced Privacy',
      description: 'Your data stays secure on your device'
    }
  ];

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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-start md:justify-center px-4 md:px-6 pt-6 md:pt-8 pb-8 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl space-y-4 md:space-y-6"
        >
          {/* Header */}
          <div className="text-center space-y-2 md:space-y-4">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground font-relative leading-tight px-2 pt-2">
              One More Thing Before We Begin...
            </h1>

            <p className="text-base md:text-lg lg:text-xl text-foreground/70 px-2">
              Install <span className="font-semibold text-foreground">Nep System</span> to unlock the complete premium experience
            </p>
          </div>

        {/* Video Tutorial - Wrapped in Error Boundary */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative aspect-video rounded-xl md:rounded-2xl overflow-hidden shadow-lg md:shadow-xl bg-black border border-border/50"
        >
          <YouTubeErrorBoundary>
            <OptimizedYouTubePlayer
              videoUrl={`https://www.youtube.com/watch?v=${isIOS ? 'dMEYRym6CGI' : 'Aibj__ZtzSE'}`}
              videoId={`pwa-install-${isIOS ? 'ios' : 'android'}`}
            />
          </YouTubeErrorBoundary>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.05 }}
              className="flex items-start gap-2.5 md:gap-3 p-3 md:p-4 rounded-lg md:rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/15 flex items-center justify-center">
                <feature.icon className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground mb-0.5 text-xs md:text-sm">
                  {feature.title}
                </h3>
                <p className="text-[11px] md:text-xs text-foreground/60 leading-snug md:leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Instruction text */}
        <p className="text-center text-sm md:text-base text-foreground/70 font-medium px-4">
          Watch the video above, then tap the button below when done
        </p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col gap-2 md:gap-3 pt-1 md:pt-2"
        >
          <Button
            onClick={handleInstalled}
            size="lg"
            className="w-full text-sm md:text-base lg:text-lg h-11 md:h-12 lg:h-14 font-semibold shadow-md hover:shadow-lg transition-all bg-primary text-primary-foreground"
          >
            I've Installed It ✓
          </Button>

          <Button
            onClick={handleSkip}
            variant="outline"
            size="lg"
            className="w-full text-sm md:text-base lg:text-lg h-11 md:h-12 lg:h-14 text-foreground/80 border-border hover:bg-muted"
          >
            Skip for Now
          </Button>
        </motion.div>

        {/* Platform indicator */}
        <p className="text-center text-xs md:text-sm text-foreground/50 font-medium pb-2">
          {isIOS ? '📱 iOS' : '🤖 Android'} instructions shown above
        </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PWAInstall;
