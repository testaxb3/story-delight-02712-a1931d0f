import { memo, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

// Aurora effect with real depth and organic motion
const AuroraOrb = memo(function AuroraOrb({ 
  className, 
  delay = 0,
  duration = 20,
  scale = 1
}: { 
  className: string;
  delay?: number;
  duration?: number;
  scale?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: [0.4, 0.6, 0.4],
        scale: [scale, scale * 1.2, scale],
        x: [0, 30, -20, 0],
        y: [0, -40, 20, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={className}
    />
  );
});

// Grain texture for depth
const NoiseTexture = memo(function NoiseTexture() {
  return (
    <svg className="fixed inset-0 w-full h-full pointer-events-none opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch"/>
        <feColorMatrix type="saturate" values="0"/>
      </filter>
      <rect width="100%" height="100%" filter="url(#noise)"/>
    </svg>
  );
});

// Floating particles for atmosphere
const FloatingParticle = memo(function FloatingParticle({ 
  delay, 
  x, 
  size 
}: { 
  delay: number; 
  x: number; 
  size: number;
}) {
  return (
    <motion.div
      initial={{ y: '110vh', opacity: 0 }}
      animate={{ 
        y: '-10vh',
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: 15 + Math.random() * 10,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
      style={{ left: `${x}%` }}
      className="absolute"
    >
      <div 
        className="rounded-full bg-white/20 blur-[1px]"
        style={{ width: size, height: size }}
      />
    </motion.div>
  );
});

export const PremiumBackground = memo(function PremiumBackground() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    delay: Math.random() * 15,
    x: Math.random() * 100,
    size: 1 + Math.random() * 2,
  }));

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Deep base gradient */}
      <div className="absolute inset-0 bg-[#030303]" />
      
      {/* Radial vignette for depth */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 40%, transparent 0%, #030303 100%)',
        }}
      />

      {/* Aurora orbs - organic, slow, mesmerizing */}
      <AuroraOrb 
        className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-orange-600/8 via-rose-500/5 to-transparent blur-[120px]"
        delay={0}
        duration={25}
        scale={1}
      />
      <AuroraOrb 
        className="absolute top-1/3 -right-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-violet-600/6 via-indigo-500/4 to-transparent blur-[100px]"
        delay={5}
        duration={30}
        scale={1.1}
      />
      <AuroraOrb 
        className="absolute -bottom-1/4 left-1/4 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-cyan-600/5 via-teal-500/3 to-transparent blur-[100px]"
        delay={10}
        duration={28}
        scale={0.9}
      />

      {/* Subtle spotlight from top */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px]"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.02) 0%, transparent 70%)',
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0">
        {particles.map((p) => (
          <FloatingParticle key={p.id} {...p} />
        ))}
      </div>

      {/* Noise texture */}
      <NoiseTexture />

      {/* Top fade for status bar area */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/40 to-transparent" />
    </div>
  );
});
