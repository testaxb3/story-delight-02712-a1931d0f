import { Trophy, Sparkles, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProgramsStreakCardProps {
  programsCompletedCount: number;
}

export function ProgramsStreakCard({ programsCompletedCount }: ProgramsStreakCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative overflow-hidden rounded-[16px] p-[1px] bg-gradient-to-r from-[#FF6631] via-[#FFA300] to-[#FF6631]"
    >
      {/* Inner container with gradient background */}
      <div className="relative overflow-hidden rounded-[15px] bg-gradient-to-br from-[#FF6631] to-[#FFA300] py-[20px] px-[20px]">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 translate-x-8 -translate-y-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-full h-full rounded-full bg-white/10"
          />
        </div>
        <div className="absolute bottom-0 left-0 w-24 h-24 -translate-x-6 translate-y-6">
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="w-full h-full rounded-full bg-white/10"
          />
        </div>

        {/* Floating sparkles */}
        <motion.div
          animate={{ y: [-2, 2, -2], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-3 right-8"
        >
          <Sparkles className="w-4 h-4 text-white/60" />
        </motion.div>
        <motion.div
          animate={{ y: [2, -2, 2], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute bottom-4 right-16"
        >
          <Star className="w-3 h-3 text-white/50" />
        </motion.div>

        {/* Content */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-[12px]">
            {/* Animated trophy container */}
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="relative flex items-center justify-center w-[48px] h-[48px] rounded-full bg-white/20 backdrop-blur-sm"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Trophy className="w-[24px] h-[24px] text-white" />
              </motion.div>
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-full bg-white/20 blur-md" />
            </motion.div>

            <div className="flex flex-col">
              <span className="text-[14px] font-[500] text-white/80">Programs Completed</span>
              <span className="text-[12px] text-white/60">
                {programsCompletedCount > 0 
                  ? "Amazing progress! Keep it up! 🎉" 
                  : "Start your first program today!"}
              </span>
            </div>
          </div>

          {/* Animated counter */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="relative"
          >
            <div className="flex items-center justify-center min-w-[56px] h-[56px] rounded-[14px] bg-white/20 backdrop-blur-sm">
              <motion.span
                key={programsCompletedCount}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-[28px] font-[800] text-white"
              >
                {programsCompletedCount}
              </motion.span>
            </div>
            {/* Subtle glow behind counter */}
            <div className="absolute inset-0 rounded-[14px] bg-white/10 blur-lg" />
          </motion.div>
        </div>

        {/* Shine effect */}
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "200%" }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
          className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
        />
      </div>
    </motion.div>
  );
}
