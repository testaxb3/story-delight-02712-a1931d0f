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

interface SyncedLyricsProps {
  transcript: TranscriptData | null;
  currentTime: number;
  artwork?: string;
}

export function SyncedLyrics({ transcript, currentTime, artwork }: SyncedLyricsProps) {
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
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Background with artwork blur */}
        {artwork && (
          <img 
            src={artwork} 
            alt="" 
            className="absolute inset-0 w-full h-full object-cover blur-3xl scale-125 opacity-40"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        
        <p className="relative z-10 text-white/50 text-lg font-medium">
          No lyrics available
        </p>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Immersive Background - Artwork with extreme blur */}
      {artwork && (
        <img 
          src={artwork} 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover blur-3xl scale-125 opacity-50"
        />
      )}
      
      {/* Dark gradient overlay for legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      
      {/* Lyrics Container - Centered */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-8 py-16">
        <AnimatePresence mode="popLayout">
          {/* Previous line */}
          {prevSegment && (
            <motion.p
              key={`prev-${activeSegmentIndex - 1}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.3, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="text-white/30 text-lg md:text-xl font-medium text-center mb-6 max-w-md leading-relaxed"
            >
              {prevSegment.text}
            </motion.p>
          )}
          
          {/* Current line - BOLD and prominent */}
          {activeSegment ? (
            <motion.p
              key={`active-${activeSegmentIndex}`}
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -30 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="text-white text-2xl md:text-3xl lg:text-4xl font-bold text-center max-w-lg leading-relaxed"
              style={{
                textShadow: '0 2px 20px rgba(0,0,0,0.5), 0 0 40px rgba(255,255,255,0.1)'
              }}
            >
              {activeSegment.text}
            </motion.p>
          ) : (
            <motion.p
              key="waiting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              className="text-white/50 text-xl font-medium text-center"
            >
              {segments[0]?.text || '♪ ♪ ♪'}
            </motion.p>
          )}
          
          {/* Next line */}
          {nextSegment && (
            <motion.p
              key={`next-${activeSegmentIndex + 1}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 0.4, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="text-white/40 text-lg md:text-xl font-medium text-center mt-6 max-w-md leading-relaxed"
            >
              {nextSegment.text}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      
      {/* Subtle progress dots at bottom */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-1 px-8">
        {segments.slice(0, Math.min(segments.length, 30)).map((_, idx) => (
          <div
            key={idx}
            className={`h-1 rounded-full transition-all duration-300 ${
              idx === activeSegmentIndex
                ? 'w-6 bg-white'
                : idx < activeSegmentIndex
                ? 'w-1.5 bg-white/40'
                : 'w-1.5 bg-white/20'
            }`}
          />
        ))}
        {segments.length > 30 && (
          <span className="text-white/30 text-xs ml-1">+{segments.length - 30}</span>
        )}
      </div>
    </div>
  );
}
