import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useHaptic } from '@/hooks/useHaptic';
import { useMemo } from 'react';
import {
  Home,
  BookOpen,
  Headphones,
  Gift,
  User,
  Sparkles
} from 'lucide-react';

interface NavItem {
  icon: typeof Home;
  label: string;
  path: string;
  gradient: string;
  glowColor: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    icon: Home,
    label: 'Home',
    path: '/',
    gradient: 'from-orange-500 to-amber-400',
    glowColor: 'rgba(251, 146, 60, 0.5)'
  },
  {
    icon: BookOpen,
    label: 'Scripts',
    path: '/scripts',
    gradient: 'from-violet-500 to-purple-400',
    glowColor: 'rgba(139, 92, 246, 0.5)'
  },
  {
    icon: Headphones,
    label: 'Listen',
    path: '/listen',
    gradient: 'from-cyan-500 to-teal-400',
    glowColor: 'rgba(34, 211, 238, 0.5)'
  },
  {
    icon: Gift,
    label: 'Bonuses',
    path: '/bonuses',
    gradient: 'from-pink-500 to-rose-400',
    glowColor: 'rgba(236, 72, 153, 0.5)'
  },
  {
    icon: User,
    label: 'Profile',
    path: '/profile',
    gradient: 'from-emerald-500 to-green-400',
    glowColor: 'rgba(16, 185, 129, 0.5)'
  },
];

function NavButton({ item, isActive, index }: {
  item: NavItem;
  isActive: boolean;
  index: number;
}) {
  const navigate = useNavigate();
  const { triggerHaptic } = useHaptic();
  const Icon = item.icon;

  return (
    <motion.button
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 + 0.15, duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      onClick={() => {
        triggerHaptic('medium');
        navigate(item.path);
      }}
      className={cn(
        "relative flex flex-col items-center justify-center flex-1 py-2.5 min-w-0",
        "transition-all duration-300 ease-out rounded-2xl",
        "touch-manipulation select-none active:scale-95"
      )}
      aria-label={item.label}
      aria-current={isActive ? 'page' : undefined}
    >
      {/* Active pill background with gradient */}
      <AnimatePresence mode="wait">
        {isActive && (
          <motion.div
            layoutId="activeNavPill"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className={cn(
              "absolute inset-1 rounded-2xl",
              `bg-gradient-to-br ${item.gradient}`
            )}
            style={{
              boxShadow: `0 6px 20px -4px ${item.glowColor}, 0 3px 10px -3px ${item.glowColor}`
            }}
          />
        )}
      </AnimatePresence>

      {/* Icon container */}
      <motion.div
        animate={{
          scale: isActive ? 1.12 : 1,
          y: isActive ? -1 : 0,
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 22 }}
        className="relative z-10"
      >
        <Icon
          className={cn(
            "w-5 h-5 transition-all duration-250",
            isActive
              ? "text-white"
              : "text-gray-400 dark:text-gray-500"
          )}
          strokeWidth={isActive ? 2.5 : 1.8}
        />
      </motion.div>

      {/* Label */}
      <motion.span
        animate={{
          y: isActive ? 0 : 1,
        }}
        transition={{ duration: 0.2 }}
        className={cn(
          "text-[10px] mt-1.5 relative z-10 transition-all duration-250 font-semibold",
          isActive ? "text-white" : "text-gray-400 dark:text-gray-500"
        )}
      >
        {item.label}
      </motion.span>

      {/* Mini sparkle for active */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0, rotate: -20 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0, rotate: 20 }}
            transition={{ delay: 0.1, duration: 0.25, ease: 'backOut' }}
            className="absolute -top-0.5 -right-0.5 z-20"
          >
            <Sparkles className="w-2.5 h-2.5 text-white/70" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export function BottomNavExpandable() {
  const location = useLocation();

  const activeIndex = useMemo(() => {
    if (location.pathname === '/') return 0;
    const idx = NAV_ITEMS.findIndex(item =>
      item.path !== '/' && location.pathname.startsWith(item.path)
    );
    return idx >= 0 ? idx : null;
  }, [location.pathname]);

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, type: 'spring', stiffness: 280, damping: 26 }}
      className="fixed left-3 right-3 z-[100] pointer-events-auto md:hidden"
      style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 6px)' }}
    >
      {/* Frosted glass container */}
      <div className="relative">
        {/* Ambient glow */}
        <div
          className="absolute inset-0 rounded-[26px] blur-2xl opacity-40"
          style={{
            background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.2) 0%, rgba(139, 92, 246, 0.15) 33%, rgba(236, 72, 153, 0.2) 66%, rgba(16, 185, 129, 0.15) 100%)'
          }}
        />

        {/* Main nav container */}
        <div className="relative bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl rounded-[26px] border border-gray-100 dark:border-gray-800 shadow-[0_4px_24px_rgba(0,0,0,0.08)] overflow-hidden">
          {/* Top shimmer accent */}
          <div className="absolute top-0 inset-x-6 h-[1px] bg-gradient-to-r from-transparent via-gray-200/60 dark:via-gray-700/60 to-transparent" />

          {/* Nav items */}
          <div className="flex items-center px-1.5 py-1">
            {NAV_ITEMS.map((item, index) => (
              <NavButton
                key={item.path}
                item={item}
                isActive={activeIndex === index}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
