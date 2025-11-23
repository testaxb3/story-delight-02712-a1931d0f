import { useState, useEffect } from 'react';
import { isStandaloneMode } from '@/utils/platform';

/**
 * Hook to detect PWA installation status in real-time
 * Polls every 2 seconds to detect when user installs the app
 */
export function usePWAInstallation() {
  const [isInstalled, setIsInstalled] = useState(isStandaloneMode());
  const [justInstalled, setJustInstalled] = useState(false);

  useEffect(() => {
    // Polling to detect installation in real-time
    const checkInterval = setInterval(() => {
      const nowInstalled = isStandaloneMode();
      if (nowInstalled && !isInstalled) {
        setJustInstalled(true);
        setIsInstalled(true);
        localStorage.setItem('pwa_install_timestamp', Date.now().toString());
        console.log('✅ PWA installation detected!');
      }
    }, 2000);

    return () => clearInterval(checkInterval);
  }, [isInstalled]);

  return { isInstalled, justInstalled };
}
