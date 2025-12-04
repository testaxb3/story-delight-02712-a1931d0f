import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Play, Headphones } from 'lucide-react';
import type { AudioSeries } from '@/stores/audioPlayerStore';

interface QuickReliefCarouselProps {
  series: AudioSeries[];
}

export function QuickReliefCarousel({ series }: QuickReliefCarouselProps) {
  const navigate = useNavigate();

  if (series.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.15 }}
      className="space-y-3"
    >
      {/* Section header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">
          ⚡ Quick Relief
        </h2>
        <span className="text-xs text-muted-foreground">
          Under 10 min
        </span>
      </div>

      {/* Horizontal scroll */}
      <div 
        className="flex gap-3 overflow-x-auto scrollbar-none pb-1 -mx-2 px-2 snap-x snap-mandatory"
        style={{ 
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {series.map((s, index) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => navigate(`/listen/${s.slug}`)}
            className="flex-shrink-0 snap-start cursor-pointer group"
          >
            <div className="relative w-24 h-24">
              {/* Cover */}
              {s.cover_image ? (
                <img
                  src={s.cover_image}
                  alt={s.name}
                  className="w-full h-full rounded-xl object-cover shadow-md group-hover:shadow-lg transition-shadow"
                />
              ) : (
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shadow-md">
                  <Headphones className="w-8 h-8 text-primary/50" />
                </div>
              )}

              {/* Play overlay on hover */}
              <div className="absolute inset-0 rounded-xl bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                  <Play className="w-4 h-4 text-foreground fill-current ml-0.5" />
                </div>
              </div>

              {/* Icon badge */}
              {s.icon_name && (
                <div className="absolute -top-1 -right-1 text-sm drop-shadow-md">
                  {s.icon_name}
                </div>
              )}

              {/* Duration badge */}
              <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm">
                <span className="text-[10px] text-white font-medium">
                  {Math.round((s.total_duration || 0) / 60)}m
                </span>
              </div>
            </div>

            {/* Title below */}
            <p className="mt-1.5 text-xs font-medium text-foreground line-clamp-2 text-center max-w-24">
              {s.name}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
