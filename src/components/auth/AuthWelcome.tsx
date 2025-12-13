import { motion, AnimatePresence } from 'framer-motion';
import { memo, useState, useEffect } from 'react';
import { useHaptic } from '@/hooks/useHaptic';
import { MessageCircle, Mail, ChevronRight, Star, Zap, Heart, Users } from 'lucide-react';

interface AuthWelcomeProps {
  onGetStarted: () => void;
  onSignIn: () => void;
}

// ============================================
// ANIMATED GRADIENT BACKGROUND
// ============================================
const AnimatedBackground = memo(function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Base */}
      <div className="absolute inset-0 bg-[#030303]" />

      {/* Animated gradient orbs */}
      <motion.div
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(251,146,60,0.25) 0%, transparent 60%)',
          filter: 'blur(60px)',
        }}
      />
      <motion.div
        animate={{
          x: [0, -20, 0],
          y: [0, 30, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 -right-1/4 w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 60%)',
          filter: 'blur(60px)',
        }}
      />
      <motion.div
        animate={{
          x: [0, 25, 0],
          y: [0, 20, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-1/4 left-1/4 w-[550px] h-[550px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 60%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Subtle noise overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
});

// ============================================
// PREMIUM LOGO WITH ANIMATIONS
// ============================================
const PremiumLogo = memo(function PremiumLogo() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      {/* Outer glow ring */}
      <motion.div
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -inset-4 rounded-[40px]"
        style={{
          background: 'linear-gradient(135deg, rgba(251,146,60,0.4), rgba(236,72,153,0.3))',
          filter: 'blur(30px)',
        }}
      />

      {/* Logo container */}
      <div className="relative w-24 h-24">
        {/* Gradient border */}
        <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-orange-400 via-rose-500 to-pink-600 p-[2px]">
          <div className="w-full h-full rounded-[30px] bg-gradient-to-br from-orange-500 via-rose-500 to-pink-600 flex items-center justify-center shadow-2xl shadow-rose-500/30">
            {/* Heart icon */}
            <motion.svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                fill="white"
              />
            </motion.svg>
          </div>
        </div>

        {/* Floating stars */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-2 -right-2"
        >
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
        </motion.div>
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1 -left-2"
        >
          <Zap className="w-3 h-3 text-amber-300" />
        </motion.div>
      </div>
    </motion.div>
  );
});

// ============================================
// HERO TEXT WITH TYPEWRITER
// ============================================
const HeroText = memo(function HeroText() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const { triggerHaptic } = useHaptic();

  const phrases = [
    { main: "Parenting", sub: "reimagined." },
    { main: "Connection", sub: "restored." },
    { main: "Calm", sub: "cultivated." },
    { main: "Confidence", sub: "unlocked." },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
      triggerHaptic('light');
    }, 3500);
    return () => clearInterval(interval);
  }, [triggerHaptic]);

  return (
    <div className="text-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={phraseIndex}
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-1"
        >
          <h1
            className="text-5xl sm:text-6xl font-black text-white tracking-tight"
            style={{ textShadow: '0 0 80px rgba(251,146,60,0.3)' }}
          >
            {phrases[phraseIndex].main}
          </h1>
          <p
            className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-rose-400 to-pink-400"
          >
            {phrases[phraseIndex].sub}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
});

// ============================================
// SOCIAL PROOF MINI
// ============================================
const SocialProofMini = memo(function SocialProofMini() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5 }}
      className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm"
    >
      {/* Avatar stack */}
      <div className="flex -space-x-2">
        {['https://i.pravatar.cc/40?img=1', 'https://i.pravatar.cc/40?img=5', 'https://i.pravatar.cc/40?img=9'].map((url, i) => (
          <img
            key={i}
            src={url}
            alt=""
            className="w-7 h-7 rounded-full border-2 border-[#030303] object-cover"
          />
        ))}
      </div>

      <div className="flex items-center gap-1.5">
        <Users className="w-3.5 h-3.5 text-white/40" />
        <span className="text-white/50 text-sm font-medium">Trusted by parents</span>
      </div>
    </motion.div>
  );
});

