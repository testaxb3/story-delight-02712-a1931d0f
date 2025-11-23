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

export function SideNav() {
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
    <div className="hidden md:flex fixed left-0 top-0 bottom-0 z-40 w-20 lg:w-24 flex-col items-center py-8 bg-background border-r border-border">
      {/* Logo */}
      <div className="mb-8 text-2xl font-bold text-foreground">
        NEP
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 flex flex-col items-center gap-2 w-full px-2">
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
                "relative flex flex-col items-center justify-center gap-2 w-full py-4 rounded-2xl transition-all duration-200",
                isActive
                  ? "bg-muted"
                  : "hover:bg-muted/50"
              )}
              aria-label={label}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-foreground" />
              )}

              {/* Lottie Icon */}
              <div className={cn(
                "w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center transition-transform",
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
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-muted rounded animate-pulse" />
                )}
              </div>

              {/* Label */}
              <span className={cn(
                "text-[10px] lg:text-[11px] font-medium tracking-tight transition-all duration-200 hidden lg:block",
                isActive
                  ? "text-foreground font-semibold"
                  : "text-muted-foreground"
              )}>
                {label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Bottom decoration */}
      <div className="mt-auto pt-4 border-t border-border w-full">
        <div className="text-center text-xs text-muted-foreground">
          v1.0
        </div>
      </div>
    </div>
  );
}
