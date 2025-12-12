import { LessonTextSection } from '@/types/lesson-content';
import { cn } from '@/lib/utils';

interface Props {
  data: LessonTextSection['data'];
}

export function LessonText({ data }: Props) {
  const variants = {
    default: 'text-[#393939] dark:text-foreground/90',
    lead: 'text-[#393939] dark:text-foreground/90 font-medium',
    highlight: 'text-[#393939] dark:text-foreground/90',
  };

  return (
    <p className={cn('mb-4 px-5 text-[15px] leading-[1.7]', variants[data.variant || 'default'])}>
      {data.content}
    </p>
  );
}
