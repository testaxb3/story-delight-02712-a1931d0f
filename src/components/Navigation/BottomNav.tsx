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

// Lottie Animated Icons
const HomeIcon = ({ isActive }: { isActive: boolean }) => (
  <Lottie
    animationData={homeAnimation}
    loop={isActive}
    autoplay={isActive}
    style={{
      width: 30,
      height: 30,
      filter: isActive ? 'none' : 'grayscale(100%) brightness(0.6)',
    }}
  />
);

const ScriptsIcon = ({ isActive }: { isActive: boolean }) => (
  <Lottie
    animationData={scriptsAnimation}
    loop={isActive}
    autoplay={isActive}
    style={{
      width: 30,
      height: 30,
      filter: isActive ? 'none' : 'grayscale(100%) brightness(0.6)',
    }}
  />
);

const BonusIcon = ({ isActive }: { isActive: boolean }) => (
  <Lottie
    animationData={bonusAnimation}
    loop={isActive}
    autoplay={isActive}
    style={{
      width: 30,
      height: 30,
      filter: isActive ? 'none' : 'grayscale(100%) brightness(0.6)',
    }}
  />
);

const VideosIcon = ({ isActive }: { isActive: boolean }) => (
  <Lottie
    animationData={videosAnimation}
    loop={isActive}
    autoplay={isActive}
    style={{
      width: 30,
      height: 30,
      filter: isActive ? 'none' : 'grayscale(100%) brightness(0.6)',
    }}
  />
);

