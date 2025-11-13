import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { OptimizedYouTubePlayer } from '@/components/VideoPlayer/OptimizedYouTubePlayer';
import { Smartphone, ArrowRight, X } from 'lucide-react';

export default function PWAOnboarding() {
  const navigate = useNavigate();
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

  const handleContinue = () => {
    // Mark onboarding as completed
    localStorage.setItem('pwa_onboarding_completed', 'true');
    navigate('/', { replace: true });
  };

  const handleSkip = () => {
    localStorage.setItem('pwa_onboarding_completed', 'true');
    navigate('/', { replace: true });
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

  // If desktop, skip onboarding
  if (deviceType === 'desktop') {
    handleContinue();
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-primary flex flex-col items-center justify-center p-4 relative">
      {/* Skip button */}
      <button
        onClick={handleSkip}
        className="absolute top-6 right-6 p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors z-50"
        aria-label="Skip tutorial"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm mb-2">
            <Smartphone className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">
            Install NEP System
          </h1>
          <p className="text-white/80 text-lg">
            Get the app experience on your {deviceType === 'ios' ? 'iPhone' : 'Android'}
          </p>
        </div>

        {/* Video Container */}
        <div className="bg-white/95 backdrop-blur-glass rounded-2xl p-4 shadow-2xl border border-white/20">
          <div className="rounded-xl overflow-hidden">
            <OptimizedYouTubePlayer
              videoUrl={currentVideo.url}
              videoId={currentVideo.id}
              showFullscreenHint={false}
            />
          </div>

          {/* Instructions */}
          <div className="mt-4 space-y-2">
            <h3 className="font-semibold text-gray-900">Quick Steps:</h3>
            {deviceType === 'ios' ? (
              <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                <li>Tap the <strong>Share</strong> button (square with arrow)</li>
                <li>Scroll and tap <strong>"Add to Home Screen"</strong></li>
                <li>Tap <strong>"Add"</strong> in the top right</li>
              </ol>
            ) : (
              <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                <li>Tap the <strong>menu</strong> (three dots)</li>
                <li>Tap <strong>"Add to Home screen"</strong> or <strong>"Install app"</strong></li>
                <li>Tap <strong>"Add"</strong> or <strong>"Install"</strong></li>
              </ol>
            )}
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 space-y-2">
          <h3 className="font-semibold text-white text-sm">Why install?</h3>
          <ul className="text-sm text-white/90 space-y-1.5">
            <li className="flex items-start gap-2">
              <span className="text-success mt-0.5">✓</span>
              <span>Instant access from your home screen</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-0.5">✓</span>
              <span>Works offline with saved content</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-0.5">✓</span>
              <span>Faster loading and smoother experience</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-0.5">✓</span>
              <span>Get push notifications for updates</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleContinue}
            className="w-full h-12 text-base font-semibold"
            size="lg"
          >
            <span className="flex items-center gap-2">
              Continue to App
              <ArrowRight className="w-5 h-5" />
            </span>
          </Button>

          <button
            onClick={handleSkip}
            className="w-full text-white/80 hover:text-white text-sm font-medium transition-colors"
          >
            I'll install it later
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-white/60 text-xs">
          You can always install the app later from your browser menu
        </p>
      </div>
    </div>
  );
}
