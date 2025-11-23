import { motion } from 'framer-motion';
import { ImprovedSkeleton } from '@/components/common/ImprovedSkeleton';

interface QuizSkeletonLoaderProps {
  variant?: 'question' | 'form' | 'results';
}

export const QuizSkeletonLoader = ({ variant = 'question' }: QuizSkeletonLoaderProps) => {
  if (variant === 'question') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-8 px-6"
      >
        {/* Question title skeleton */}
        <div className="space-y-3">
          <ImprovedSkeleton className="h-8 w-3/4 mx-auto" />
          <ImprovedSkeleton className="h-4 w-1/2 mx-auto" />
        </div>

        {/* Options skeleton */}
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <ImprovedSkeleton 
              key={i} 
              className="h-20 w-full rounded-2xl"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </motion.div>
    );
  }

  if (variant === 'form') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6 px-6"
      >
        <div className="space-y-3">
          <ImprovedSkeleton className="h-10 w-2/3 mx-auto" />
          <ImprovedSkeleton className="h-5 w-1/2 mx-auto" />
        </div>
        
        <div className="space-y-4 max-w-md mx-auto">
          <ImprovedSkeleton className="h-12 w-full rounded-xl" />
          <ImprovedSkeleton className="h-32 w-full rounded-xl" />
        </div>
      </motion.div>
    );
  }

  // Results variant
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 px-6"
    >
      <ImprovedSkeleton variant="avatar" className="w-32 h-32 mx-auto" />
      
      <div className="space-y-3">
        <ImprovedSkeleton className="h-12 w-3/4 mx-auto" />
        <ImprovedSkeleton className="h-6 w-1/2 mx-auto" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <ImprovedSkeleton 
            key={i}
            variant="card"
            className="h-40"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    </motion.div>
  );
};