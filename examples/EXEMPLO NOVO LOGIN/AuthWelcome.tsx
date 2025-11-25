import { motion, useScroll, useTransform } from 'framer-motion';
import { memo, useEffect, useState } from 'react';

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
          {/* NEP icon - simplified brain/neural network */}
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M20 8C14.477 8 10 12.477 10 18c0 4.418 2.865 8.166 6.839 9.489.5.092.683-.217.683-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.341-3.369-1.341-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.071 1.531 1.031 1.531 1.031.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.578 9.578 0 0120 13.125c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C27.137 26.163 30 22.418 30 18c0-5.523-4.477-10-10-10z" 
              fill="white"
              fillOpacity="0.95"
            />
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
  const [isHovered, setIsHovered] = useState(false);

  const isPrimary = variant === 'primary';

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
      onClick={onClick}
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
  const features = ['Science-based', 'Personalized scripts', 'Instant results'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      transition={{ duration: 0.5 }}
      className="min-h-screen w-full flex flex-col relative"
    >
      {/* Language selector - minimal */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute top-6 right-6 z-20"
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
          <AnimatedText 
            text="that works." 
            delay={0.35}
            className="text-white/40 text-5xl sm:text-6xl font-bold tracking-tight"
          />
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
        <div className="flex flex-wrap justify-center gap-2 mb-16">
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
