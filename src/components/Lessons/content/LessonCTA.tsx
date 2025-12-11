import { LessonCTASection } from '@/types/lesson-content';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  data: LessonCTASection['data'];
  onAction?: (action: string) => void;
}

export function LessonCTA({ data, onAction }: Props) {
  const icons = {
    next: ArrowRight,
    diary: BookOpen,
    close: X,
  };
  
  const Icon = icons[data.buttonAction || 'next'];

  return (
    <motion.div 
      className="mb-6 p-6 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-2xl border border-primary/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="text-lg font-bold text-foreground mb-2">{data.text}</h3>
      {data.description && (
        <p className="text-sm text-muted-foreground mb-4">{data.description}</p>
      )}
      <Button
        onClick={() => onAction?.(data.buttonAction || 'next')}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-12 font-semibold"
      >
        {data.buttonText}
        <Icon className="w-4 h-4 ml-2" />
      </Button>
    </motion.div>
  );
}
