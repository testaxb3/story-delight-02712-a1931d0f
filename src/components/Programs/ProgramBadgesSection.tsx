import { motion } from 'framer-motion';
import { Award } from 'lucide-react';
import { ProgramBadge } from '@/hooks/useProgramDetail';

interface ProgramBadgesSectionProps {
  badges: ProgramBadge[];
  lessonsCompleted?: number;
}

export function ProgramBadgesSection({ badges, lessonsCompleted = 0 }: ProgramBadgesSectionProps) {
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
          <Award className="w-3.5 h-3.5 text-white" />
        </div>
        <h2 className="text-lg font-semibold text-[#393939]">Achievements</h2>
      </div>

      {/* Badges Grid - 3 columns like reference */}
      <div className="grid grid-cols-3 gap-3">
        {badges.map((badge, index) => {
          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.08 }}
              className={`bg-white rounded-xl p-3 border border-[#F0F0F0] flex flex-col items-center justify-center min-h-[130px]`}
            >
              {/* Badge Image - Larger, no progress ring */}
              <div className={`w-16 h-16 mb-2 rounded-full overflow-hidden ${badge.earned ? '' : 'opacity-50'}`}>
                {badge.image_url ? (
                  <img
                    src={badge.image_url}
                    alt={badge.name}
                    className={`w-full h-full object-cover ${badge.earned ? '' : 'grayscale'}`}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center">
                    <Award className={`w-8 h-8 ${badge.earned ? 'text-amber-500' : 'text-gray-300'}`} />
                  </div>
                )}
              </div>

              {/* Badge Name */}
              <span className="text-xs font-medium text-[#393939] text-center leading-tight line-clamp-2">
                {badge.name}
              </span>

              {/* Earned indicator */}
              {badge.earned && (
                <span className="text-[10px] text-[#4CAF50] font-medium text-center mt-1">
                  ✓ Earned
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
