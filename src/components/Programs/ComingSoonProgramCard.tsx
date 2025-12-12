import { motion } from 'framer-motion';
import { ThumbsUp, Loader2 } from 'lucide-react';
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
        setTimeout(() => setShowCelebration(false), 1000);
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
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: showCelebration ? [1, 1.05, 1] : 1
      }}
      transition={{
        delay: index * 0.1,
        scale: { duration: 0.3 }
      }}
      whileHover={{ y: -4, boxShadow: "0 8px 16px -4px rgba(147, 51, 234, 0.15)" }}
      className="h-full flex flex-col gap-[10px] p-[14px] bg-[#F9F5F2] rounded-[10px] border border-[#F0E6DF] shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Image Placeholder */}
      <div className="relative w-full aspect-square rounded-[10px] overflow-hidden bg-slate-200">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-indigo-100" />
      </div>

      {/* Title */}
      <p className="text-center text-[14px] font-[800] leading-[1.12] mt-auto text-[#393939] line-clamp-2">
        {program.title}
      </p>
      
      {/* Buttons */}
      <div className="w-full flex flex-col items-center gap-[6px] mt-auto">
        <Button
          variant="outline"
          className={`relative w-full rounded-[29px] h-[29px] flex items-center justify-center gap-[3px] text-[12px] font-[400] border px-0 transition-all ${
            program.user_voted
              ? 'bg-[#FF6631] text-white border-[#FF6631] hover:bg-[#FF6631]/90'
              : 'border-[#FF6631] text-[#FF6631] bg-transparent hover:bg-[#FF6631]/10'
          } ${isVoting ? 'cursor-wait opacity-70' : ''}`}
          onClick={handleVote}
          disabled={isVoting}
        >
          {isVoting ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <>
              <ThumbsUp className={`w-3 h-3 ${program.user_voted ? 'fill-current' : ''}`} />
              {program.user_voted ? `Voted (${program.votes_count || 0})` : 'Vote for this'}
            </>
          )}
        </Button>
        
        <Button
          variant="outline"
          className="w-full rounded-[29px] h-[29px] flex items-center justify-center gap-[2px] text-[12px] font-[400] border border-[#393939] text-[#393939] bg-transparent hover:bg-[#393939]/10 px-0"
        >
          Read more
        </Button>
      </div>
    </motion.div>
  );
}