// ============================================
// PRIMARY CTA BUTTON
// ============================================
const PrimaryCTA = memo(function PrimaryCTA({
  onClick,
  children,
  delay = 0
}: {
  onClick: () => void;
  children: React.ReactNode;
  delay?: number;
}) {
  const { triggerHaptic } = useHaptic();

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.98 }}
      whileHover={{ scale: 1.02 }}
      onClick={() => {
        triggerHaptic('medium');
        onClick();
      }}
      className="relative w-full py-4 px-6 rounded-2xl bg-white text-black font-bold text-lg shadow-2xl shadow-white/20 overflow-hidden flex items-center justify-center gap-2 group"
    >
      {/* Shine effect */}
      <motion.div
        initial={{ x: '-100%' }}
        whileHover={{ x: '200%' }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-black/10 to-transparent skew-x-12"
      />

      <span className="relative z-10">{children}</span>
      <ChevronRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
    </motion.button>
  );
});

// ============================================
// SECONDARY CTA BUTTON
// ============================================
const SecondaryCTA = memo(function SecondaryCTA({
  onClick,
  delay = 0
}: {
  onClick: () => void;
  delay?: number;
}) {
  const { triggerHaptic } = useHaptic();

  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.5 }}
      onClick={() => {
        triggerHaptic('light');
        onClick();
      }}
      className="w-full py-3 text-white/50 hover:text-white transition-colors font-medium"
    >
      Already have an account? <span className="text-white font-semibold">Sign In</span>
    </motion.button>
  );
});

// ============================================
// SUPPORT SECTION
// ============================================
const SupportSection = memo(function SupportSection() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.3, duration: 0.5 }}
      className="pt-4"
    >
      {/* Divider */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-white/30 text-xs font-medium">NEED HELP?</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      {/* Support buttons */}
      <div className="flex justify-center gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.open('https://wa.me/27617525578?text=Hi!%20I%20need%20help%20with%20NEP%20System', '_blank')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 transition-colors"
        >
          <MessageCircle className="w-4 h-4 text-green-400" />
          <span className="text-green-400 text-sm font-medium">WhatsApp</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.href = 'mailto:support@nepsystem.pro'}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
        >
          <Mail className="w-4 h-4 text-blue-400" />
          <span className="text-blue-400 text-sm font-medium">Email</span>
        </motion.button>
      </div>
    </motion.div>
  );
});

// ============================================
// MAIN COMPONENT
// ============================================
export const AuthWelcome = memo(function AuthWelcome({
  onGetStarted,
  onSignIn
}: AuthWelcomeProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      className="min-h-screen w-full flex flex-col relative overflow-hidden"
    >
      {/* Animated background */}
      <AnimatedBackground />

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Main content - centered */}
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          {/* Logo */}
          <div className="mb-10">
            <PremiumLogo />
          </div>

          {/* Hero text */}
          <div className="mb-6">
            <HeroText />
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-white/40 text-base text-center max-w-[300px] leading-relaxed mb-8"
          >
            Your personalized parenting scripts are ready and waiting.
          </motion.p>

          {/* Social proof */}
          <SocialProofMini />
        </div>

        {/* Bottom section */}
        <div className="px-6 pb-4">
          {/* CTAs */}
          <div className="space-y-2 mb-2">
            <PrimaryCTA onClick={onGetStarted} delay={1}>
              Get Started
            </PrimaryCTA>

            <SecondaryCTA onClick={onSignIn} delay={1.1} />
          </div>

          {/* Support */}
          <SupportSection />
        </div>

        {/* Safe area */}
        <div className="h-[env(safe-area-inset-bottom,0px)]" />
      </div>
    </motion.div>
  );
});
