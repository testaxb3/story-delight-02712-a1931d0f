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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLParagraphElement>(null);

  const activeSegmentIndex = useMemo(() => {
    if (!transcript?.segments?.length) return -1;
    
    return transcript.segments.findIndex(
      (seg) => currentTime >= seg.start && currentTime < seg.end
    );
  }, [transcript, currentTime]);

  const segments = transcript?.segments || [];

  // Auto-scroll to keep active segment centered
  useEffect(() => {
    if (activeRef.current && scrollContainerRef.current) {
      activeRef.current.scrollIntoView({
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
      {/* Fade gradient top */}
      <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-black/90 via-black/60 to-transparent z-10 pointer-events-none" />
      
      {/* Scrollable lyrics container */}
      <div 
        ref={scrollContainerRef}
        className="h-full overflow-y-auto scroll-smooth px-6 py-32 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="space-y-6">
          {segments.map((segment, index) => {
            const isActive = index === activeSegmentIndex;
            const isPast = index < activeSegmentIndex;
            const isFuture = index > activeSegmentIndex;
            
            return (
              <motion.p
                key={`${segment.start}-${index}`}
                ref={isActive ? activeRef : null}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: isActive ? 1 : isPast ? 0.25 : 0.35,
                  scale: isActive ? 1 : 0.98,
                }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className={cn(
                  "text-center transition-all duration-300 leading-relaxed",
                  isActive 
                    ? "text-2xl md:text-3xl font-semibold text-white" 
                    : "text-lg md:text-xl text-white/30 font-medium"
                )}
                style={isActive ? {
                  textShadow: '0 0 40px rgba(255,255,255,0.4), 0 0 80px rgba(255,255,255,0.2)',
                  lineHeight: '1.6',
                } : {
                  lineHeight: '1.6',
                }}
              >
                {segment.text}
              </motion.p>
            );
          })}
        </div>
      </div>
      
      {/* Fade gradient bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-10 pointer-events-none" />
    </div>
  );
}

