import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Lottie from 'lottie-react';
import { useEffect, useState } from 'react';
import { useHaptic } from '@/hooks/useHaptic';

interface NavItem {
  icon: string;
  label: string;
  path: string;
}

const NAV_ITEMS: NavItem[] = [
  { icon: 'home', label: 'Home', path: '/' },
  { icon: 'scripts', label: 'Scripts', path: '/scripts' },
  { icon: 'bonuses', label: 'Bonuses', path: '/bonuses' },
  { icon: 'profile', label: 'Profile', path: '/profile' },
];

function NavButton({ icon, label, path, lottieData }: {
  icon: string;
  label: string;
  path: string;
  lottieData: any;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { triggerHaptic } = useHaptic();
  const isActive = location.pathname === path;
  const animationData = lottieData[icon];

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        triggerHaptic('medium');
        navigate(path);
      }}
      className={cn(
        "flex flex-col items-center justify-center transition-all w-16 py-1 relative z-10 cursor-pointer touch-manipulation rounded-2xl",
        isActive ? "bg-primary/10" : "hover:bg-muted/50"
      )}
      aria-label={label}
    >
      {animationData ? (
        <Lottie
          animationData={animationData}
          loop={isActive}
          autoplay={true}
          style={{ width: '24px', height: '24px', pointerEvents: 'none' }}
        />
      ) : (
        <div className="w-6 h-6 bg-muted rounded animate-pulse" />
      )}
      <span className={cn(
        "text-[10px] font-medium mt-0.5 transition-colors",
        isActive ? "text-foreground" : "text-muted-foreground"
      )}>
        {label}
      </span>
    </button>
  );
}

export function BottomNavCalAI() {
  const [lottieData, setLottieData] = useState<Record<string, any>>({});

  useEffect(() => {
    const loadLotties = async () => {
      const loaded: Record<string, any> = {};
      
      await Promise.all(
        NAV_ITEMS.map(async (item) => {
          try {
            const response = await fetch(`/lotties/${item.icon}-icon.json`);
            if (response.ok) {
              loaded[item.icon] = await response.json();
            }
          } catch (error) {
            console.log(`Lottie not found for ${item.icon}, using fallback`);
          }
        })
      );
      
      setLottieData(loaded);
    };
    
    loadLotties();
  }, []);

  return (
    <nav 
      className="fixed left-6 right-6 z-[100] md:hidden pointer-events-auto"
      style={{ bottom: `calc(env(safe-area-inset-bottom, 0px) + 0.5rem)` }}
    >
      <div className="bg-card/80 backdrop-blur-xl rounded-full px-4 py-3 shadow-2xl border border-border">
        <div className="flex justify-between items-center gap-2">
          {NAV_ITEMS.map((item) => (
            <NavButton
              key={item.path}
              icon={item.icon}
              label={item.label}
              path={item.path}
              lottieData={lottieData}
            />
          ))}
        </div>
      </div>
    </nav>
  );
}
