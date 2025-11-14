import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import homeAnimation from '@/assets/lottie/home-icon.json';
import scriptsAnimation from '@/assets/lottie/scripts-icon.json';
import bonusAnimation from '@/assets/lottie/bonus-gift.json';
import videosAnimation from '@/assets/lottie/videos-icon.json';
import profileAnimation from '@/assets/lottie/profile-icon.json';

export function SideNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { animation: homeAnimation, label: 'Home', path: '/', gradient: 'from-purple-500 to-blue-500' },
    { animation: scriptsAnimation, label: 'Scripts', path: '/scripts', gradient: 'from-green-500 to-emerald-600' },
    { animation: bonusAnimation, label: 'Bonus', path: '/bonuses', gradient: 'from-amber-500 to-red-500' },
    { animation: videosAnimation, label: 'Videos', path: '/videos', gradient: 'from-red-500 to-pink-500' },
    { animation: profileAnimation, label: 'Profile', path: '/profile', gradient: 'from-orange-500 to-amber-500' },
  ];

  return (
    <div className="hidden md:flex fixed left-0 top-0 bottom-0 z-40 w-20 lg:w-24 flex-col items-center py-8 bg-background/95 backdrop-blur-xl border-r border-border shadow-lg">
      {/* Logo/Brand */}
      <div className="mb-8 text-3xl lg:text-4xl">
        🧠
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 flex flex-col items-center gap-2 w-full px-2">
        {navItems.map(({ animation, label, path, gradient }) => {
          const isActive = location.pathname === path;

          return (
            <motion.button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                "relative flex flex-col items-center justify-center gap-2 w-full py-4 rounded-2xl transition-all duration-200",
                isActive
                  ? "bg-primary/10"
                  : "hover:bg-muted"
              )}
              aria-label={label}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.15 }}
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  className={cn(
                    "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 rounded-r-full bg-gradient-to-b",
                    gradient
                  )}
                  layoutId="activeIndicator"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}

              {/* Lottie Icon */}
              <motion.div
                className="relative z-10 w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center"
                animate={{
                  scale: isActive ? 1.1 : 1,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Lottie
                  animationData={animation}
                  loop={true}
                  autoplay={true}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  className={cn(
                    "transition-all duration-200",
                    isActive ? "opacity-100" : "opacity-50"
                  )}
                />

                {/* Glow effect for active icon */}
                {isActive && (
                  <motion.div
                    className={cn("absolute inset-0 blur-xl opacity-30 bg-gradient-to-r -z-10", gradient)}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1.3, opacity: 0.3 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.div>

              {/* Label - hidden on smaller tablets, shown on large screens */}
              <span
                className={cn(
                  "text-[10px] lg:text-[11px] font-semibold tracking-tight transition-all duration-200 hidden lg:block",
                  isActive
                    ? cn("bg-gradient-to-r bg-clip-text text-transparent", gradient)
                    : "text-muted-foreground"
                )}
              >
                {label}
              </span>
            </motion.button>
          );
        })}
      </nav>

      {/* Bottom decoration */}
      <div className="mt-auto pt-4 border-t border-border w-full px-4">
        <div className="text-center text-xs text-muted-foreground">
          NEP
        </div>
      </div>
    </div>
  );
}
