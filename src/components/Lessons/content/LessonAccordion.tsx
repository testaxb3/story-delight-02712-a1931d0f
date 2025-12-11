import { useState } from 'react';
import { LessonAccordionSection } from '@/types/lesson-content';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  data: LessonAccordionSection['data'];
}

export function LessonAccordion({ data }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mb-6">
      {data.title && (
        <h3 className="text-lg font-bold text-foreground mb-4">{data.title}</h3>
      )}
      
      <div className="space-y-2">
        {data.items.map((item, index) => {
          const isOpen = openIndex === index;
          
          return (
            <div
              key={index}
              className="rounded-xl overflow-hidden border border-blue-500/20 bg-blue-500/5"
            >
              {/* Header */}
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <h4 className="font-semibold text-foreground">{item.title}</h4>
                </div>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                </motion.div>
              </button>
              
              {/* Content */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-4 pb-4 pt-0">
                      <div className="pl-10 text-sm text-muted-foreground leading-relaxed">
                        {item.content}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
