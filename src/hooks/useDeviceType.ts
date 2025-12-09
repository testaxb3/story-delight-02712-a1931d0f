import { useState, useEffect } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

const BREAKPOINTS = {
  mobile: 640,   // < 640px
  tablet: 1024,  // 640px - 1023px
  // desktop: >= 1024px
};

function getDeviceType(width: number): DeviceType {
  if (width < BREAKPOINTS.mobile) return 'mobile';
  if (width < BREAKPOINTS.tablet) return 'tablet';
  return 'desktop';
}

export function useDeviceType(): DeviceType {
  const [deviceType, setDeviceType] = useState<DeviceType>(() => {
    if (typeof window === 'undefined') return 'mobile';
    return getDeviceType(window.innerWidth);
  });

  useEffect(() => {
    const handleResize = () => {
      setDeviceType(getDeviceType(window.innerWidth));
    };

    // Listen for resize events
    window.addEventListener('resize', handleResize);
    
    // Initial check
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return deviceType;
}

// Utility hooks for common checks
export function useIsMobileOrTablet(): boolean {
  const deviceType = useDeviceType();
  return deviceType === 'mobile' || deviceType === 'tablet';
}

export function useIsDesktop(): boolean {
  const deviceType = useDeviceType();
  return deviceType === 'desktop';
}
