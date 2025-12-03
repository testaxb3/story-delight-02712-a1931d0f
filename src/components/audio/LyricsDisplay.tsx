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

  if (!transcript?.segments?.length) {
    return null;
  }

  return (
    <div className="relative w-full h-[200px] flex flex-col items-center justify-center overflow-hidden">
      {/* Fade gradients at top and bottom */}
      <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-black/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none" />

      {/* Previous line - fixed slot */}
      <div className="absolute top-4 left-0 right-0 flex justify-center px-6 h-12">
        <AnimatePresence mode="wait">
          {prevSegment && (
            <motion.p
              key={`prev-${prevSegment.text.slice(0, 20)}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 0.35 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="text-white/40 text-sm md:text-base font-medium text-center line-clamp-2"
            >
              {prevSegment.text}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      
      {/* Active line - center slot */}
      <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-center px-4">
        <AnimatePresence mode="wait">
          {activeSegment ? (
            <motion.p
              key={`active-${activeSegment.text.slice(0, 20)}`}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="text-white text-lg md:text-xl lg:text-2xl font-bold text-center leading-snug"
              style={{ textShadow: '0 2px 20px rgba(0,0,0,0.6)' }}
            >
              {activeSegment.text}
            </motion.p>
          ) : (
            <motion.p
              key="waiting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              className="text-white/50 text-base font-medium text-center"
            >
              {segments[0]?.text || '♪ ♪ ♪'}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      
      {/* Next line - fixed slot */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center px-6 h-12">
        <AnimatePresence mode="wait">
          {nextSegment && (
            <motion.p
              key={`next-${nextSegment.text.slice(0, 20)}`}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.15 }}
              className="text-white/50 text-sm md:text-base font-medium text-center line-clamp-2"
            >
              {nextSegment.text}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
