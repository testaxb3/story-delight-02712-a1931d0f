import { motion, AnimatePresence } from 'framer-motion';
import { memo, useState, useEffect } from 'react';
import { useHaptic } from '@/hooks/useHaptic';

interface AuthWelcomeProps {
  onGetStarted: () => void;
  onSignIn: () => void;
}

// Logo with breathing animation
const Logo = memo(function Logo() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      {/* Glow behind logo */}
      <motion.div
        animate={{ 
          opacity: [0.5, 0.8, 0.5],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 w-20 h-20 bg-gradient-to-br from-orange-500/30 to-rose-500/20 rounded-3xl blur-xl"
      />
      
      {/* Logo container */}
      <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-500 via-rose-500 to-pink-600 p-[1px] shadow-2xl shadow-orange-500/20">
        <div className="w-full h-full rounded-3xl bg-gradient-to-br from-orange-500 via-rose-500 to-pink-600 flex items-center justify-center">
          {/* Simple elegant brain/parenting icon */}
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Heart shape representing parenting love */}
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill="white"
              fillOpacity="0.95"
            />
            {/* Small sparkle for "NEP" touch */}
            <circle cx="12" cy="10" r="1.5" fill="white" fillOpacity="0.8" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
});

// Animated word reveal
const AnimatedText = memo(function AnimatedText({ 
  text, 
  delay = 0,
  className = ""
}: { 
  text: string;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay,
        ease: [0.22, 1, 0.36, 1] 
      }}
      className={`block ${className}`}
    >
      {text}
    </motion.span>
  );
});

// Rotating text animation
const RotatingText = memo(function RotatingText() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { triggerHaptic } = useHaptic();
  
  const phrases = [
    "that works.",
    "that transforms.",
    "that connects.", 
    "that heals.",
    "that matters."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % phrases.length);
      triggerHaptic('light');
    }, 3000);
    
    return () => clearInterval(interval);
  }, [triggerHaptic]);

  return (
    <div className="relative h-[72px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.span
          key={phrases[currentIndex]}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="block text-white/60 text-5xl sm:text-6xl font-bold tracking-tight"
          style={{ textShadow: '0 0 40px rgba(255,255,255,0.1)' }}
        >
          {phrases[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
});

// Feature pill with staggered animation
const FeaturePill = memo(function FeaturePill({ 
  text, 
  delay 
}: { 
  text: string; 
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay,
        ease: [0.22, 1, 0.36, 1]
      }}
      className="px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm"
    >
      <span className="text-white/60 text-sm font-medium tracking-wide">{text}</span>
    </motion.div>
  );
});

// Magnetic button with sophisticated hover
const MagneticButton = memo(function MagneticButton({ 
  children, 
  onClick,
  variant = 'primary',
  delay = 0
}: { 
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  delay?: number;
}) {
  const { triggerHaptic } = useHaptic();
  const [isHovered, setIsHovered] = useState(false);

  const isPrimary = variant === 'primary';

  const handleClick = () => {
    triggerHaptic('light');
    onClick();
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay,
        ease: [0.22, 1, 0.36, 1]
      }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
      className={`
        relative w-full py-4 rounded-2xl font-semibold text-lg
        transition-all duration-300 ease-out
        ${isPrimary 
          ? 'bg-white text-black shadow-2xl shadow-white/10' 
          : 'bg-transparent text-white/70 hover:text-white'
        }
      `}
    >
      {/* Shine effect on primary button */}
      {isPrimary && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={isHovered ? { x: '100%' } : { x: '-100%' }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent rounded-2xl overflow-hidden pointer-events-none"
        />
      )}
      
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
});

export const AuthWelcome = memo(function AuthWelcome({ 
  onGetStarted, 
  onSignIn 
}: AuthWelcomeProps) {
  const features = ['Science-based', 'Personalized scripts', 'Ready-to-use'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      transition={{ duration: 0.5 }}
      className="min-h-screen w-full flex flex-col relative"
    >
      {/* Language selector - minimal with safe area */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute top-[max(env(safe-area-inset-top),44px)] right-6 z-20"
        style={{ paddingTop: '0.5rem' }}
      >
        <button className="px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-white/50 text-sm font-medium hover:bg-white/[0.06] hover:text-white/70 transition-all">
          EN
        </button>
      </motion.div>

      {/* Main content - centered vertically */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
        {/* Logo */}
        <div className="mb-12">
          <Logo />
        </div>

        {/* Hero text - staggered reveal */}
        <div className="text-center mb-8">
          <AnimatedText 
            text="Parenting" 
            delay={0.2}
            className="text-white text-5xl sm:text-6xl font-bold tracking-tight"
          />
          <RotatingText />
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-white/40 text-lg text-center max-w-[280px] leading-relaxed mb-10"
        >
          Transform challenging moments into connection with neuroscience-backed scripts.
        </motion.p>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {features.map((feature, i) => (
            <FeaturePill
              key={feature}
              text={feature}
              delay={0.7 + i * 0.1}
            />
          ))}
        </div>
      </div>

      {/* Bottom CTAs */}
      <div className="px-6 pb-[calc(env(safe-area-inset-bottom,0px)+2rem)] space-y-3">
        <MagneticButton onClick={onGetStarted} variant="primary" delay={0.9}>
          Get Started
        </MagneticButton>
        
        <MagneticButton onClick={onSignIn} variant="secondary" delay={1}>
          Already have an account? <span className="text-white font-semibold ml-1">Sign In</span>
        </MagneticButton>
      </div>
    </motion.div>
  );
});
