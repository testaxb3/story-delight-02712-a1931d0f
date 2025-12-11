import { LessonNumberedListSection } from '@/types/lesson-content';

interface Props {
  data: LessonNumberedListSection['data'];
}

export function LessonNumberedList({ data }: Props) {
  return (
    <div className="mb-6">
      {data.title && (
        <h3 className="text-lg font-bold text-[#393939] dark:text-foreground mb-4">
          {data.title}
        </h3>
      )}
      {data.subtitle && (
        <p className="text-[15px] text-[#393939] dark:text-foreground/80 mb-4">{data.subtitle}</p>
      )}
      
      <div className="space-y-4">
        {data.items.map((item) => (
          <div key={item.number} className="flex gap-3">
            {/* Simple number */}
            <span className="text-[15px] font-bold text-[#393939] dark:text-foreground shrink-0">
              {item.number}.
            </span>
            
            {/* Content */}
            <div className="flex-1">
              <span className="font-bold text-[#393939] dark:text-foreground text-[15px]">
                {item.title}
              </span>
              {item.description && (
                <span className="text-[15px] text-[#393939] dark:text-foreground/80">
                  {' '}{item.description}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
