import { useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music2 } from 'lucide-react';

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
  seriesIcon?: string;
}

export function SyncedLyrics({ transcript, currentTime, artwork, seriesIcon }: SyncedLyricsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Find the currently active segment based on playback time
  const activeSegmentIndex = useMemo(() => {
    if (!transcript?.segments?.length) return -1;
    
    return transcript.segments.findIndex(
      (seg) => currentTime >= seg.start && currentTime < seg.end
    );
  }, [transcript, currentTime]);

  const activeSegment = activeSegmentIndex >= 0 
    ? transcript?.segments[activeSegmentIndex] 
    : null;

  // Get surrounding segments for context (previous, current, next)
  const visibleSegments = useMemo(() => {
    if (!transcript?.segments?.length) return [];
    
    const segments = transcript.segments;
    const start = Math.max(0, activeSegmentIndex - 1);
    const end = Math.min(segments.length, activeSegmentIndex + 3);
    
    return segments.slice(start, end).map((seg, idx) => ({
      ...seg,
      isActive: start + idx === activeSegmentIndex,
      isPast: start + idx < activeSegmentIndex,
    }));
  }, [transcript, activeSegmentIndex]);

  // No transcript available
  if (!transcript?.segments?.length) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Background with artwork blur */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-background to-background" />
          {artwork && (
            <img 
              src={artwork} 
              alt="" 
              className="absolute inset-0 w-full h-full object-cover opacity-20 blur-3xl scale-110"
            />
          )}
        </div>
        
        <div className="relative z-10 text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto">
            <Music2 className="w-10 h-10 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-lg">
            No lyrics available for this track
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background with artwork blur */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-background/95 to-background" />
        {artwork && (
          <img 
            src={artwork} 
            alt="" 
            className="absolute inset-0 w-full h-full object-cover opacity-30 blur-3xl scale-110"
          />
        )}
      </div>
      
      {/* Lyrics container */}
      <div 
        ref={containerRef}
        className="relative z-10 w-full px-8 py-12 flex flex-col items-center justify-center min-h-[300px]"
      >
        <AnimatePresence mode="wait">
          {activeSegment ? (
            <motion.div
              key={activeSegmentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="text-center"
            >
              {/* Previous segment (subtle) */}
              {visibleSegments.length > 0 && visibleSegments[0]?.isPast && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  className="text-lg text-foreground/30 mb-6 font-light italic"
                >
                  {visibleSegments[0].text}
                </motion.p>
              )}
              
              {/* Current segment (prominent) */}
              <motion.p
                key={`active-${activeSegmentIndex}`}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="text-2xl md:text-3xl font-medium text-foreground leading-relaxed italic"
              >
                {activeSegment.text}
              </motion.p>
              
              {/* Next segment preview (subtle) */}
              {transcript.segments[activeSegmentIndex + 1] && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  className="text-lg text-foreground/30 mt-6 font-light italic"
                >
                  {transcript.segments[activeSegmentIndex + 1].text}
                </motion.p>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              {/* Show first segment or waiting state */}
              {transcript.segments[0] && currentTime < transcript.segments[0].start ? (
                <p className="text-xl text-muted-foreground italic">
                  {transcript.segments[0].text}
                </p>
              ) : (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-4xl">{seriesIcon || '🎧'}</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Progress indicator dots */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-1.5 px-8">
        {transcript.segments.slice(0, 20).map((_, idx) => (
          <div
            key={idx}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              idx === activeSegmentIndex
                ? 'bg-primary w-4'
                : idx < activeSegmentIndex
                ? 'bg-primary/50'
                : 'bg-muted-foreground/30'
            }`}
          />
        ))}
        {transcript.segments.length > 20 && (
          <span className="text-xs text-muted-foreground ml-1">
            +{transcript.segments.length - 20}
          </span>
        )}
      </div>
    </div>
  );
}
