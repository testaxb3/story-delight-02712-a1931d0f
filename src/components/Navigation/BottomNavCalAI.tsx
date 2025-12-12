import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
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
  { icon: 'listen', label: 'Listen', path: '/listen' },
  { icon: 'bonuses', label: 'Bonuses', path: '/bonuses' },
  { icon: 'profile', label: 'Profile', path: '/profile' },
];

function NavButton({ icon, label, path, lottieData, index }: {
  icon: string;
  label: string;
  path: string;
  lottieData: any;
  index: number;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { triggerHaptic } = useHaptic();
  const isActive = location.pathname === path ||
    (path !== '/' && location.pathname.startsWith(path));
  const animationData = lottieData[icon];

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onClick={(e) => {
        e.stopPropagation();
        triggerHaptic('medium');
        navigate(path);
      }}
      className={cn(
        "relative flex flex-col items-center justify-center transition-all w-16 py-1.5 cursor-pointer touch-manipulation rounded-2xl",
        isActive ? "" : "hover:bg-[#F5F0ED]"
      )}
      aria-label={label}
    >
      {/* Active background with gradient */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            layoutId="activeTab"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="absolute inset-0 bg-gradient-to-br from-[#FF6631]/15 to-[#FFA300]/10 rounded-2xl"
          />
        )}
      </AnimatePresence>

      {/* Glow effect when active */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-br from-[#FF6631]/20 to-[#FFA300]/20 rounded-2xl blur-md -z-10"
        />
      )}

      {/* Icon container with scale animation */}
      <motion.div
        animate={{
          scale: isActive ? 1.1 : 1,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className="relative z-10"
      >
        {animationData ? (
          <div className={cn(
            "transition-all duration-300",
            isActive && "drop-shadow-[0_0_8px_rgba(255,102,49,0.5)]"
          )}>
            <Lottie
              animationData={animationData}
              loop={isActive}
              autoplay={true}
              style={{
                width: '26px',
                height: '26px',
                pointerEvents: 'none',
                filter: isActive ? 'none' : 'grayscale(30%) opacity(0.7)'
              }}
            />
          </div>
        ) : (
          <div className="w-6 h-6 bg-[#F0E6DF] rounded animate-pulse" />
        )}
      </motion.div>

      {/* Label */}
      <motion.span
        animate={{
          color: isActive ? '#FF6631' : '#8D8D8D',
          fontWeight: isActive ? 600 : 500
        }}
        className="text-[10px] mt-1 transition-colors relative z-10"
      >
        {label}
      </motion.span>

      {/* Active indicator dot */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#FF6631] to-[#FFA300] shadow-sm"
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export function BottomNavCalAI() {
  const [lottieData, setLottieData] = useState<Record<string, any>>({});
  const [isLoaded, setIsLoaded] = useState(false);

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
      setIsLoaded(true);
    };

    loadLotties();
  }, []);

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed left-4 right-4 z-[100] md:hidden pointer-events-auto"
      style={{ bottom: `calc(env(safe-area-inset-bottom, 0px) + 0.5rem)` }}
    >
      {/* Main container with premium styling */}
      <div className="relative">
        {/* Glow effect behind nav */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FF6631]/10 via-transparent to-[#FFA300]/10 rounded-full blur-xl" />

        {/* Nav bar */}
        <div className="relative bg-white/95 backdrop-blur-xl rounded-full px-3 py-2 shadow-2xl shadow-black/10 border border-[#F0E6DF]">
          {/* Top accent line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-0.5 rounded-full bg-gradient-to-r from-[#FF6631] to-[#FFA300] opacity-50" />

          <div className="flex justify-between items-center gap-1">
            {NAV_ITEMS.map((item, index) => (
              <NavButton
                key={item.path}
                icon={item.icon}
                label={item.label}
                path={item.path}
                lottieData={lottieData}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
