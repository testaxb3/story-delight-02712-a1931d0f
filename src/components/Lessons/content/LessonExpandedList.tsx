import { LessonAccordionSection } from '@/types/lesson-content';

interface Props {
  data: LessonAccordionSection['data'];
}

export function LessonExpandedList({ data }: Props) {
  return (
    <div className="mb-6">
      {data.title && (
        <h3 className="text-lg font-bold text-foreground mb-4">{data.title}</h3>
      )}
      
      <div className="space-y-5">
        {data.items.map((item, index) => (
          <div key={index}>
            <h4 className="font-semibold text-foreground mb-1.5">
              {item.title}
            </h4>
            <p className="text-[15px] text-muted-foreground leading-relaxed">
              {item.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
