import { motion } from 'framer-motion';
import { Award, Star, Lock, Sparkles, Trophy } from 'lucide-react';
import { ProgramBadge } from '@/hooks/useProgramDetail';

interface ProgramBadgesSectionProps {
  badges: ProgramBadge[];
  lessonsCompleted?: number;
}

export function ProgramBadgesSection({ badges, lessonsCompleted = 0 }: ProgramBadgesSectionProps) {
  if (badges.length === 0) return null;

  const earnedCount = badges.filter(b => b.earned).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="py-5"
    >
      {/* Header */}
      <div className="flex flex-row items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-[12px] bg-gradient-to-br from-[#FFA300] to-[#FF8C00] shadow-lg shadow-orange-500/20">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#393939]">Achievements</h2>
            <p className="text-xs text-[#8D8D8D]">{earnedCount} of {badges.length} unlocked</p>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-1">
          {[...Array(badges.length)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className={`w-2 h-2 rounded-full ${i < earnedCount
                  ? 'bg-gradient-to-r from-[#FFA300] to-[#FF8C00]'
                  : 'bg-gray-200'
                }`}
            />
          ))}
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-3 gap-3">
        {badges.map((badge, index) => {
          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
              whileHover={badge.earned ? { scale: 1.05, y: -4 } : {}}
              className={`relative bg-white rounded-[16px] p-4 border flex flex-col items-center justify-center min-h-[140px] transition-all ${badge.earned
                  ? 'border-[#FFA300]/30 shadow-md shadow-orange-500/10 hover:shadow-lg hover:shadow-orange-500/20'
                  : 'border-[#F0F0F0]'
                }`}
            >
              {/* Earned glow effect */}
              {badge.earned && (
                <div className="absolute inset-0 rounded-[16px] bg-gradient-to-br from-[#FFA300]/5 to-[#FF8C00]/5" />
              )}

              {/* Badge Image */}
              <div className="relative mb-3">
                {/* Glow behind earned badges */}
                {badge.earned && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-gradient-to-br from-[#FFA300] to-[#FF8C00] rounded-full blur-lg scale-125"
                  />
                )}

                <div className={`relative w-16 h-16 rounded-full overflow-hidden ${badge.earned ? '' : 'opacity-40 grayscale'
                  }`}>
                  {badge.image_url ? (
                    <img
                      src={badge.image_url}
                      alt={badge.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className={`w-full h-full rounded-full flex items-center justify-center ${badge.earned
                        ? 'bg-gradient-to-br from-amber-100 to-orange-100'
                        : 'bg-gray-100'
                      }`}>
                      <Award className={`w-8 h-8 ${badge.earned ? 'text-amber-500' : 'text-gray-300'
                        }`} />
                    </div>
                  )}
                </div>

                {/* Lock overlay for unearned */}
                {!badge.earned && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
                    <Lock className="w-5 h-5 text-white/80" />
                  </div>
                )}

                {/* Star decoration for earned */}
                {badge.earned && (
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-1 -right-1"
                  >
                    <Star className="w-5 h-5 text-[#FFA300] fill-[#FFA300]" />
                  </motion.div>
                )}
              </div>

              {/* Badge Name */}
              <span className={`text-xs font-semibold text-center leading-tight line-clamp-2 ${badge.earned ? 'text-[#393939]' : 'text-gray-400'
                }`}>
                {badge.name}
              </span>

              {/* Earned indicator */}
              {badge.earned ? (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-1 mt-2"
                >
                  <Sparkles className="w-3 h-3 text-[#FFA300]" />
                  <span className="text-[10px] text-[#FFA300] font-semibold">Earned!</span>
                </motion.div>
              ) : (
                <span className="text-[10px] text-gray-400 mt-2">Locked</span>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
