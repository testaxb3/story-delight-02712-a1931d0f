import { motion } from 'framer-motion';
import { ProgramBadge } from '@/hooks/useProgramDetail';

interface ProgramBadgesSectionProps {
  badges: ProgramBadge[];
}

export function ProgramBadgesSection({ badges }: ProgramBadgesSectionProps) {
  if (badges.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="py-5"
    >
      {/* Header */}
      <div className="flex flex-row items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-full bg-[#FFA500] flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L15 8.5L22 9.5L17 14.5L18 21.5L12 18.5L6 21.5L7 14.5L2 9.5L9 8.5L12 2Z" fill="white"/>
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-[#393939]">Achievements</h2>
      </div>

      {/* Badges Grid 2x2 */}
      <div className="grid grid-cols-2 gap-3">
        {badges.slice(0, 4).map((badge, index) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.08 }}
            className={`bg-white rounded-xl p-4 border border-[#F0F0F0] flex flex-col items-center justify-center min-h-[140px] ${
              badge.earned ? '' : 'opacity-60'
            }`}
          >
            {/* Badge Image */}
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-2 overflow-hidden">
              {badge.image_url ? (
                <img
                  src={badge.image_url}
                  alt={badge.name}
                  className={`w-full h-full object-cover ${badge.earned ? '' : 'grayscale opacity-50'}`}
                />
              ) : (
                <div className="w-full h-full bg-[#F5F5F5] rounded-full flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L15 8.5L22 9.5L17 14.5L18 21.5L12 18.5L6 21.5L7 14.5L2 9.5L9 8.5L12 2Z" fill="#D4D4D4"/>
                  </svg>
                </div>
              )}
            </div>

            {/* Badge Name */}
            <span className="text-sm font-medium text-[#393939] text-center leading-tight">
              {badge.name}
            </span>

            {/* Description - small text */}
            {badge.description && (
              <span className="text-[10px] text-[#999] text-center mt-1 line-clamp-2 leading-tight px-1">
                {badge.description}
              </span>
            )}
          </motion.div>
        ))}
      </div>

      {/* Show more if there are more badges */}
      {badges.length > 4 && (
        <button className="w-full mt-3 py-2 text-sm text-[#FF6631] font-medium">
          View all {badges.length} achievements
        </button>
      )}
    </motion.div>
  );
}
