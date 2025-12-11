import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
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
        <div className="flex flex-row items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-full bg-[#FF6B6B] flex items-center justify-center">
            <Heart className="w-3.5 h-3.5 text-white" fill="white" />
          </div>
          <h2 className="text-lg font-semibold text-[#393939]">Favorites</h2>
        </div>
        <div className="bg-white rounded-xl border border-[#F0F0F0] p-6 animate-pulse">
          <div className="h-20 bg-muted rounded" />
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
      <div className="flex flex-row items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-full bg-[#FF6B6B] flex items-center justify-center">
          <Heart className="w-3.5 h-3.5 text-white" fill="white" />
        </div>
        <h2 className="text-lg font-semibold text-[#393939]">Favorites</h2>
        {favorites.length > 0 && (
          <span className="text-sm text-muted-foreground">({favorites.length})</span>
        )}
      </div>

      {favorites.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-xl border border-[#F0F0F0] p-6 flex flex-col items-center justify-center">
          <div className="mb-4">
            <img 
              src={clickFavoriteImg} 
              alt="Click to favorite" 
              className="w-[180px] h-auto"
            />
          </div>
          
          <p className="text-[#FFA500] font-semibold text-base mb-1">No favorites yet</p>
          <p className="text-[#8D8D8D] text-sm text-center">
            Click the <Heart className="w-3.5 h-3.5 inline text-[#8D8D8D]" /> to save lessons you love.
          </p>
        </div>
      ) : (
        /* Favorites List */
        <div className="bg-white rounded-xl border border-[#F0F0F0] overflow-hidden divide-y divide-[#F0F0F0]">
          {favorites.map((fav) => (
            <button
              key={fav.id}
              onClick={() => navigate(`/programs/${programSlug}/lesson/${fav.lesson?.day_number}`)}
              className="w-full flex items-center gap-3 p-4 hover:bg-[#FAFAFA] transition-colors text-left"
            >
              {/* Thumbnail */}
              <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-orange-100 to-amber-100">
                {fav.lesson?.image_url && (
                  <img 
                    src={fav.lesson.image_url} 
                    alt={fav.lesson.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#393939] truncate">
                  Lesson {fav.lesson?.day_number}: {fav.lesson?.title}
                </p>
                {fav.lesson?.summary && (
                  <p className="text-xs text-[#8D8D8D] line-clamp-2 mt-0.5">
                    {fav.lesson.summary}
                  </p>
                )}
              </div>

              {/* Heart Icon */}
              <Heart className="w-5 h-5 text-[#FF6B6B] flex-shrink-0" fill="#FF6B6B" />
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
