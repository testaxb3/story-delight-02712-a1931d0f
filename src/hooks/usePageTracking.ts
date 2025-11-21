import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageLoad } from '@/lib/analytics-advanced';

/**
 * Hook to automatically track page views and load times
 */
export const usePageTracking = (pageName?: string) => {
  const location = useLocation();
  
  useEffect(() => {
    const startTime = performance.now();
    const pageNameToTrack = pageName || location.pathname;
    
    // Track page load after a short delay to capture meaningful load time
    const timer = setTimeout(() => {
      const loadTime = performance.now() - startTime;
      trackPageLoad(pageNameToTrack, loadTime);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [location.pathname, pageName]);
};
