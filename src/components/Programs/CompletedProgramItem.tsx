import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProgramWithProgress } from '@/hooks/usePrograms';
import { format } from 'date-fns';

interface CompletedProgramItemProps {
  program: ProgramWithProgress;
  index?: number;
}

// Gradient placeholders for thumbnails
const gradients = [
  'from-green-300 via-emerald-300 to-teal-300',
  'from-blue-300 via-indigo-300 to-purple-300',
  'from-amber-300 via-yellow-300 to-orange-300',
];

export function CompletedProgramItem({ program, index = 0 }: CompletedProgramItemProps) {
  const navigate = useNavigate();
  const gradient = gradients[index % gradients.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border cursor-pointer"
      onClick={() => navigate(`/programs/${program.slug}`)}
    >
      {/* Thumbnail Placeholder */}
      <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${gradient} flex-shrink-0`} />

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Badges */}
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 text-xs font-medium">
            {program.total_lessons} Lessons
          </span>
          {program.age_range && (
            <span className="px-2 py-0.5 rounded-full border border-border text-muted-foreground text-xs">
              {program.age_range}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-foreground line-clamp-1">
          {program.title}
        </h3>

        {/* Completion date */}
        <p className="text-xs text-muted-foreground mt-0.5">
          Completed on {program.completed_at ? format(new Date(program.completed_at), 'MMMM d, yyyy') : 'N/A'}
        </p>
      </div>

      {/* Arrow */}
      <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
    </motion.div>
  );
}
