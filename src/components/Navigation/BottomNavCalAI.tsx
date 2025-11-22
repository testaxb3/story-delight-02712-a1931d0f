import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Lottie from 'lottie-react';
import { useEffect, useState } from 'react';

interface NavItem {
  icon: string;
  label: string;
  path: string;
}

const NAV_ITEMS: NavItem[] = [
  { icon: 'home', label: 'Home', path: '/' },
  { icon: 'scripts', label: 'Scripts', path: '/scripts' },
  { icon: 'bonuses', label: 'Bonuses', path: '/bonuses' },
  { icon: 'videos', label: 'Videos', path: '/videos' },
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
  const isActive = location.pathname === path;
  const animationData = lottieData[icon];

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        console.log('Navigating to:', path);
        navigate(path);
      }}
      className={cn(
        "flex items-center justify-center transition-all w-12 h-12 relative z-10 cursor-pointer touch-manipulation",
        isActive && "scale-110"
      )}
      aria-label={label}
    >
      {animationData ? (
        <Lottie
          animationData={animationData}
          loop={true}
          autoplay={true}
          style={{ width: '32px', height: '32px', pointerEvents: 'none' }}
        />
      ) : (
        <div className="w-8 h-8 bg-muted rounded animate-pulse" />
      )}
    </button>
  );
}

export function BottomNavCalAI() {
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
    <nav className="fixed bottom-6 left-6 right-6 z-[100] md:hidden pointer-events-auto">
      <div className="bg-card/80 backdrop-blur-xl rounded-full px-4 py-3 shadow-2xl border border-white/5">
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
