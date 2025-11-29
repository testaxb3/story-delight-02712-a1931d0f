import { motion } from 'framer-motion';
import { BookOpen, Clock, Layers, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EbookCoverPageProps {
  title: string;
  subtitle?: string;
  readingTime?: string;
  chapterCount: number;
  coverColor?: string;
  onStartReading: () => void;
}

export function EbookCoverPage({
  title,
  subtitle,
  readingTime,
  chapterCount,
  coverColor = '#6366f1',
  onStartReading
}: EbookCoverPageProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section with gradient */}
      <div 
        className="relative flex-1 flex flex-col items-center justify-center px-6 py-12"
        style={{
          background: `linear-gradient(180deg, ${coverColor}15 0%, transparent 50%)`
        }}
      >
        {/* Decorative circles */}
        <div 
          className="absolute top-20 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: coverColor }}
        />
        
        {/* Book icon with animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative mb-8"
        >
          <div 
            className="w-28 h-28 rounded-3xl flex items-center justify-center shadow-2xl"
            style={{ 
              backgroundColor: coverColor,
              boxShadow: `0 20px 60px ${coverColor}40`
            }}
          >
            <BookOpen className="w-14 h-14 text-white" strokeWidth={1.5} />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl md:text-4xl font-bold text-foreground text-center max-w-md leading-tight"
        >
          {title}
        </motion.h1>

        {/* Subtitle */}
        {subtitle && (
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-muted-foreground text-center max-w-sm mt-4 leading-relaxed"
          >
            {subtitle}
          </motion.p>
        )}

        {/* Stats */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center gap-6 mt-8"
        >
          <div className="flex items-center gap-2 text-muted-foreground">
            <Layers className="w-5 h-5" />
            <span className="text-sm font-medium">{chapterCount} chapters</span>
          </div>
          {readingTime && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-5 h-5" />
              <span className="text-sm font-medium">{readingTime} read</span>
            </div>
          )}
        </motion.div>
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="p-6 pb-safe"
      >
        <Button
          onClick={onStartReading}
          size="lg"
          className="w-full h-14 text-lg font-semibold rounded-2xl gap-2"
          style={{ 
            backgroundColor: coverColor,
            color: 'white'
          }}
        >
          Begin Reading
          <ChevronRight className="w-5 h-5" />
        </Button>
        
        <p className="text-center text-xs text-muted-foreground mt-4">
          Your progress is saved automatically
        </p>
      </motion.div>
    </div>
  );
}
