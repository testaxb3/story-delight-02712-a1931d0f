import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Program } from '@/hooks/usePrograms';

interface AvailableProgramCardProps {
  program: Program;
  index?: number;
}

// Gradient placeholders for thumbnails
const gradients = [
  'from-purple-400 via-pink-400 to-rose-400',
  'from-blue-400 via-cyan-400 to-teal-400',
  'from-orange-400 via-amber-400 to-yellow-400',
  'from-green-400 via-emerald-400 to-teal-400',
  'from-indigo-400 via-purple-400 to-pink-400',
];

export function AvailableProgramCard({ program, index = 0 }: AvailableProgramCardProps) {
  const navigate = useNavigate();
  const gradient = gradients[index % gradients.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileTap={{ scale: 0.98 }}
      className="flex items-start gap-3 p-3 bg-card rounded-xl border border-border cursor-pointer"
      onClick={() => navigate(`/programs/${program.slug}`)}
    >
      {/* Thumbnail Placeholder */}
      <div className={`w-20 h-20 rounded-lg bg-gradient-to-br ${gradient} flex-shrink-0`} />

      {/* Content */}
      <div className="flex-1 min-w-0 py-0.5">
        {/* Badges */}
        <div className="flex items-center gap-2 mb-1.5">
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
        <h3 className="text-sm font-semibold text-foreground mb-1 line-clamp-1">
          {program.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-muted-foreground line-clamp-2">
          {program.description}{' '}
          <span className="text-orange-600 font-medium inline-flex items-center gap-0.5">
            Read more <ChevronRight className="w-3 h-3" />
          </span>
        </p>
      </div>
    </motion.div>
  );
}
