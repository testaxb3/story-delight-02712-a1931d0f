import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, Loader2, Sparkles, Star, Rocket, Info } from 'lucide-react';
import { Program, useProgramVote } from '@/hooks/usePrograms';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useState } from 'react';

interface ComingSoonProgramCardProps {
  program: Program;
  index?: number;
}

export function ComingSoonProgramCard({ program, index = 0 }: ComingSoonProgramCardProps) {
  const { vote, unvote } = useProgramVote();
  const queryClient = useQueryClient();
  const [isVoting, setIsVoting] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Calculate vote progress (mock max of 100 for visual purposes)
  const maxVotes = 100;
  const voteProgress = Math.min(((program.votes_count || 0) / maxVotes) * 100, 100);

  const handleVote = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVoting(true);

    try {
      if (program.user_voted) {
        await unvote(program.id);
        toast.success('Vote removed');
      } else {
        await vote(program.id);
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 2000);
        toast.success('Thanks for voting! 🎉');
      }
      queryClient.invalidateQueries({ queryKey: ['programs'] });
    } catch (error) {
      toast.error('Failed to vote. Please try again.');
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1
      }}
      transition={{
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="relative h-full"
    >
      {/* Celebration confetti effect */}
      <AnimatePresence>
        {showCelebration && (
          <>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  opacity: 1,
                  scale: 0,
                  x: 0,
                  y: 0
                }}
                animate={{
                  opacity: 0,
                  scale: 1,
                  x: (Math.random() - 0.5) * 100,
                  y: (Math.random() - 0.5) * 100,
                  rotate: Math.random() * 360
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute top-1/2 left-1/2 z-20 pointer-events-none"
              >
                {i % 2 === 0 ? (
                  <Sparkles className="w-4 h-4 text-[#FF6631]" />
                ) : (
                  <Star className="w-3 h-3 text-[#FFA300] fill-[#FFA300]" />
                )}
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Card container */}
      <div className="h-full flex flex-col gap-[12px] p-[14px] bg-gradient-to-br from-white to-purple-50/30 dark:from-card dark:to-purple-950/10 rounded-[16px] border border-border shadow-sm hover:shadow-lg hover:border-purple-200 dark:hover:border-purple-800 transition-all duration-300 overflow-hidden">
        {/* Coming Soon badge */}
        <div className="absolute top-[8px] right-[8px] z-10">
          <div className="flex items-center gap-[4px] bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-[8px] py-[3px] rounded-full text-[9px] font-[600] shadow-sm">
            <Rocket className="w-[10px] h-[10px]" />
            <span>COMING SOON</span>
          </div>
        </div>

        {/* Image with gradient overlay */}
        <div className="relative w-full aspect-square rounded-[12px] overflow-hidden bg-gradient-to-br from-purple-100 to-indigo-100">
          {program.cover_image_url ? (
            <img
              src={program.cover_image_url}
              alt={program.title}
              className="w-full h-full object-cover grayscale-[30%] transition-all duration-500 hover:grayscale-0"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Rocket className="w-12 h-12 text-purple-300" />
              </motion.div>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 to-transparent" />
        </div>

        {/* Title */}
        <h3 className="text-center text-[14px] font-[700] leading-[1.2] text-foreground line-clamp-2 px-1">
          {program.title}
        </h3>

        {/* Vote progress bar */}
        <div className="w-full px-1">
          <div className="flex justify-between items-center mb-[4px]">
            <span className="text-[10px] text-muted-foreground">Community Interest</span>
            <span className="text-[10px] font-[600] text-purple-600 dark:text-purple-400">{program.votes_count || 0} votes</span>
          </div>
          <div className="relative h-[6px] w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${voteProgress}%` }}
              transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
            />
            {/* Shine effect on progress bar */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "200%" }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
              className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="w-full flex flex-col items-center gap-[8px] mt-auto">
          <Button
            variant="outline"
            className={`relative w-full rounded-full h-[36px] flex items-center justify-center gap-[6px] text-[12px] font-[600] border-2 px-0 transition-all overflow-hidden ${program.user_voted
              ? 'bg-gradient-to-r from-[#FF6631] to-[#FFA300] text-white border-transparent hover:opacity-90'
              : 'border-[#FF6631] text-[#FF6631] bg-transparent hover:bg-[#FF6631]/5'
              } ${isVoting ? 'cursor-wait opacity-70' : ''}`}
            onClick={handleVote}
            disabled={isVoting}
          >
            {isVoting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <motion.div
                  animate={program.user_voted ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <ThumbsUp className={`w-4 h-4 ${program.user_voted ? 'fill-current' : ''}`} />
                </motion.div>
                <span>{program.user_voted ? `Voted! (${program.votes_count || 0})` : 'Vote for this'}</span>
              </>
            )}

            {/* Shine effect on voted button */}
            {program.user_voted && (
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
                className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
              />
            )}
          </Button>

          <Button
            variant="ghost"
            className="w-full rounded-full h-[32px] flex items-center justify-center gap-[4px] text-[11px] font-[500] text-muted-foreground hover:text-foreground hover:bg-muted px-0"
          >
            <Info className="w-3 h-3" />
            <span>Learn more</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
