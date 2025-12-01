import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Bell, Download, Zap, Lock, WifiOff, Rocket } from 'lucide-react';
import { isIOSDevice } from '@/utils/platform';
import { trackEvent } from '@/lib/analytics';
import { useEffect } from 'react';
import { OptimizedYouTubePlayer } from '@/components/VideoPlayer/OptimizedYouTubePlayer';

const PWAInstall = () => {
  const navigate = useNavigate();
  const isIOS = isIOSDevice();

  useEffect(() => {
    trackEvent('pwa_install_page_viewed');
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
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/10 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-start md:justify-center px-4 md:px-6 pt-[calc(env(safe-area-inset-top)+1rem)] md:pt-[calc(env(safe-area-inset-top)+1.5rem)] pb-[calc(env(safe-area-inset-bottom)+1rem)] overflow-y-auto">
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

            <p className="text-base md:text-lg lg:text-xl text-muted-foreground px-2">
              Install <span className="font-semibold text-foreground">Nep System</span> to unlock the complete premium experience
            </p>
          </div>

        {/* Video Tutorial */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative aspect-video rounded-xl md:rounded-2xl overflow-hidden shadow-lg md:shadow-xl bg-black border border-border/50"
        >
          <OptimizedYouTubePlayer
            videoUrl={`https://www.youtube.com/watch?v=${isIOS ? 'dMEYRym6CGI' : 'Aibj__ZtzSE'}`}
            videoId={`pwa-install-${isIOS ? 'ios' : 'android'}`}
          />
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
              className="flex items-start gap-2.5 md:gap-3 p-3 md:p-4 rounded-lg md:rounded-xl bg-card/50 dark:bg-card border border-border/30 hover:border-border/60 transition-colors"
            >
              <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                <feature.icon className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground mb-0.5 text-xs md:text-sm">
                  {feature.title}
                </h3>
                <p className="text-[11px] md:text-xs text-muted-foreground leading-snug md:leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Instruction text */}
        <p className="text-center text-sm md:text-base text-muted-foreground px-4">
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
            className="w-full text-sm md:text-base lg:text-lg h-11 md:h-12 lg:h-14 font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            I've Installed It ✓
          </Button>

          <Button
            onClick={handleSkip}
            variant="ghost"
            size="lg"
            className="w-full text-sm md:text-base lg:text-lg h-11 md:h-12 lg:h-14 hover:bg-muted/50"
          >
            Skip for Now
          </Button>
        </motion.div>

        {/* Platform indicator */}
        <p className="text-center text-xs md:text-sm text-muted-foreground/70 pb-2">
          {isIOS ? '📱 iOS' : '🤖 Android'} instructions shown above
        </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PWAInstall;
