import { LessonVisualDiagramSection } from '@/types/lesson-content';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Props {
  data: LessonVisualDiagramSection['data'];
}

const positionStyles: Record<string, string> = {
  'top-left': 'top-0 left-0',
  'top-right': 'top-0 right-0',
  'bottom-left': 'bottom-0 left-0',
  'bottom-right': 'bottom-0 right-0',
  'left': 'left-0 top-1/2 -translate-y-1/2',
  'right': 'right-0 top-1/2 -translate-y-1/2',
};

export function LessonVisualDiagram({ data }: Props) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-bold text-foreground mb-4">{data.title}</h3>
      
      <div className="relative bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-2xl p-8 min-h-[320px]">
        {/* Center Image */}
        {data.centerImage && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32">
            <img 
              src={data.centerImage} 
              alt="Diagram center"
              className="w-full h-full object-contain rounded-xl"
            />
          </div>
        )}
        
        {/* Labels positioned around */}
        {data.labels.map((label, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              'absolute max-w-[140px]',
              positionStyles[label.position]
            )}
          >
            <div className="flex items-start gap-2">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0">
                {label.number}
              </span>
              <p className="text-sm text-foreground/80 leading-tight">{label.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
