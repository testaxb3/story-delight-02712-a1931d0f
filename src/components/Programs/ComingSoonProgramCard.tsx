import { motion } from 'framer-motion';
import { ThumbsUp } from 'lucide-react';
import { Program, useProgramVote } from '@/hooks/usePrograms';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useState } from 'react';

interface ComingSoonProgramCardProps {
  program: Program;
  index?: number;
}

// Pastel gradient placeholders
const gradients = [
  'from-purple-200 via-pink-200 to-rose-200',
  'from-blue-200 via-cyan-200 to-teal-200',
  'from-yellow-200 via-orange-200 to-amber-200',
  'from-green-200 via-emerald-200 to-teal-200',
];

export function ComingSoonProgramCard({ program, index = 0 }: ComingSoonProgramCardProps) {
  const { vote, unvote } = useProgramVote();
  const queryClient = useQueryClient();
  const [isVoting, setIsVoting] = useState(false);
  const gradient = gradients[index % gradients.length];

  const handleVote = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVoting(true);
    
    try {
      if (program.user_voted) {
        await unvote(program.id);
        toast.success('Vote removed');
      } else {
        await vote(program.id);
        toast.success('Thanks for voting!');
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
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-card rounded-xl border border-border overflow-hidden"
    >
      {/* Illustration Placeholder - Larger */}
      <div className={`relative h-32 bg-gradient-to-br ${gradient}`}>
        {/* Decorative circle placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white/40" />
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Title - Multi-line */}
        <h3 className="text-sm font-semibold text-foreground mb-3 text-center line-clamp-2 min-h-[40px]">
          {program.title}
        </h3>
        
        {/* Buttons */}
        <div className="flex flex-col gap-2">
          <Button
            variant={program.user_voted ? "default" : "outline"}
            size="sm"
            className={`w-full text-xs gap-1.5 ${
              program.user_voted 
                ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                : 'border-orange-500 text-orange-600 hover:bg-orange-50'
            }`}
            onClick={handleVote}
            disabled={isVoting}
          >
            <ThumbsUp className={`w-3.5 h-3.5 ${program.user_voted ? 'fill-current' : ''}`} />
            {program.user_voted ? `Voted (${program.votes_count || 0})` : 'Vote for this'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs text-muted-foreground"
          >
            Read more
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
