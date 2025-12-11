import { motion } from 'framer-motion';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProgramWithProgress } from '@/hooks/usePrograms';
import { format } from 'date-fns';

interface CompletedProgramItemProps {
  program: ProgramWithProgress;
  index?: number;
}

export function CompletedProgramItem({ program, index = 0 }: CompletedProgramItemProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border"
      onClick={() => navigate(`/programs/${program.slug}`)}
    >
      {/* Check Icon */}
      <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
        <CheckCircle2 className="w-5 h-5 text-green-500" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-foreground truncate">
          {program.title}
        </h3>
        <p className="text-xs text-muted-foreground">
          Completed {program.completed_at ? format(new Date(program.completed_at), 'MMM d, yyyy') : 'recently'}
        </p>
      </div>

      {/* Arrow */}
      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
    </motion.div>
  );
}
