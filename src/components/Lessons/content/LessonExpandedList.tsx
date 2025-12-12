import { LessonAccordionSection } from '@/types/lesson-content';

interface Props {
  data: LessonAccordionSection['data'];
}

export function LessonExpandedList({ data }: Props) {
  return (
    <div className="mb-6">
      {data.title && (
        <h3 className="text-lg font-bold text-[#393939] dark:text-foreground mb-4">{data.title}</h3>
      )}
      
      <div className="space-y-3">
        {data.items.map((item, index) => (
          <div key={index} className="relative flex">
            {/* Yellow dot on the line */}
            <div className="absolute -left-[5px] top-5 w-2.5 h-2.5 rounded-full bg-[#FFB800] z-10" />
            
            {/* Left border + Card */}
            <div className="border-l-[3px] border-[#FFB800] ml-1 pl-4 flex-1">
              <div className="bg-[#FFF9F0] dark:bg-amber-900/20 p-4 rounded-xl">
                <h4 className="font-bold text-[#393939] dark:text-foreground text-[15px] mb-1">
                  {item.title}
                </h4>
                <p className="text-[15px] text-[#393939]/80 dark:text-foreground/80 leading-relaxed">
                  {item.content}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
