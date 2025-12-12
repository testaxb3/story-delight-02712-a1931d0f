import { memo } from "react";
import { motion } from "framer-motion";
import { Play, Book, Clock, ArrowRight, Sparkles, RotateCcw } from "lucide-react";
import { BonusData } from "@/types/bonus";
import { cn } from "@/lib/utils";

interface ContinueLearningProps {
  inProgressBonuses: BonusData[];
  onContinue: (bonus: BonusData) => void;
}

export const ContinueLearning = memo(function ContinueLearning({
  inProgressBonuses,
  onContinue,
}: ContinueLearningProps) {
  if (!inProgressBonuses.length) return null;

  // Show max 3 items in compact view
  const items = inProgressBonuses.slice(0, 3);

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-[#FF6631] to-[#FFA300] flex items-center justify-center shadow-lg shadow-orange-500/20"
          >
            <RotateCcw className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <h3 className="text-lg font-bold text-[#393939]">Continue Learning</h3>
            <p className="text-xs text-[#8D8D8D]">{items.length} in progress</p>
          </div>
        </div>

        <Sparkles className="w-5 h-5 text-[#FFA300]" />
      </div>

      {/* Progress Cards */}
      <div className="space-y-3">
        {items.map((item, idx) => (
          <ContinueCard key={item.id} item={item} index={idx} onContinue={onContinue} />
        ))}
      </div>
    </motion.section>
  );
});

const ContinueCard = memo(function ContinueCard({
  item,
  index,
  onContinue,
}: {
  item: BonusData;
  index: number;
  onContinue: (bonus: BonusData) => void;
}) {
  const isVideo = item.category === 'video';
  const Icon = isVideo ? Play : Book;
  const progress = item.progress || 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => onContinue(item)}
      className="relative flex items-center gap-4 p-4 rounded-[16px] bg-white border border-[#F0E6DF] cursor-pointer hover:shadow-lg hover:shadow-orange-500/10 transition-all group overflow-hidden"
    >
      {/* Progress background bar */}
      <div
        className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#FF6631]/10 to-transparent transition-all"
        style={{ width: `${progress}%` }}
      />

      {/* Thumbnail */}
      <div className={cn(
        "relative shrink-0 overflow-hidden rounded-[10px] bg-gradient-to-br from-[#FF6631]/10 to-[#FFA300]/10 shadow-sm",
        isVideo ? "w-20 aspect-video" : "w-14 aspect-[3/4]"
      )}>
        <img
          src={item.thumbnail || "/placeholder.svg"}
          alt={item.title}
          className={cn(
            "absolute inset-0 w-full h-full transition-transform duration-300 group-hover:scale-110",
            isVideo ? "object-cover" : "object-fill"
          )}
        />

        {/* Play/Read overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-lg"
          >
            <Icon className={cn("w-4 h-4 text-[#FF6631]", isVideo && "fill-[#FF6631] ml-0.5")} />
          </motion.div>
        </div>
      </div>

      {/* Info */}
      <div className="relative flex-1 min-w-0">
        <h4 className="font-semibold text-[15px] text-[#393939] line-clamp-1 group-hover:text-[#FF6631] transition-colors">
          {item.title}
        </h4>

        {/* Progress bar */}
        <div className="flex items-center gap-3 mt-2">
          <div className="flex-1 h-2 bg-[#F0E6DF] rounded-full overflow-hidden max-w-[120px]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-full bg-gradient-to-r from-[#FF6631] to-[#FFA300] rounded-full relative"
            >
              {/* Shine effect */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{ duration: 1.5, delay: 1, repeat: Infinity, repeatDelay: 4 }}
                className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent"
              />
            </motion.div>
          </div>
          <span className="text-xs font-bold text-[#FF6631]">
            {progress}%
          </span>
        </div>
      </div>

      {/* Arrow */}
      <motion.div
        animate={{ x: [0, 4, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
        className="relative w-8 h-8 rounded-full bg-gradient-to-br from-[#FF6631]/10 to-[#FFA300]/10 flex items-center justify-center group-hover:from-[#FF6631]/20 group-hover:to-[#FFA300]/20 transition-colors"
      >
        <ArrowRight className="w-4 h-4 text-[#FF6631]" />
      </motion.div>

      {/* Hover accent line */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-0 rounded-r-full bg-gradient-to-b from-[#FF6631] to-[#FFA300] transition-all duration-300 group-hover:h-[60%]" />
    </motion.div>
  );
});
