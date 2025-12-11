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

      {/* Badges Grid 2x2 */}
      <div className="grid grid-cols-2 gap-3">
        {badges.slice(0, 4).map((badge, index) => {
          const progress = badge.requirement_value 
            ? Math.min((lessonsCompleted / badge.requirement_value) * 100, 100)
            : 0;
          
          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.08 }}
              className={`bg-white rounded-xl p-4 border border-[#F0F0F0] flex flex-col items-center justify-center min-h-[160px] relative ${
                badge.earned ? '' : ''
              }`}
            >
              {/* Badge Image with Progress Ring */}
              <div className="relative w-16 h-16 mb-2">
                {/* Progress Ring */}
                {!badge.earned && badge.requirement_value && (
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="30"
                      fill="none"
                      stroke="#F0F0F0"
                      strokeWidth="4"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="30"
                      fill="none"
                      stroke="#FF6631"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={`${progress * 1.88} 188.4`}
                      className="transition-all duration-500"
                    />
                  </svg>
                )}
                <div className={`absolute inset-1 rounded-full flex items-center justify-center overflow-hidden ${badge.earned ? '' : 'opacity-50'}`}>
                  {badge.image_url ? (
                    <img
                      src={badge.image_url}
                      alt={badge.name}
                      className={`w-full h-full object-cover ${badge.earned ? '' : 'grayscale'}`}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center">
                      <Award className={`w-6 h-6 ${badge.earned ? 'text-amber-500' : 'text-gray-300'}`} />
                    </div>
                  )}
                </div>
              </div>

              {/* Badge Name */}
              <span className="text-sm font-medium text-[#393939] text-center leading-tight">
                {badge.name}
              </span>

              {/* Progress Text for unearned badges */}
              {!badge.earned && badge.requirement_value && (
                <span className="text-[11px] text-[#8D8D8D] text-center mt-1">
                  {lessonsCompleted}/{badge.requirement_value} lessons
                </span>
              )}

              {/* Earned indicator */}
              {badge.earned && (
                <span className="text-[11px] text-[#4CAF50] font-medium text-center mt-1">
                  ✓ Earned
                </span>
              )}
            </motion.div>
          );
        })}
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
