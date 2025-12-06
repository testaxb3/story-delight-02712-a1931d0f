import { useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface TranscriptSegment {
  start: number;
  end: number;
  text: string;
}

export interface TranscriptData {
  segments: TranscriptSegment[];
  language?: string;
  generated_at?: string;
  full_text?: string;
}

interface TeleprompterLyricsProps {
  transcript: TranscriptData | null;
  currentTime: number;
}

export function TeleprompterLyrics({ transcript, currentTime }: TeleprompterLyricsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastActiveIndexRef = useRef<number>(-1);

  // Debounced segment calculation - only recalculates when segment actually changes
  const activeSegmentIndex = useMemo(() => {
    if (!transcript?.segments?.length) return -1;

    return transcript.segments.findIndex(
      (seg) => currentTime >= seg.start && currentTime < seg.end
    );
  }, [transcript, Math.floor(currentTime * 2)]); // ~500ms granularity

  const segments = transcript?.segments || [];

  // Auto-scroll only when segment changes (simplified, no double RAF)
  useEffect(() => {
    if (activeSegmentIndex < 0 || activeSegmentIndex === lastActiveIndexRef.current) return;
    
    lastActiveIndexRef.current = activeSegmentIndex;
    
    const activeElement = containerRef.current?.querySelector(
      `[data-lyric-index="${activeSegmentIndex}"]`
    ) as HTMLElement;

    if (activeElement) {
      activeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [activeSegmentIndex]);

  if (!transcript?.segments?.length) {
    return null;
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div
        ref={containerRef}
        className="h-full overflow-y-auto scroll-smooth px-6 scrollbar-hide"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {/* Huge padding allows last lyric to reach center */}
        <div className="pt-[45vh] pb-[50vh] space-y-12">
          {segments.map((segment, index) => {
            const isActive = index === activeSegmentIndex;

            return (
              <motion.p
                key={`lyric-${index}`}
                data-lyric-index={index}
                layout="position"
                animate={{
                  opacity: isActive ? 1 : 0.5,
                  scale: isActive ? 1 : 0.98
                }}
                transition={{ 
                  duration: 0.2,
                  ease: [0.25, 0.1, 0.25, 1]
                }}
                className={cn(
                  "text-center cursor-default",
                  isActive
                    ? "text-3xl md:text-4xl font-black text-white drop-shadow-xl"
                    : "text-xl text-white/50 font-normal"
                )}
                style={{ 
                  lineHeight: '1.6',
                  willChange: isActive ? 'transform, opacity' : 'auto'
                }}
              >
                {segment.text}
              </motion.p>
            );
          })}
        </div>
      </div>
    </div>
  );
}
