import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import clickFavoriteImg from '@/assets/click-favorite.svg';

export function FavoritesSection() {
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
      </div>

      {/* Empty State */}
      <div className="bg-white rounded-xl border border-[#F0F0F0] p-6 flex flex-col items-center justify-center">
        {/* Illustration */}
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
    </motion.div>
  );
}
