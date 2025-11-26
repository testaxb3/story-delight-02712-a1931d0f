import { memo } from 'react';

// ============================================================================
// OPTIMIZED PREMIUM BACKGROUND
// - Removed JS animations, using CSS only (GPU accelerated)
// - Reduced blur values
// - Removed floating particles (major perf hit)
// - Using will-change and transform for GPU acceleration
// ============================================================================

export const PremiumBackground = memo(function PremiumBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Deep base gradient */}
      <div className="absolute inset-0 bg-[#030303]" />

      {/* Radial vignette for depth */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 40%, transparent 0%, #030303 100%)',
        }}
      />

      {/* Aurora orbs - CSS animations only (much lighter) */}
      <div
        className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full animate-aurora-1"
        style={{
          background: 'radial-gradient(circle, rgba(251,146,60,0.18) 0%, rgba(251,146,60,0.05) 50%, transparent 70%)',
          filter: 'blur(40px)',
          willChange: 'transform',
        }}
      />
      <div
        className="absolute top-1/3 -right-1/4 w-[500px] h-[500px] rounded-full animate-aurora-2"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(139,92,246,0.04) 50%, transparent 70%)',
          filter: 'blur(40px)',
          willChange: 'transform',
        }}
      />
      <div
        className="absolute -bottom-1/4 left-1/4 w-[550px] h-[550px] rounded-full animate-aurora-3"
        style={{
          background: 'radial-gradient(circle, rgba(34,211,238,0.12) 0%, rgba(34,211,238,0.03) 50%, transparent 70%)',
          filter: 'blur(40px)',
          willChange: 'transform',
        }}
      />

      {/* Subtle spotlight from top */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[350px]"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.04) 0%, transparent 70%)',
        }}
      />

      {/* Static noise texture - much lighter than SVG filter */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Top fade for status bar area */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/30 to-transparent" />
    </div>
  );
});

// Add these CSS keyframes to your index.css or tailwind config:
// @keyframes aurora-1 {
//   0%, 100% { transform: translate(0, 0) scale(1); }
//   50% { transform: translate(20px, -30px) scale(1.05); }
// }
// @keyframes aurora-2 {
//   0%, 100% { transform: translate(0, 0) scale(1); }
//   50% { transform: translate(-25px, 20px) scale(1.08); }
// }
// @keyframes aurora-3 {
//   0%, 100% { transform: translate(0, 0) scale(1); }
//   50% { transform: translate(15px, 25px) scale(0.95); }
// }
