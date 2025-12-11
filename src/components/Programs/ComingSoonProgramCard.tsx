import { motion } from 'framer-motion';
import { ThumbsUp, Clock } from 'lucide-react';
import { Program, useProgramVote } from '@/hooks/usePrograms';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useState } from 'react';

interface ComingSoonProgramCardProps {
  program: Program;
  index?: number;
}

const gradients = [
  'from-slate-400 via-slate-500 to-slate-600',
  'from-zinc-400 via-zinc-500 to-zinc-600',
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
      className="relative overflow-hidden rounded-xl bg-card border border-border"
    >
      {/* Gradient Thumbnail Placeholder */}
      <div className="relative h-24 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-60`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Coming Soon Badge */}
        <div className="absolute top-2 right-2">
          <span className="px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-[10px] font-medium flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Coming Soon
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-foreground mb-1 line-clamp-1">
          {program.title}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
          {program.description}
        </p>
        
        <div className="flex items-center justify-between">
          <Button
            variant={program.user_voted ? "default" : "outline"}
            size="sm"
            className="h-8 text-xs gap-1"
            onClick={handleVote}
            disabled={isVoting}
          >
            <ThumbsUp className={`w-3 h-3 ${program.user_voted ? 'fill-current' : ''}`} />
            {program.user_voted ? 'Voted' : 'Vote'}
          </Button>
          
          <span className="text-xs text-muted-foreground">
            {program.votes_count || 0} votes
          </span>
        </div>
      </div>
    </motion.div>
  );
}
