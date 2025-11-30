import { memo } from 'react';

export const AmbientBackground = memo(function AmbientBackground() {
  return (
    <div 
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ contain: 'strict' }}
    >
      {/* Primary gradient orb - CSS animation */}
      <div
        className="absolute -top-[30%] -right-[20%] w-[70%] h-[70%] rounded-full animate-ambient-1 opacity-100 dark:opacity-100 blur-[40px]"
        style={{
          background: 'radial-gradient(circle, var(--ambient-orange) 0%, transparent 70%)',
          willChange: 'transform',
          contain: 'layout paint',
        }}
      />

      {/* Secondary accent orb - CSS animation */}
      <div
        className="absolute -bottom-[20%] -left-[25%] w-[60%] h-[60%] rounded-full animate-ambient-2 opacity-100 dark:opacity-100 blur-[40px]"
        style={{
          background: 'radial-gradient(circle, var(--ambient-indigo) 0%, transparent 70%)',
          willChange: 'transform',
          contain: 'layout paint',
        }}
      />
    </div>
  );
});
