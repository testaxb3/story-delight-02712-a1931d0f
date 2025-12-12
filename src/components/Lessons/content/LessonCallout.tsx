import { LessonCalloutSection } from '@/types/lesson-content';
import { cn } from '@/lib/utils';

interface Props {
  data: LessonCalloutSection['data'];
}

const variants = {
  info: {
    borderColor: 'border-blue-500',
    dotColor: 'bg-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    titleColor: 'text-blue-600 dark:text-blue-400',
  },
  warning: {
    borderColor: 'border-[#FFB800]',
    dotColor: 'bg-[#FFB800]',
    bgColor: 'bg-[#FFF9F0] dark:bg-amber-900/20',
    titleColor: 'text-[#D4A800] dark:text-amber-400',
  },
  success: {
    borderColor: 'border-emerald-500',
    dotColor: 'bg-emerald-500',
    bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
    titleColor: 'text-emerald-600 dark:text-emerald-400',
  },
  tip: {
    borderColor: 'border-[#FFB800]',
    dotColor: 'bg-[#FFB800]',
    bgColor: 'bg-[#FFF9F0] dark:bg-amber-900/20',
    titleColor: 'text-[#D4A800] dark:text-amber-400',
  },
};

export function LessonCallout({ data }: Props) {
  const variant = data.variant && variants[data.variant] ? data.variant : 'tip';
  const style = variants[variant];

  return (
    <div className="mb-6 px-5">
      <div className="relative flex">
        {/* Yellow dot on the line */}
        <div className={cn(
          "absolute -left-[5px] top-6 w-2.5 h-2.5 rounded-full z-10",
          style.dotColor
        )} />
        
        {/* Left border + Card */}
        <div className={cn("border-l-[3px] ml-1 pl-4 flex-1", style.borderColor)}>
          <div className={cn("p-4 rounded-xl", style.bgColor)}>
            {data.title && (
              <h4 className={cn("font-bold text-[15px] mb-1", style.titleColor)}>
                {data.title}
              </h4>
            )}
            <p className="text-[15px] text-[#393939] dark:text-foreground/90 leading-relaxed">
              {data.content}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
