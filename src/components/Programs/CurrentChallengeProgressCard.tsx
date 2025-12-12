import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, BookOpen, Users } from 'lucide-react';

interface CurrentChallengeProgressCardProps {
  title: string;
  totalLessons: number;
  completedLessons: number;
  ageRange: string | null;
  imageUrl?: string;
}

export function CurrentChallengeProgressCard({
  title,
  totalLessons,
  completedLessons,
  ageRange,
  imageUrl
}: CurrentChallengeProgressCardProps) {
  const percentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const isComplete = completedLessons >= totalLessons;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pt-5 pb-2.5"
    >
      {/* Card with gradient border */}
      <div className="relative p-[2px] rounded-[20px] bg-gradient-to-r from-[#FF6631] via-[#FFA300] to-[#FF6631] overflow-hidden">
        {/* Animated gradient border */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-[#FF6631] via-[#FFA300] to-[#FF6631]"
          animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
          style={{ backgroundSize: '200% 100%' }}
        />

        {/* Inner content */}
        <div className="relative bg-gradient-to-br from-[#FFF9F5] to-[#FFEAD9] rounded-[18px] p-4">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 translate-x-8 -translate-y-8 opacity-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              className="w-full h-full rounded-full border-4 border-[#FF6631] border-dashed"
            />
          </div>

          {/* Card Content */}
          <div className="relative z-10 flex flex-row items-center gap-4">
            {/* Challenge Image - with glow effect */}
            <div className="relative flex-shrink-0">
              {/* Glow background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF6631]/40 to-[#FFA300]/40 rounded-full blur-md scale-110" />

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <img
                  alt="challenge"
                  loading="lazy"
                  width={90}
                  height={90}
                  className="rounded-full w-[90px] h-[90px] object-cover border-[3px] border-white shadow-lg"
                  src={imageUrl || '/program-images/picky-eating/28-day-picky-eater-mini.png'}
                />

                {/* Progress ring around image */}
                <svg className="absolute -inset-1 w-[98px] h-[98px] -rotate-90">
                  <circle
                    cx="49"
                    cy="49"
                    r="46"
                    fill="none"
                    stroke="#E0E0E0"
                    strokeWidth="4"
                    opacity="0.3"
                  />
                  <motion.circle
                    cx="49"
                    cy="49"
                    r="46"
                    fill="none"
                    stroke="url(#progressGradientDetail)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${percentage * 2.89} 289`}
                    initial={{ strokeDasharray: '0 289' }}
                    animate={{ strokeDasharray: `${percentage * 2.89} 289` }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                  />
                  <defs>
                    <linearGradient id="progressGradientDetail" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#FF6631" />
                      <stop offset="100%" stopColor="#FFA300" />
                    </linearGradient>
                  </defs>
                </svg>
              </motion.div>
            </div>

            {/* Challenge Info */}
            <div className="flex flex-col gap-2 flex-1 min-w-0">
              {/* Status Badge */}
              <motion.div
                className="flex flex-row items-center gap-2 self-start"
                animate={isComplete ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 1, repeat: isComplete ? Infinity : 0 }}
              >
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${isComplete
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                  : 'bg-gradient-to-r from-[#FF6631] to-[#FFA300]'
                  }`}>
                  {isComplete ? (
                    <Sparkles className="w-3 h-3 text-white" />
                  ) : (
                    <motion.div
                      className="w-2 h-2 rounded-full bg-white"
                      animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                  <span className="text-xs font-semibold text-white">
                    {isComplete ? 'Completed!' : 'Ongoing'}
                  </span>
                </div>
              </motion.div>

              {/* Title */}
              <h2 className="text-foreground text-lg leading-tight font-bold line-clamp-2">
                {title}
              </h2>

              {/* Tags with icons */}
              <div className="flex flex-row items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 py-1 px-2.5 bg-gradient-to-r from-[#FF6631]/10 to-[#FFA300]/10 rounded-full border border-[#FF6631]/30">
                  <BookOpen className="w-3 h-3 text-[#FF6631]" />
                  <span className="text-xs text-[#FF5C16] font-semibold">
                    {totalLessons} Lessons
                  </span>
                </div>
                {ageRange && (
                  <div className="flex items-center gap-1.5 py-1 px-2.5 bg-gradient-to-r from-[#2791E0]/10 to-[#76B9FF]/10 rounded-full border border-[#2791E0]/30">
                    <Users className="w-3 h-3 text-[#2791E0]" />
                    <span className="text-xs text-[#2791E0] font-semibold">
                      {ageRange}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Progress Bar - Premium Version */}
          <div className="relative z-10 mt-4 pt-3 border-t border-[#FFD9B3]/50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#FF6631]" />
                <span className="text-sm text-foreground font-medium">Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#FF6631]">{completedLessons}</span>
                <span className="text-sm text-muted-foreground">of</span>
                <span className="text-sm font-bold text-foreground">{totalLessons}</span>
              </div>
            </div>

            <div className="relative h-3 rounded-full bg-white/80 overflow-hidden shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                className={`h-full rounded-full relative ${isComplete
                  ? 'bg-gradient-to-r from-green-500 to-emerald-400'
                  : 'bg-gradient-to-r from-[#FF6631] to-[#FFA300]'
                  }`}
              >
                {/* Shine effect */}
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{ duration: 1.5, delay: 1.2, repeat: Infinity, repeatDelay: 3 }}
                  className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12"
                />
              </motion.div>

              {/* Percentage label floating above */}
              {percentage > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 }}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  <span className="text-[10px] font-bold text-white drop-shadow-sm">
                    {percentage}%
                  </span>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
