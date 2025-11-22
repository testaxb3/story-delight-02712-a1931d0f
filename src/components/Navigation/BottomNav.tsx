import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Lottie from 'lottie-react';
import { useEffect, useRef, useState } from 'react';

interface NavItem {
  icon: string;
  label: string;
  path: string;
}

const NAV_ITEMS: NavItem[] = [
  { icon: 'home', label: 'Home', path: '/' },
  { icon: 'scripts', label: 'Scripts', path: '/scripts' },
  { icon: 'videos', label: 'Videos', path: '/videos' },
  { icon: 'bonuses', label: 'Bonuses', path: '/bonuses' },
  { icon: 'profile', label: 'Profile', path: '/profile' },
];

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [lottieData, setLottieData] = useState<Record<string, any>>({});

  useEffect(() => {
    const loadLotties = async () => {
      try {
        const loaded: Record<string, any> = {};
        await Promise.all(
          NAV_ITEMS.map(async (item) => {
            const response = await fetch(`/lotties/${item.icon}-icon.json`);
            loaded[item.icon] = await response.json();
          })
        );
        setLottieData(loaded);
      } catch (error) {
        console.error('Error loading Lottie animations:', error);
      }
    };
    
    loadLotties();
  }, []);

  return (
    <nav 
      className="fixed bottom-0 inset-x-0 bg-background border-t border-border z-50 md:hidden safe-area-pb"
    >
      <div className="flex justify-around items-center h-16 px-2">
        {NAV_ITEMS.map(({ icon, label, path }) => {
          const isActive = location.pathname === path;
          const lottieRef = useRef<any>(null);
          const animationData = lottieData[icon];

          // Play animation when becoming active
          useEffect(() => {
            if (isActive && lottieRef.current && animationData) {
              lottieRef.current.goToAndPlay(0);
            }
          }, [isActive, animationData]);

          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 min-w-[56px] py-2 transition-all touch-manipulation",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}
              aria-label={label}
            >
              <div className={cn(
                "w-7 h-7 transition-transform flex items-center justify-center",
                isActive && "scale-110"
              )}>
                {animationData ? (
                  <Lottie
                    lottieRef={lottieRef}
                    animationData={animationData}
                    loop={false}
                    autoplay={false}
                    style={{ width: '100%', height: '100%' }}
                  />
                ) : (
                  <div className="w-7 h-7 bg-muted rounded animate-pulse" />
                )}
              </div>
              <span className={cn(
                "text-[10px] font-medium leading-none",
                isActive && "font-semibold"
              )}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
