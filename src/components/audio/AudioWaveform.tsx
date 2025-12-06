import { memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AudioWaveformProps {
  isPlaying: boolean;
  progress?: number; // 0-100
  barCount?: number;
  className?: string;
  variant?: 'mini' | 'full';
  color?: 'primary' | 'white' | 'muted';
}

export const AudioWaveform = memo(function AudioWaveform({
  isPlaying,
  progress = 0,
  barCount = 5,
  className,
  variant = 'mini',
  color = 'primary',
}: AudioWaveformProps) {
  const heights = variant === 'mini'
    ? [40, 70, 100, 60, 80]
    : [30, 50, 80, 100, 70, 90, 40, 60, 85, 45];

  const actualBarCount = variant === 'mini' ? barCount : 10;
  const colorClass = {
    primary: 'bg-primary',
    white: 'bg-white',
    muted: 'bg-muted-foreground',
  }[color];

  return (
    <div
      className={cn(
        "flex items-end justify-center gap-[2px]",
        variant === 'mini' ? 'h-4' : 'h-8',
        className
      )}
    >
      {Array.from({ length: actualBarCount }).map((_, i) => {
        const baseHeight = heights[i % heights.length];
        const isActive = (i / actualBarCount) * 100 <= progress;

        return (
          <motion.div
            key={i}
            className={cn(
              "rounded-full transition-colors duration-200",
              variant === 'mini' ? 'w-[3px]' : 'w-1',
              isPlaying ? colorClass : 'bg-muted-foreground/30',
              !isPlaying && isActive && colorClass,
            )}
            animate={isPlaying ? {
              height: [`${baseHeight * 0.3}%`, `${baseHeight}%`, `${baseHeight * 0.5}%`, `${baseHeight * 0.8}%`, `${baseHeight * 0.3}%`],
            } : {
              height: `${baseHeight * 0.4}%`,
            }}
            transition={isPlaying ? {
              duration: 0.8 + (i * 0.1),
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.08,
            } : {
              duration: 0.3,
            }}
            style={{
              opacity: isPlaying || isActive ? 1 : 0.4,
            }}
          />
        );
      })}
    </div>
  );
});

// Circular waveform for fullscreen player
interface CircularWaveformProps {
  isPlaying: boolean;
  size?: number;
  className?: string;
}

export const CircularWaveform = memo(function CircularWaveform({
  isPlaying,
  size = 200,
  className,
}: CircularWaveformProps) {
  const bars = 24;
  const innerRadius = size * 0.35;
  const outerRadius = size * 0.48;

  return (
    <div
      className={cn("relative", className)}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0"
      >
        {Array.from({ length: bars }).map((_, i) => {
          const angle = (i / bars) * 360;
          const radians = (angle - 90) * (Math.PI / 180);
          const x1 = size / 2 + Math.cos(radians) * innerRadius;
          const y1 = size / 2 + Math.sin(radians) * innerRadius;
          const x2 = size / 2 + Math.cos(radians) * outerRadius;
          const y2 = size / 2 + Math.sin(radians) * outerRadius;

          return (
            <motion.line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="currentColor"
              strokeWidth={3}
              strokeLinecap="round"
              className="text-primary"
              initial={{ opacity: 0.3 }}
              animate={isPlaying ? {
                opacity: [0.3, 1, 0.5, 0.8, 0.3],
                strokeWidth: [2, 4, 3, 4, 2],
              } : {
                opacity: 0.3,
                strokeWidth: 2,
              }}
              transition={isPlaying ? {
                duration: 1 + (i % 5) * 0.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.04,
              } : {
                duration: 0.3,
              }}
            />
          );
        })}
      </svg>
    </div>
  );
});
