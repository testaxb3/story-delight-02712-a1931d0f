import { useEffect } from 'react';

export function useDarkMode() {
  useEffect(() => {
    if (typeof document === 'undefined' || typeof window === 'undefined') {
      return;
    }

    const enforceLightTheme = () => {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    };

    const ensureLightPreference = () => {
      try {
        localStorage.setItem('theme', 'light');
      } catch (error) {
        console.warn('Unable to persist theme preference', error);
      }
    };

    enforceLightTheme();
    ensureLightPreference();

    const observer = new MutationObserver(() => {
      enforceLightTheme();
      ensureLightPreference();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme'],
    });

    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'theme' && event.newValue !== 'light') {
        ensureLightPreference();
        enforceLightTheme();
      }
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      observer.disconnect();
      window.removeEventListener('storage', handleStorage);
    };
  }, []);
}
