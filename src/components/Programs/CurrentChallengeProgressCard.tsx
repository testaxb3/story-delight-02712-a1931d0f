import { motion } from 'framer-motion';

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

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pt-5 pb-2.5"
    >
      <div className="flex flex-col gap-3 rounded-[15px] bg-[#FFEAD9] p-3 border border-[#FFA500]">
        {/* Card Content */}
        <div className="flex flex-row items-center gap-3">
          {/* Challenge Image - Circular */}
          <div className="relative flex-shrink-0">
            <img
              alt="challenge"
              loading="lazy"
              width={80}
              height={80}
              className="rounded-full w-20 h-20 object-cover border-2 border-[#FF6631]"
              src={imageUrl || '/program-images/picky-eating/28-day-picky-eater-mini.png'}
            />
          </div>

          {/* Challenge Info */}
          <div className="flex flex-col gap-2 flex-1">
            {/* Status with green dot */}
            <div className="flex flex-row items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#4CAF50]" />
              <span className="text-sm text-[#393939]">Ongoing</span>
            </div>

            {/* Title */}
            <h2 className="text-[#393939] text-lg leading-tight font-bold">
              {title}
            </h2>

            {/* Tags */}
            <div className="flex flex-row items-center gap-2 flex-wrap">
              <span className="py-0.5 px-2 border border-[#FF5C16] rounded text-xs text-[#FF5C16] font-medium">
                {totalLessons} Lesson
              </span>
              {ageRange && (
                <span className="py-0.5 px-2 border border-[#2791E0] rounded text-xs text-[#2791E0] font-medium">
                  {ageRange}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex flex-row items-center gap-3">
          <span className="text-sm text-[#393939] font-medium min-w-[40px]">
            {completedLessons}/{totalLessons}
          </span>
          <div className="flex-1 h-2 rounded-full bg-white overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="bg-[#FF6631] h-full rounded-full"
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
}
