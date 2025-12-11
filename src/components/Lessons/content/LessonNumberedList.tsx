import { LessonNumberedListSection } from '@/types/lesson-content';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Props {
  data: LessonNumberedListSection['data'];
}

const colorSchemes = {
  blue: {
    bg: 'bg-blue-500',
    light: 'bg-blue-500/10',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-500/20',
  },
  orange: {
    bg: 'bg-orange-500',
    light: 'bg-orange-500/10',
    text: 'text-orange-600 dark:text-orange-400',
    border: 'border-orange-500/20',
  },
  green: {
    bg: 'bg-emerald-500',
    light: 'bg-emerald-500/10',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-500/20',
  },
  purple: {
    bg: 'bg-purple-500',
    light: 'bg-purple-500/10',
    text: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-500/20',
  },
};

export function LessonNumberedList({ data }: Props) {
  const scheme = colorSchemes[data.colorScheme || 'blue'];

  return (
    <div className="mb-6">
      {data.title && (
        <h3 className={cn('text-lg font-bold mb-1', scheme.text)}>
          {data.title}
        </h3>
      )}
      {data.subtitle && (
        <p className="text-sm text-muted-foreground mb-4">{data.subtitle}</p>
      )}
      
      <div className="space-y-3">
        {data.items.map((item, index) => (
          <motion.div
            key={item.number}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
              'flex gap-4 p-4 rounded-xl border',
              scheme.light,
              scheme.border
            )}
          >
            {/* Number Circle */}
            <div className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-sm',
              scheme.bg
            )}>
              {item.number}
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-foreground">{item.title}</h4>
              {item.description && (
                <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
