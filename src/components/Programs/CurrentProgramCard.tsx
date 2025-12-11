import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProgramWithProgress } from '@/hooks/usePrograms';
import { Button } from '@/components/ui/button';

interface CurrentProgramCardProps {
  program: ProgramWithProgress;
  nextLessonTitle?: string;
}

// Gradient placeholders for program illustrations
const gradients = [
  'from-orange-300 via-rose-300 to-pink-300',
  'from-blue-300 via-purple-300 to-pink-300',
  'from-teal-300 via-cyan-300 to-blue-300',
  'from-yellow-300 via-orange-300 to-red-300',
];

export function CurrentProgramCard({ program, nextLessonTitle }: CurrentProgramCardProps) {
  const navigate = useNavigate();
  const nextLesson = program.lessons_completed.length + 1;
  const gradientIndex = program.title.length % gradients.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl border border-border overflow-hidden"
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">{program.title}</span>
          <span className="text-sm text-muted-foreground">
            {program.lessons_completed.length} of {program.total_lessons}
          </span>
        </div>
      </div>

      {/* Lesson Title */}
      <div className="px-4 py-3 border-b border-border">
        <p className="text-sm text-muted-foreground">
          Lesson {nextLesson}: <span className="font-semibold text-foreground">{nextLessonTitle || 'Continue Learning'}</span>
        </p>
      </div>

      {/* Illustration Placeholder */}
      <div className="relative mx-4 my-4 h-40 rounded-xl overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradients[gradientIndex]}`} />
        
        {/* Heart button overlay */}
        <button 
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <Heart className="w-4 h-4 text-muted-foreground" />
        </button>

        {/* Decorative elements for placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-white/30" />
        </div>
      </div>

      {/* Description */}
      <div className="px-4 pb-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {program.description || 'Continue your parenting journey with this program.'}
        </p>
      </div>

      {/* CTA Button */}
      <div className="px-4 pb-4">
        <Button 
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium"
          onClick={() => navigate(`/programs/${program.slug}`)}
        >
          Continue Learning
        </Button>
      </div>
    </motion.div>
  );
}
