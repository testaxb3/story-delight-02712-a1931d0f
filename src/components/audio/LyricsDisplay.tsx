import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

interface LyricsDisplayProps {
  transcript: TranscriptData | null;
  currentTime: number;
}

export function LyricsDisplay({ transcript, currentTime }: LyricsDisplayProps) {
  // Find the currently active segment based on playback time
  const activeSegmentIndex = useMemo(() => {
    if (!transcript?.segments?.length) return -1;
    
    return transcript.segments.findIndex(
      (seg) => currentTime >= seg.start && currentTime < seg.end
    );
  }, [transcript, currentTime]);

  const segments = transcript?.segments || [];
  const prevSegment = activeSegmentIndex > 0 ? segments[activeSegmentIndex - 1] : null;
  const activeSegment = activeSegmentIndex >= 0 ? segments[activeSegmentIndex] : null;
  const nextSegment = activeSegmentIndex >= 0 && activeSegmentIndex < segments.length - 1 
    ? segments[activeSegmentIndex + 1] 
    : null;

  // No transcript available
  if (!transcript?.segments?.length) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-white/50 text-lg font-medium">
          No lyrics available
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-[240px] flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Fixed slot: PREVIOUS line */}
      <div className="absolute top-0 left-0 right-0 flex justify-center px-6">
        <AnimatePresence mode="wait">
          {prevSegment && (
            <motion.p
              key={prevSegment.text}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.35 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="text-white/40 text-base md:text-lg font-medium text-center max-w-sm leading-relaxed"
            >
              {prevSegment.text}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      
      {/* Fixed slot: ACTIVE line - center */}
      <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-center px-6">
        <AnimatePresence mode="wait">
          {activeSegment ? (
            <motion.p
              key={activeSegment.text}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="text-white text-xl md:text-2xl lg:text-3xl font-bold text-center max-w-md leading-relaxed"
              style={{
                textShadow: '0 2px 16px rgba(0,0,0,0.5)'
              }}
            >
              {activeSegment.text}
            </motion.p>
          ) : (
            <motion.p
              key="waiting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              className="text-white/50 text-lg font-medium text-center"
            >
              {segments[0]?.text || '♪ ♪ ♪'}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      
      {/* Fixed slot: NEXT line */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center px-6">
        <AnimatePresence mode="wait">
          {nextSegment && (
            <motion.p
              key={nextSegment.text}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 0.45 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="text-white/50 text-base md:text-lg font-medium text-center max-w-sm leading-relaxed"
            >
              {nextSegment.text}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      
      {/* Progress dots - subtle indicator */}
      <div className="absolute bottom-[-40px] left-0 right-0 flex justify-center gap-1 px-8">
        {segments.slice(0, Math.min(segments.length, 20)).map((_, idx) => (
          <div
            key={idx}
            className={`h-1 rounded-full transition-all duration-200 ${
              idx === activeSegmentIndex
                ? 'w-4 bg-white'
                : idx < activeSegmentIndex
                ? 'w-1.5 bg-white/40'
                : 'w-1.5 bg-white/20'
            }`}
          />
        ))}
        {segments.length > 20 && (
          <span className="text-white/30 text-xs ml-1">+{segments.length - 20}</span>
        )}
      </div>
    </div>
  );
}
