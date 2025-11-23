import { memo } from 'react';

export const AuthBackground = memo(function AuthBackground() {
  return (
    <>
      {/* Gradient Background - CSS only, no animations */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-background/95" />
      
      {/* Static Gradient Orbs - Much better performance */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/8 rounded-full blur-[120px] opacity-70" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/8 rounded-full blur-[120px] opacity-70" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/5 rounded-full blur-[100px]" />
      </div>

      {/* Subtle Grid Pattern */}
      <div 
        className="fixed inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
    </>
  );
});
