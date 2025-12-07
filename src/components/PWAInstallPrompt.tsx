import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface PWAInstallPromptProps {
  open: boolean;
  onOpenGuide: () => void;
  onClose: () => void;
}

export function PWAInstallPrompt({ open, onOpenGuide, onClose }: PWAInstallPromptProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (open) {
      if (import.meta.env.DEV) console.log('📲 PWA Install Prompt opened, sliding in...');
      // Slide in animation after a short delay
      setTimeout(() => setIsVisible(true), 100);
    } else {
      setIsVisible(false);
    }
  }, [open]);

  const handleMaybeLater = () => {
    if (import.meta.env.DEV) console.log('👋 User dismissed PWA prompt');
    localStorage.setItem('pwa_install_dismissed', 'true');
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleShowMeHow = () => {
    if (import.meta.env.DEV) console.log('📖 User wants to see PWA install guide');
    setIsVisible(false);
    setTimeout(() => {
      onClose();
      onOpenGuide();
    }, 300);
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleMaybeLater}
      />
      
      {/* Bottom Sheet */}
      <div 
        className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-t-3xl p-6 shadow-2xl relative">
          {/* Close button */}
          <button
            onClick={handleMaybeLater}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="max-w-md mx-auto">
            <div className="text-4xl mb-3 text-center">📱</div>
            <h2 className="text-2xl font-bold mb-2 text-center">One More Thing...</h2>
            <p className="text-white/90 mb-6 text-center text-base">
              Add NEP System to your home screen for instant access - just like a regular app!
            </p>
            
            <div className="flex flex-col gap-3">
              <Button 
                size="lg" 
                className="w-full bg-white text-purple-600 hover:bg-white/90 font-semibold"
                onClick={handleShowMeHow}
              >
                Show Me How →
              </Button>
              <button
                onClick={handleMaybeLater}
                className="text-white/80 hover:text-white text-sm font-medium transition-colors"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
