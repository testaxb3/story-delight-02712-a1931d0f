import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useHaptic } from '@/hooks/useHaptic';
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
  iconFilled?: typeof Home;
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
    glowColor: 'rgba(251, 146, 60, 0.4)'
  },
  {
    icon: BookOpen,
    label: 'Scripts',
    path: '/scripts',
    gradient: 'from-violet-500 to-purple-400',
    glowColor: 'rgba(139, 92, 246, 0.4)'
  },
  {
    icon: Headphones,
    label: 'Listen',
    path: '/listen',
    gradient: 'from-cyan-500 to-teal-400',
    glowColor: 'rgba(34, 211, 238, 0.4)'
  },
  {
    icon: Gift,
    label: 'Bonuses',
    path: '/bonuses',
    gradient: 'from-pink-500 to-rose-400',
    glowColor: 'rgba(236, 72, 153, 0.4)'
  },
  {
    icon: User,
    label: 'Profile',
    path: '/profile',
    gradient: 'from-emerald-500 to-green-400',
    glowColor: 'rgba(16, 185, 129, 0.4)'
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 + 0.1, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      onClick={() => {
        triggerHaptic('medium');
        navigate(item.path);
      }}
      className={cn(
        "relative flex flex-col items-center justify-center flex-1 py-2 min-w-0",
        "transition-all duration-300 ease-out",
        "touch-manipulation select-none"
      )}
      aria-label={item.label}
      aria-current={isActive ? 'page' : undefined}
    >
      {/* Active pill background */}
      <AnimatePresence mode="wait">
        {isActive && (
          <motion.div
            layoutId="navPill"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={cn(
              "absolute inset-x-2 -top-1 bottom-1 rounded-2xl",
              `bg-gradient-to-br ${item.gradient}`,
              "shadow-lg"
            )}
            style={{
              boxShadow: `0 8px 24px -4px ${item.glowColor}, 0 4px 12px -2px ${item.glowColor}`
            }}
          />
        )}
      </AnimatePresence>

      {/* Icon */}
      <motion.div
        animate={{
          scale: isActive ? 1.15 : 1,
          y: isActive ? -2 : 0,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="relative z-10"
      >
        <Icon
          className={cn(
            "w-5 h-5 transition-all duration-300",
            isActive
              ? "text-white drop-shadow-md"
              : "text-gray-400"
          )}
          strokeWidth={isActive ? 2.5 : 2}
        />
      </motion.div>

      {/* Label */}
      <motion.span
        animate={{
          opacity: isActive ? 1 : 0.6,
          y: isActive ? 0 : 2,
        }}
        transition={{ duration: 0.2 }}
        className={cn(
          "text-[10px] font-semibold mt-1 relative z-10 transition-colors duration-300",
          isActive ? "text-white" : "text-gray-400"
        )}
      >
        {item.label}
      </motion.span>

      {/* Sparkle effect for active item */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="absolute -top-1 -right-1 z-20"
          >
            <Sparkles className="w-3 h-3 text-white/80" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export function BottomNavCalAI() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, type: 'spring', stiffness: 260, damping: 25 }}
      className="fixed left-3 right-3 z-[100] md:hidden pointer-events-auto"
      style={{ bottom: `calc(env(safe-area-inset-bottom, 0px) + 8px)` }}
    >
      {/* Frosted glass container */}
      <div className="relative">
        {/* Ambient glow behind nav */}
        <div
          className="absolute inset-0 rounded-[28px] blur-2xl opacity-50"
          style={{
            background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.15) 0%, rgba(139, 92, 246, 0.1) 50%, rgba(236, 72, 153, 0.15) 100%)'
          }}
        />

        {/* Main nav bar */}
        <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl rounded-[28px] border border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-hidden">
          {/* Top shimmer line */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />

          {/* Navigation items */}
          <div className="flex items-center justify-around px-2 py-1">
            {NAV_ITEMS.map((item, index) => (
              <NavButton
                key={item.path}
                item={item}
                isActive={isActive(item.path)}
                index={index}
              />
            ))}
          </div>

          {/* Bottom accent */}
          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-200/50 dark:via-gray-700/50 to-transparent" />
        </div>
      </div>
    </motion.nav>
  );
}
