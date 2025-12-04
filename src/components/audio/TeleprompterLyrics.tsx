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

  const activeSegmentIndex = useMemo(() => {
    if (!transcript?.segments?.length) return -1;

    return transcript.segments.findIndex(
      (seg) => currentTime >= seg.start && currentTime < seg.end
    );
  }, [transcript, currentTime]);

  const segments = transcript?.segments || [];

  // AUTO-SCROLL using data-attribute selector (avoids React ref conflicts)
  useEffect(() => {
    if (activeSegmentIndex < 0) return;

    const container = containerRef.current;
    if (!container) return;

    // Double RAF ensures DOM is fully rendered
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        try {
          // Query by data attribute instead of ref (more stable with Framer Motion)
          const activeElement = container.querySelector(
            `[data-lyric-index="${activeSegmentIndex}"]`
          ) as HTMLElement;

          if (!activeElement) {
            console.log('❌ Element not found:', activeSegmentIndex);
            return;
          }

          // Calculate scroll position using bounding rects (mobile-safe)
          const containerRect = container.getBoundingClientRect();
          const elementRect = activeElement.getBoundingClientRect();

          const currentScroll = container.scrollTop;
          const elementTopRelative = elementRect.top - containerRect.top + currentScroll;
          const targetScroll = elementTopRelative - (containerRect.height / 2) + (elementRect.height / 2);

          console.log('📊', {
            idx: activeSegmentIndex,
            cur: Math.round(currentScroll),
            tgt: Math.round(targetScroll)
          });

          // Attempt smooth scroll
          container.scrollTo({
            top: targetScroll,
            behavior: 'smooth'
          });

          // iOS Safari fallback: force instant scroll if smooth didn't work
          setTimeout(() => {
            if (Math.abs(container.scrollTop - targetScroll) > 20) {
              console.log('⚠️ Force scroll');
              container.scrollTop = targetScroll;
            }
          }, 150);

        } catch (err) {
          console.error('❌ Scroll failed:', err);
        }
      });
    });
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
          WebkitOverflowScrolling: 'touch' // iOS momentum scrolling
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
                initial={{ opacity: 0.5, scale: 0.98 }}
                animate={{
                  opacity: isActive ? 1 : 0.5,
                  scale: isActive ? 1 : 0.98
                }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className={cn(
                  "text-center transition-all duration-300 cursor-default",
                  isActive
                    ? "text-3xl md:text-4xl font-black text-white drop-shadow-xl"
                    : "text-xl text-white/50 font-normal"
                )}
                style={{ lineHeight: '1.6' }}
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
