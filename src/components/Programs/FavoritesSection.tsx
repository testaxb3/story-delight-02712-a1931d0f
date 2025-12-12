import { motion } from 'framer-motion';
import { Heart, ChevronRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFavoriteLessons } from '@/hooks/useFavoriteLessons';
import clickFavoriteImg from '@/assets/click-favorite.svg';

interface FavoritesSectionProps {
  programId: string;
  programSlug: string;
}

export function FavoritesSection({ programId, programSlug }: FavoritesSectionProps) {
  const navigate = useNavigate();
  const { favorites, isLoading } = useFavoriteLessons(programId);

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="py-5"
      >
        <div className="flex flex-row items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-[#FF6B6B] to-[#FF5252] flex items-center justify-center shadow-lg shadow-red-500/20">
            <Heart className="w-5 h-5 text-white" fill="white" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Favorites</h2>
        </div>
        <div className="bg-white dark:bg-card rounded-[16px] border border-border p-6 animate-pulse">
          <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded-xl" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="py-5"
    >
      {/* Header */}
      <div className="flex flex-row items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center justify-center w-10 h-10 rounded-[12px] bg-gradient-to-br from-[#FF6B6B] to-[#FF5252] shadow-lg shadow-red-500/20"
          >
            <Heart className="w-5 h-5 text-white" fill="white" />
          </motion.div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Favorites</h2>
            {favorites.length > 0 && (
              <p className="text-xs text-muted-foreground">{favorites.length} lesson{favorites.length !== 1 ? 's' : ''} saved</p>
            )}
          </div>
        </div>

        {favorites.length > 0 && (
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-5 h-5 text-[#FF6B6B]" />
          </motion.div>
        )}
      </div>

      {favorites.length === 0 ? (
        /* Empty State - Premium version */
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="relative bg-gradient-to-br from-white to-[#FFF5F5] rounded-[20px] border border-[#FFE0E0] p-6 flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-24 h-24 translate-x-8 -translate-y-8 opacity-10">
            <Heart className="w-full h-full text-[#FF6B6B]" fill="currentColor" />
          </div>

          <motion.div
            className="mb-4"
            animate={{ y: [-4, 4, -4] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <img
              src={clickFavoriteImg}
              alt="Click to favorite"
              className="w-[160px] h-auto"
            />
          </motion.div>

          <h3 className="text-[#FF6B6B] font-bold text-base mb-1">No favorites yet</h3>
          <p className="text-muted-foreground text-sm text-center max-w-[200px]">
            Click the <Heart className="w-3.5 h-3.5 inline text-[#FF6B6B]" fill="#FF6B6B" /> to save lessons you love for quick access.
          </p>
        </motion.div>
      ) : (
        /* Favorites List - Premium version */
        <div className="bg-white dark:bg-card rounded-[20px] border border-border overflow-hidden shadow-sm">
          {favorites.map((fav, index) => (
            <motion.button
              key={fav.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ backgroundColor: 'rgba(255, 107, 107, 0.05)' }}
              onClick={() => navigate(`/programs/${programSlug}/lesson/${fav.lesson?.day_number}`)}
              className="group w-full flex items-center gap-3 p-4 border-b border-border last:border-b-0 transition-colors text-left"
            >
              {/* Thumbnail with gradient fallback */}
              <div className="relative w-14 h-14 rounded-[12px] overflow-hidden flex-shrink-0 shadow-sm">
                {fav.lesson?.image_url ? (
                  <img
                    src={fav.lesson.image_url}
                    alt={fav.lesson.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-[#FF6B6B]/50" />
                  </div>
                )}

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-[#FF6B6B]/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-[12px]" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-semibold text-[#FF6B6B] bg-[#FF6B6B]/10 px-2 py-0.5 rounded-full">
                    Day {fav.lesson?.day_number}
                  </span>
                </div>
                <p className="text-sm font-semibold text-foreground truncate group-hover:text-[#FF6B6B] transition-colors">
                  {fav.lesson?.title}
                </p>
                {fav.lesson?.summary && (
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                    {fav.lesson.summary}
                  </p>
                )}
              </div>

              {/* Heart and Arrow */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Heart className="w-5 h-5 text-[#FF6B6B]" fill="#FF6B6B" />
                </motion.div>
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                  className="w-8 h-8 rounded-full bg-[#FF6B6B]/10 flex items-center justify-center group-hover:bg-[#FF6B6B]/20 transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-[#FF6B6B]" />
                </motion.div>
              </div>
            </motion.button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
