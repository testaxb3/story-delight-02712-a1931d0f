import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Headphones, Sparkles, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { AudioSeries } from '@/stores/audioPlayerStore';

interface ListenHeroProps {
  featuredSeries: AudioSeries | null;
  totalMinutesListened?: number;
}

export function ListenHero({ featuredSeries, totalMinutesListened = 0 }: ListenHeroProps) {
  const navigate = useNavigate();
  const [tiltStyle, setTiltStyle] = useState({ rotateX: 0, rotateY: 0 });

  if (!featuredSeries) return null;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate tilt (max 8 degrees)
    const rotateY = ((x - centerX) / centerX) * 8;
    const rotateX = ((centerY - y) / centerY) * 8;
    
    setTiltStyle({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setTiltStyle({ rotateX: 0, rotateY: 0 });
  };

  return (
    <div className="perspective-1000">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: tiltStyle.rotateX,
          rotateY: tiltStyle.rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-card border border-primary/20 shadow-xl transition-shadow duration-300 hover:shadow-2xl hover:shadow-primary/10"
      >
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-radial from-primary/30 to-transparent opacity-50 animate-pulse" />
          {/* Glass reflection effect */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"
            style={{ transform: 'translateZ(20px)' }}
          />
        </div>

        <div className="relative p-6 space-y-4">
          {/* Top row: badges */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/20 text-primary">
              <Sparkles className="w-3 h-3" />
              <span className="text-xs font-semibold">Featured Series</span>
            </div>
            
            {/* Listening stats badge */}
            {totalMinutesListened > 0 && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span className="text-xs font-medium">{totalMinutesListened} min listened</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex items-start gap-4">
            {/* Cover with 3D lift */}
            <motion.div 
              className="relative flex-shrink-0"
              whileHover={{ scale: 1.05, y: -4 }}
              transition={{ type: 'spring', stiffness: 300 }}
              style={{ transform: 'translateZ(30px)' }}
            >
              {featuredSeries.cover_image ? (
                <img
                  src={featuredSeries.cover_image}
                  alt={featuredSeries.name}
                  className="w-28 h-28 rounded-2xl object-cover shadow-2xl"
                />
              ) : (
                <div className="w-28 h-28 rounded-2xl bg-primary/20 flex items-center justify-center shadow-2xl">
                  <Headphones className="w-12 h-12 text-primary/60" />
                </div>
              )}
              
              {/* Floating icon */}
              {featuredSeries.icon_name && (
                <div className="absolute -top-2 -right-2 text-2xl drop-shadow-lg">
                  {featuredSeries.icon_name}
                </div>
              )}
            </motion.div>

            {/* Info */}
            <div className="flex-1 min-w-0 space-y-2">
              <h2 className="text-xl font-bold text-foreground leading-tight">
                {featuredSeries.name}
              </h2>
              
              {featuredSeries.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {featuredSeries.description}
                </p>
              )}

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{featuredSeries.track_count} episodes</span>
                <span>•</span>
                <span>{Math.round((featuredSeries.total_duration || 0) / 60)} min</span>
              </div>
            </div>
          </div>

          {/* CTA Button with glow */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate(`/listen/${featuredSeries.slug}`)}
            className="w-full h-12 rounded-full bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Start Listening</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
