import { LessonNumberedListSection } from '@/types/lesson-content';
import { cn } from '@/lib/utils';

interface Props {
  data: LessonNumberedListSection['data'];
}

export function LessonNumberedList({ data }: Props) {
  if (data.variant === 'timeline') {
    return (
      <div className="mb-6 px-5">
        {data.title && (
          <h3 className="text-lg font-bold text-[#393939] dark:text-foreground mb-4">
            {data.title}
          </h3>
        )}

        <div className="space-y-3">
          {data.items.map((item) => (
            <div key={item.number} className="relative flex">
              {/* Yellow dot on the line */}
              <div className="absolute -left-[5px] top-5 w-2.5 h-2.5 rounded-full bg-[#FFB800] z-10" />
              
              {/* Left border + Card */}
              <div className="border-l-[3px] border-[#FFB800] ml-1 pl-4 flex-1">
                <div className="bg-[#FFF9F0] dark:bg-amber-900/20 p-4 rounded-xl">
                  <h4 className="font-bold text-[#393939] dark:text-foreground text-[15px] mb-1">
                    {item.title}
                  </h4>
                  {item.description && (
                    <p className="text-[15px] text-[#393939]/80 dark:text-foreground/80 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default / Circled Number style
  return (
    <div className="mb-6 px-5">
      {data.title && (
        <h3 className="text-lg font-bold text-[#393939] dark:text-foreground mb-4">
          {data.title}
        </h3>
      )}
      {data.subtitle && (
        <p className="text-[15px] text-[#393939]/80 dark:text-foreground/80 mb-4">{data.subtitle}</p>
      )}
      
      <div className="space-y-4">
        {data.items.map((item) => (
          <div key={item.number} className="flex gap-3 items-start">
            {/* Yellow circled number */}
            <div className="shrink-0 w-7 h-7 rounded-full bg-[#FFB800] flex items-center justify-center shadow-sm">
              <span className="text-white text-sm font-bold">{item.number}</span>
            </div>
            
            {/* Content */}
            <div className="flex-1 pt-0.5">
              <h4 className="font-bold text-[#393939] dark:text-foreground text-[15px] leading-tight">
                {item.title}
                {item.description && (
                  <span className="font-normal text-[#393939]/80 dark:text-foreground/80">
                    : {item.description}
                  </span>
                )}
              </h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
