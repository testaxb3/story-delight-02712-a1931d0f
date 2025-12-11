import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface FavoritesSectionProps {
  favorites?: string[];
}

export function FavoritesSection({ favorites = [] }: FavoritesSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="py-5"
    >
      {/* Header */}
      <div className="flex flex-row items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-full bg-[#FF6631] flex items-center justify-center">
          <Heart className="w-3.5 h-3.5 text-white fill-white" />
        </div>
        <h2 className="text-lg font-semibold text-[#393939]">Favorites</h2>
      </div>

      {/* Empty State */}
      {favorites.length === 0 && (
        <div className="flex flex-col items-center justify-center py-6 px-4">
          {/* Click Favorite Icon */}
          <div className="mb-3">
            <img
              src="/icons/click-favorite.svg"
              alt="Click to favorite"
              className="w-[160px] h-auto"
            />
          </div>
          <p className="text-base text-[#999] font-medium mb-1">No favorites yet</p>
          <p className="text-sm text-[#BBB] text-center">
            Click the <Heart className="w-4 h-4 inline text-[#BBB]" /> to save lessons you love.
          </p>
        </div>
      )}

      {/* TODO: List favorites when available */}
    </motion.div>
  );
}
