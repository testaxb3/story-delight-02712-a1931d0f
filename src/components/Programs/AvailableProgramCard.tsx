import { motion } from 'framer-motion';
import { ChevronRight, BookOpen, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Program } from '@/hooks/usePrograms';

interface AvailableProgramCardProps {
  program: Program;
  index?: number;
}

// Different gradient combinations for variety
const gradients = [
  'from-blue-400 via-cyan-400 to-teal-500',
  'from-purple-400 via-pink-400 to-rose-500',
  'from-orange-400 via-amber-400 to-yellow-500',
  'from-green-400 via-emerald-400 to-teal-500',
];

export function AvailableProgramCard({ program, index = 0 }: AvailableProgramCardProps) {
  const navigate = useNavigate();
  const gradient = gradients[index % gradients.length];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      whileTap={{ scale: 0.98 }}
      className="relative w-[280px] flex-shrink-0 overflow-hidden rounded-2xl bg-card border border-border shadow-sm"
      onClick={() => navigate(`/programs/${program.slug}`)}
    >
      {/* Gradient Thumbnail Placeholder */}
      <div className="relative h-32 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        
        {/* Badges */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <span className="px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            {program.total_lessons} lessons
          </span>
          {program.age_range && (
            <span className="px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium">
              {program.age_range}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-base font-semibold text-foreground mb-1 line-clamp-1">
          {program.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {program.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>~30 days</span>
          </div>
          <div className="flex items-center gap-1 text-primary text-sm font-medium">
            <span>Start</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
