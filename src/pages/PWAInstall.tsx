import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Smartphone, Bell, Download, Zap, Lock, WifiOff } from 'lucide-react';
import { isIOSDevice } from '@/utils/platform';
import { trackEvent } from '@/lib/analytics';
import { useEffect } from 'react';

const PWAInstall = () => {
  const navigate = useNavigate();
  const isIOS = isIOSDevice();

  useEffect(() => {
    trackEvent('pwa_install_page_viewed');
  }, []);

  const features = [
    {
      icon: Smartphone,
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
      icon: Zap,
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

  const handleShowHow = () => {
    trackEvent('pwa_install_clicked_show_how');
    navigate('/pwa-check');
  };

  const handleLater = () => {
    trackEvent('pwa_install_clicked_later');
    navigate('/pwa-check');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl space-y-8"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4"
          >
            <Smartphone className="w-10 h-10 text-primary" />
          </motion.div>
          
          <h1 className="text-4xl font-bold text-foreground">
            One More Thing Before We Begin...
          </h1>
          
          <p className="text-xl text-muted-foreground">
            Install NEP System to unlock the complete premium experience
          </p>
        </div>

        {/* Video Tutorial */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative aspect-video rounded-xl overflow-hidden shadow-2xl bg-black"
        >
          <iframe
            src={`https://www.youtube.com/embed/${isIOS ? 'dMEYRym6CGI' : 'Aibj__ZtzSE'}?modestbranding=1&rel=0`}
            title="PWA Installation Tutorial"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col gap-3"
        >
          <Button
            onClick={handleShowHow}
            size="lg"
            className="w-full text-lg h-14"
          >
            Show Me How to Install →
          </Button>
          
          <Button
            onClick={handleLater}
            variant="ghost"
            size="lg"
            className="w-full text-lg h-14"
          >
            I'll Install It Later
          </Button>
        </motion.div>

        {/* Platform indicator */}
        <p className="text-center text-sm text-muted-foreground">
          {isIOS ? '📱 iOS' : '🤖 Android'} installation instructions shown above
        </p>
      </motion.div>
    </div>
  );
};

export default PWAInstall;
