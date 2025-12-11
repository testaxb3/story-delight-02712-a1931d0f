import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

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
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Hand */}
            <path d="M25 55C25 55 30 45 35 40C40 35 45 35 45 35" stroke="#E0E0E0" strokeWidth="3" strokeLinecap="round"/>
            <circle cx="48" cy="32" r="8" fill="#FFE4E4" stroke="#FF6B6B" strokeWidth="2"/>
            {/* Heart in circle */}
            <path d="M48 29C46.5 27.5 44 28 44 30C44 31 45 32 48 35C51 32 52 31 52 30C52 28 49.5 27.5 48 29Z" fill="#FF6B6B"/>
            {/* Finger pointing */}
            <path d="M20 60L30 50" stroke="#E0E0E0" strokeWidth="3" strokeLinecap="round"/>
            <circle cx="18" cy="62" r="4" fill="#F5F5F5" stroke="#E0E0E0" strokeWidth="2"/>
          </svg>
        </div>
        
        <p className="text-[#FFA500] font-semibold text-base mb-1">No favorites yet</p>
        <p className="text-[#8D8D8D] text-sm text-center">
          Click the <Heart className="w-3.5 h-3.5 inline text-[#8D8D8D]" /> to save lessons you love.
        </p>
      </div>
    </motion.div>
  );
}
