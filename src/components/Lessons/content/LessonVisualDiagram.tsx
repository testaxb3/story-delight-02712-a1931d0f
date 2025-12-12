import { LessonVisualDiagramSection } from '@/types/lesson-content';
import { motion } from 'framer-motion';

interface Props {
  data: LessonVisualDiagramSection['data'];
}

export function LessonVisualDiagram({ data }: Props) {
  return (
    <div className="mb-8 px-5">
      <h3 className="text-lg font-bold text-[#393939] dark:text-foreground mb-4">
        {data.title}
      </h3>
      
      {/* Grid layout for labels */}
      <div className="grid gap-3">
        {data.labels.map((label, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-primary/5 to-transparent border border-primary/10"
          >
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
              {label.number}
            </span>
            <p className="text-sm text-[#393939] dark:text-foreground/90 leading-relaxed pt-0.5">
              {label.text}
            </p>
          </motion.div>
        ))}
      </div>
      
      {/* Center image if provided */}
      {data.centerImage && (
        <div className="mt-4 flex justify-center">
          <img 
            src={data.centerImage} 
            alt="Diagram"
            className="max-w-[200px] h-auto rounded-xl"
          />
        </div>
      )}
    </div>
  );
}