const ProfileIcon = ({ isActive }: { isActive: boolean }) => (
  <Lottie
    animationData={profileAnimation}
    loop={isActive}
    autoplay={isActive}
    style={{
      width: 30,
      height: 30,
      filter: isActive ? 'none' : 'grayscale(100%) brightness(0.6)',
    }}
  />
);

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [ripples, setRipples] = useState<{ [key: string]: { x: number; y: number; id: number } | null }>({});

  const navItems = [
    { icon: HomeIcon, label: 'Home', path: '/', gradient: 'from-purple-500 to-blue-500' },
    { icon: ScriptsIcon, label: 'Scripts', path: '/scripts', gradient: 'from-green-500 to-emerald-600' },
    { icon: BonusIcon, label: 'Bônus', path: '/bonuses', gradient: 'from-amber-500 to-red-500' },
    { icon: VideosIcon, label: 'Vídeos', path: '/videos', gradient: 'from-red-500 to-pink-500' },
    { icon: ProfileIcon, label: 'Perfil', path: '/profile', gradient: 'from-orange-500 to-amber-500' },
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
      <div className="relative bg-background/95 backdrop-blur-2xl rounded-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-border/40 overflow-hidden">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent pointer-events-none" />
        
        <div className="relative flex items-center justify-around h-[68px] px-2">
          {navItems.map(({ icon: Icon, label, path, gradient }) => {
            const isActive = location.pathname === path;
            const ripple = ripples[path];

            return (
              <motion.button
                key={path}
                onMouseDown={(e) => handleRipple(e, path)}
                onTouchStart={(e) => handleRipple(e, path)}
                onClick={() => navigate(path)}
                className="relative flex flex-col items-center justify-center gap-1 min-w-[66px] py-2 group overflow-hidden rounded-[16px]"
                aria-label={label}
                whileTap={{
                  scale: 0.82,
                  y: 2,
                }}
                transition={{
                  type: "spring",
                  stiffness: 550,
                  damping: 18,
                  mass: 0.6
                }}
              >
                {/* Ripple effect - Telegram style with gradient */}
                {ripple && (
                  <motion.div
                    key={ripple.id}
                    className={cn(
                      "absolute rounded-full pointer-events-none bg-gradient-to-r opacity-30",
                      gradient
                    )}
                    style={{
                      left: ripple.x,
                      top: ripple.y,
                      transform: 'translate(-50%, -50%)',
                    }}
                    initial={{ width: 0, height: 0, opacity: 0.6 }}
                    animate={{ width: 140, height: 140, opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                )}

                {/* Active background with gradient glow */}
                <motion.div
                  className={cn(
                    "absolute inset-0 -inset-x-1 rounded-[16px]",
                    isActive ? cn("bg-gradient-to-r opacity-20", gradient) : "bg-transparent"
                  )}
                  initial={false}
                  animate={{
                    scale: isActive ? 1 : 0.85,
                    opacity: isActive ? 1 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  {/* Premium glow effect for active state */}
                  {isActive && (
                    <>
                      <motion.div
                        className={cn(
                          "absolute inset-0 rounded-[16px] bg-gradient-to-b opacity-25 blur-sm",
                          gradient
                        )}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0.2, 0.4, 0.2] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <motion.div
                        className={cn(
                          "absolute inset-0 rounded-[16px] bg-gradient-to-t from-transparent to-white/10"
                        )}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </>
                  )}
                </motion.div>

                {/* Icon container with TELEGRAM-STYLE LIVING ANIMATIONS */}
                <motion.div
                  className="relative flex items-center justify-center w-[30px] h-[30px]"
                  initial={false}
                  animate={{
                    scale: isActive ? 1.1 : 0.95,
                    y: isActive ? -3 : 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 600,
                    damping: 25,
                    mass: 0.8
                  }}
                >
                  {/* Icon glow effect when active - ENHANCED */}
                  {isActive && (
                    <motion.div
                      className={cn(
                        "absolute inset-0 rounded-full bg-gradient-to-r blur-xl opacity-50",
                        gradient
                      )}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{
                        scale: [0.8, 1.4, 0.8],
                        opacity: [0.2, 0.6, 0.2]
                      }}
                      transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  )}

                  {/* Icon with LIVING animations - bounces, rotates, morphs */}
                  <motion.div
                    className="relative z-10"
                    key={`${path}-${isActive ? 'active' : 'inactive'}`}
                    initial={{
                      scale: 0.5,
                      rotate: isActive ? -180 : 0,
                      opacity: 0
                    }}
                    animate={{
                      scale: 1,
                      rotate: 0,
                      opacity: 1,
                      y: [0, -4, 0], // Bounce effect on activation
                    }}
                    transition={{
                      scale: { type: "spring", stiffness: 500, damping: 20 },
                      rotate: { type: "spring", stiffness: 400, damping: 25 },
                      opacity: { duration: 0.15 },
                      y: {
                        duration: 0.4,
                        ease: [0.34, 1.56, 0.64, 1], // Bounce easing
                        times: [0, 0.5, 1]
                      }
                    }}
                    whileTap={{
                      scale: 0.75,
                      rotate: [0, -15, 15, -10, 10, 0], // More playful rotation
                      transition: {
                        duration: 0.5,
                        ease: "easeOut"
                      }
                    }}
                    whileHover={!isActive ? {
                      scale: 1.05,
                      y: -2,
                      transition: { duration: 0.2 }
                    } : {}}
                  >
                    <motion.div
                      animate={isActive ? {
                        rotate: [0, 2, -2, 1, -1, 0], // Subtle wiggle for active icon
                      } : {}}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Icon isActive={isActive} />
                    </motion.div>
                  </motion.div>
                </motion.div>

                {/* Label with LIVING gradient text animation */}
                <motion.span
                  className={cn(
                    "relative text-[11px] font-medium tracking-tight",
                    isActive ? "font-semibold" : "text-muted-foreground"
                  )}
                  initial={false}
                  animate={{
                    opacity: 1,
                    y: isActive ? 0 : 1,
                    scale: isActive ? 1.02 : 0.98,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                    mass: 0.5
                  }}
                >
                  {isActive && (
                    <motion.span
                      className={cn(
                        "bg-gradient-to-r bg-clip-text text-transparent",
                        gradient
                      )}
                      initial={{ opacity: 0, y: 3 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 20
                      }}
                    >
                      {label}
                    </motion.span>
                  )}
                  {!isActive && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.15 }}
                    >
                      {label}
                    </motion.span>
                  )}
                </motion.span>

                {/* Active indicator dot with LIVING animation */}
                {isActive && (
                  <motion.div
                    className="absolute top-1.5 left-1/2 -translate-x-1/2"
                    initial={{ scale: 0, opacity: 0, y: -8 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0, opacity: 0, y: -8 }}
                    transition={{
                      type: "spring",
                      stiffness: 600,
                      damping: 18,
                      mass: 0.5
                    }}
                  >
                    <motion.div
                      className={cn(
                        "w-1.5 h-1.5 rounded-full bg-gradient-to-r shadow-lg",
                        gradient
                      )}
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [1, 0.7, 1],
                        boxShadow: [
                          "0 0 0px rgba(0,0,0,0)",
                          "0 0 8px currentColor",
                          "0 0 0px rgba(0,0,0,0)"
                        ]
                      }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
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
