import { memo, useState, useEffect, useCallback, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Flame, ChevronRight } from 'lucide-react';
import { SPRING, itemVariants } from './animations';

interface HeroMetricsCardProps {
  scriptsRead: number;
  totalScripts: number;
  onPress: () => void;
}

export const HeroMetricsCard = memo(function HeroMetricsCard({
  scriptsRead,
  totalScripts,
  onPress,
}: HeroMetricsCardProps) {
  const cardRef = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [8, -8]);
  const rotateY = useTransform(x, [-100, 100], [-8, 8]);

  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 });

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  }, [x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  const progress = totalScripts > 0 ? (scriptsRead / totalScripts) * 100 : 0;
  const circumference = 2 * Math.PI * 44;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Animated counter using requestAnimationFrame (60fps, non-blocking)
  const [displayCount, setDisplayCount] = useState(0);
  useEffect(() => {
    if (scriptsRead === 0) {
      setDisplayCount(0);
      return;
    }
    
    const duration = 1200;
    const startTime = performance.now();
    let animationId: number;
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(eased * scriptsRead);
      
      setDisplayCount(value);
      
      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      }
    };
    
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [scriptsRead]);

  return (
    <motion.button
      ref={cardRef}
      variants={itemVariants}
      whileTap={{ scale: 0.98 }}
      onClick={onPress}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformPerspective: 1000,
        transformStyle: "preserve-3d",
      }}
      className="relative w-full p-5 rounded-hero overflow-hidden text-left"
    >
      {/* Mesh gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-card via-card/95 to-card/90 dark:from-background/80 dark:via-background/60 dark:to-background/40" />

      {/* Animated mesh overlay */}
      <div
        className="absolute inset-0 opacity-20 dark:opacity-60"
        style={{
          backgroundImage: `
            radial-gradient(at 40% 20%, rgba(251,146,60,0.15) 0px, transparent 50%),
            radial-gradient(at 80% 0%, rgba(99,102,241,0.12) 0px, transparent 50%),
            radial-gradient(at 0% 50%, rgba(251,146,60,0.1) 0px, transparent 50%),
            radial-gradient(at 80% 100%, rgba(99,102,241,0.1) 0px, transparent 50%)
          `,
        }}
      />

      {/* Shine effect on hover */}
      <motion.div
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 45%, transparent 50%)',
        }}
      />

      {/* Glass border */}
      <div className="absolute inset-0 rounded-hero border-2 border-border/30 dark:border-border" />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-between">
        {/* Left - Stats */}
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, ...SPRING.gentle }}
          >
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-6xl font-bold text-foreground tracking-tight">
                {displayCount}
              </span>
              <span className="text-xl text-muted-foreground font-medium">/ {totalScripts}</span>
            </div>
            <p className="text-sm text-muted-foreground font-medium">Times you helped</p>
          </motion.div>
        </div>

        {/* Right - Circular Progress */}
        <div className="relative w-28 h-28">
          <div className="absolute inset-2 rounded-full bg-foreground/5 blur-xl" />
          <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              className="stroke-foreground/[0.08]"
              strokeWidth="8"
              fill="none"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="44"
              stroke="url(#progressGradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
              style={{ strokeDasharray: circumference }}
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fb923c" />
                <stop offset="50%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Flame className="w-6 h-6 text-orange-400" />
            <span className="text-lg font-bold text-foreground">{Math.round(progress)}%</span>
          </div>
        </div>
      </div>

      {/* Bottom CTA hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex items-center gap-1 mt-4 text-muted-foreground"
      >
        <span className="text-xs">Tap to explore scripts</span>
        <ChevronRight className="w-3 h-3" />
      </motion.div>
    </motion.button>
  );
});
