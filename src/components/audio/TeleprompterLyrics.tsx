import { useRef, useEffect, useMemo, useState, useCallback } from 'react';
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
  
  // State to pause auto-scroll when user interacts
  const [userScrolling, setUserScrolling] = useState(false);
  const userScrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const activeSegmentIndex = useMemo(() => {
    if (!transcript?.segments?.length) return -1;
    
    return transcript.segments.findIndex(
      (seg) => currentTime >= seg.start && currentTime < seg.end
    );
  }, [transcript, currentTime]);

  const segments = transcript?.segments || [];

  // Handler to detect manual scroll and pause auto-scroll for 3 seconds
  const handleScroll = useCallback(() => {
    setUserScrolling(true);
    
    // Clear previous timeout
    if (userScrollTimeoutRef.current) {
      clearTimeout(userScrollTimeoutRef.current);
    }
    
    // Resume auto-scroll after 3 seconds of no user interaction
    userScrollTimeoutRef.current = setTimeout(() => {
      setUserScrolling(false);
    }, 3000);
  }, []);

  // Auto-scroll to keep active segment centered
  useEffect(() => {
    if (!userScrolling && activeRef.current && scrollContainerRef.current) {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        activeRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      });
    }
  }, [activeSegmentIndex, userScrolling]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (userScrollTimeoutRef.current) {
        clearTimeout(userScrollTimeoutRef.current);
      }
    };
  }, []);

  if (!transcript?.segments?.length) {
    return null;
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Fade gradient top - reduced opacity for more ambient color */}
      <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-black/60 via-black/30 to-transparent z-10 pointer-events-none" />
      
      {/* Scrollable lyrics container */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto scroll-smooth px-6 py-32 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="space-y-8">
          {segments.map((segment, index) => {
            const isActive = index === activeSegmentIndex;
            const isPast = index < activeSegmentIndex;
            
            return (
              <motion.p
                key={`${segment.start}-${index}`}
                ref={isActive ? activeRef : null}
                initial={{ scale: 0.98 }}
                animate={{ 
                  scale: isActive ? 1 : 0.98,
                }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className={cn(
                  "text-center transition-all duration-500 ease-out",
                  isActive 
                    ? "text-2xl md:text-3xl font-bold text-white drop-shadow-lg" 
                    : "text-lg md:text-xl text-white/30 font-normal"
                )}
                style={isActive ? {
                  textShadow: '0 0 60px rgba(255,255,255,0.5), 0 0 120px rgba(255,255,255,0.3)',
                  lineHeight: '1.7',
                } : {
                  lineHeight: '1.7',
                }}
              >
                {segment.text}
              </motion.p>
            );
          })}
        </div>
      </div>
      
      {/* Fade gradient bottom - reduced opacity for more ambient color */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black/60 via-black/30 to-transparent z-10 pointer-events-none" />
    </div>
  );
}
