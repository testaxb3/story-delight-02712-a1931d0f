import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProgramHeroProps {
  title: string;
  description: string | null;
  ageRange: string | null;
  totalLessons: number;
  coverImageUrl?: string | null;
}

export function ProgramHero({ title, description, ageRange, totalLessons, coverImageUrl }: ProgramHeroProps) {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        {coverImageUrl ? (
          <img 
            src={coverImageUrl} 
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-400 via-rose-400 to-purple-500" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 pt-[calc(env(safe-area-inset-top)+12px)] pb-6">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center mb-6 border border-border/50"
          onClick={() => navigate('/programs')}
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </motion.button>

        {/* Title & Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
              {description}
            </p>
          )}
        </motion.div>

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3"
        >
          <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            {totalLessons} lessons
          </span>
          {ageRange && (
            <span className="px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-xs font-medium flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              {ageRange}
            </span>
          )}
        </motion.div>
      </div>
    </div>
  );
}
