import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Lottie from 'lottie-react';
import homeAnimation from '@/assets/lottie/home-icon.json';
import scriptsAnimation from '@/assets/lottie/scripts-icon.json';
import bonusAnimation from '@/assets/lottie/bonus-gift.json';
import videosAnimation from '@/assets/lottie/videos-icon.json';
import profileAnimation from '@/assets/lottie/profile-icon.json';

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [ripples, setRipples] = useState<{ [key: string]: { x: number; y: number; id: number } | null }>({});

  const navItems = [
    { animation: homeAnimation, label: 'Home', path: '/', gradient: 'from-purple-500 to-blue-500' },
    { animation: scriptsAnimation, label: 'Scripts', path: '/scripts', gradient: 'from-green-500 to-emerald-600' },
    { animation: bonusAnimation, label: 'Bonus', path: '/bonuses', gradient: 'from-amber-500 to-red-500' },
    { animation: videosAnimation, label: 'Videos', path: '/videos', gradient: 'from-red-500 to-pink-500' },
    { animation: profileAnimation, label: 'Profile', path: '/profile', gradient: 'from-orange-500 to-amber-500' },
  ];

  // Vibração háptica (se disponível)
  const triggerHaptic = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  // Handle touch/click com ripple effect
  const handleRipple = (e: React.MouseEvent | React.TouchEvent, path: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    let x: number, y: number;

    if ('touches' in e) {
      // Touch event
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      // Mouse event
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    setRipples(prev => ({
      ...prev,
      [path]: { x, y, id: Date.now() }
    }));

    triggerHaptic();

    // Limpar ripple após animação
    setTimeout(() => {
      setRipples(prev => ({
        ...prev,
        [path]: null
      }));
    }, 600);
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden transition-all px-3"
      style={{
        paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)',
      }}
    >
      {/* Telegram-style floating nav */}
      <div className="relative bg-background backdrop-blur-2xl rounded-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.24)] border border-border overflow-hidden">
        {/* Solid background for better contrast */}
        <div className="absolute inset-0 bg-background/98 pointer-events-none" />
        
        <div className="relative flex items-center justify-around h-[68px] px-2">
          {navItems.map(({ animation, label, path, gradient }) => {
            const isActive = location.pathname === path;
            const ripple = ripples[path];

            return (
              <motion.button
                key={path}
                onMouseDown={(e) => handleRipple(e, path)}
                onTouchStart={(e) => handleRipple(e, path)}
                onClick={() => navigate(path)}
                className="relative flex flex-col items-center justify-center gap-1.5 min-w-[64px] py-2 rounded-2xl touch-manipulation"
                aria-label={label}
                whileTap={{ scale: 0.92 }}
                transition={{ duration: 0.1, ease: "easeInOut" }}
              >
                {/* Ripple effect */}
                {ripple && (
                  <motion.div
                    key={ripple.id}
                    className={cn(
                      "absolute rounded-full pointer-events-none bg-gradient-to-r opacity-20",
                      gradient
                    )}
                    style={{
                      left: ripple.x,
                      top: ripple.y,
                      transform: 'translate(-50%, -50%)',
                    }}
                    initial={{ width: 0, height: 0, opacity: 0.5 }}
                    animate={{ width: 100, height: 100, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                )}


                {/* Lottie Icon */}
                <motion.div
                  className="relative z-10 w-7 h-7 flex items-center justify-center"
                  animate={{
                    scale: isActive ? 1.15 : 1,
                    y: isActive ? -2 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Lottie
                    animationData={animation}
                    loop={true}
                    autoplay={true}
                    style={{
                      width: 28,
                      height: 28,
                    }}
                    className={cn(
                      "transition-all duration-200",
                      isActive ? "opacity-100" : "opacity-40"
                    )}
                  />

                  {/* Glow effect for active icon */}
                  {isActive && (
                    <motion.div
                      className={cn("absolute inset-0 -inset-1 blur-lg opacity-40 bg-gradient-to-r -z-10", gradient)}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1.2, opacity: 0.4 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.div>

                {/* Label */}
                <span
                  className={cn(
                    "relative z-10 text-[11px] font-semibold tracking-tight transition-all duration-200",
                    isActive
                      ? cn("bg-gradient-to-r bg-clip-text text-transparent", gradient)
                      : "text-foreground opacity-70"
                  )}
                >
                  {label}
                </span>

                {/* Active indicator dot */}
                {isActive && (
                  <motion.div
                    className="absolute top-2 left-1/2 -translate-x-1/2"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className={cn("w-1 h-1 rounded-full bg-gradient-to-r", gradient)} />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
