import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AudioTrackItem } from './AudioTrackItem';
import { Headphones, Sparkles } from 'lucide-react';
import type { AudioTrack, AudioSeries } from '@/stores/audioPlayerStore';
import { useAudioPlayerStore } from '@/stores/audioPlayerStore';

interface AudioTrackListProps {
  tracks: AudioTrack[];
  series: AudioSeries;
  hasAccess: boolean;
}

export function AudioTrackList({ tracks, series, hasAccess }: AudioTrackListProps) {
  const { currentTrack, isPlaying, play } = useAudioPlayerStore();
  const navigate = useNavigate();

  const handlePlayTrack = (track: AudioTrack) => {
    // Filter only accessible tracks for the queue
    const accessibleTracks = tracks.filter(t => t.is_preview || hasAccess);
    play(track, series, accessibleTracks);
  };

  const handleLockedClick = () => {
    navigate('/listen/upgrade');
  };

  if (!tracks || tracks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16 space-y-4"
      >
        <motion.div
          animate={{ y: [-4, 4, -4], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="w-20 h-20 mx-auto rounded-[20px] bg-gradient-to-br from-[#FF6631]/15 to-[#FFA300]/10 flex items-center justify-center"
        >
          <Headphones className="w-10 h-10 text-[#FF6631]/40" />
        </motion.div>
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-[#393939]">No tracks yet</h3>
          <p className="text-sm text-[#8D8D8D]">Episodes will appear here once available.</p>
        </div>
        <div className="flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              className="w-2 h-2 rounded-full bg-gradient-to-r from-[#FF6631] to-[#FFA300]"
            />
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-2">
      {tracks.map((track, index) => {
        const isLocked = !track.is_preview && !hasAccess;

        return (
          <AudioTrackItem
            key={track.id}
            track={track}
            isPlaying={isPlaying && currentTrack?.id === track.id}
            isCurrent={currentTrack?.id === track.id}
            onPlay={() => handlePlayTrack(track)}
            index={index}
            isLocked={isLocked}
            onLockedClick={handleLockedClick}
          />
        );
      })}
    </div>
  );
}
