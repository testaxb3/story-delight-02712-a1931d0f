import { LessonReflectionFormSection } from '@/types/lesson-content';
import { motion } from 'framer-motion';

interface Props {
  data: LessonReflectionFormSection['data'];
}

export function LessonReflectionForm({ data }: Props) {
  return (
    <div className="mb-6">
      {data.title && (
        <h3 className="text-lg font-bold text-foreground mb-2">{data.title}</h3>
      )}
      {data.description && (
        <p className="text-sm text-muted-foreground mb-4">{data.description}</p>
      )}
      
      {/* Timeline-style fields */}
      <div className="relative pl-6 border-l-2 border-amber-400/50 space-y-4">
        {data.fields.map((field, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08 }}
            className="relative"
          >
            {/* Timeline dot */}
            <div className="absolute -left-[25px] top-2 w-3 h-3 rounded-full bg-amber-400" />
            
            {/* Field card */}
            <div className="bg-amber-500/5 dark:bg-amber-500/10 border border-amber-400/20 rounded-xl p-4">
              <h4 className="font-semibold text-amber-600 dark:text-amber-400 mb-1">
                {field.label}
              </h4>
              {field.description && (
                <p className="text-sm text-muted-foreground">{field.description}</p>
              )}
              {field.placeholder && (
                <div className="mt-2 p-3 bg-background/50 rounded-lg border border-border/50">
                  <p className="text-sm text-muted-foreground/60 italic">{field.placeholder}</p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
