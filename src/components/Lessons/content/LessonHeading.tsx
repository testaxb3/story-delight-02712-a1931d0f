import { LessonHeadingSection } from '@/types/lesson-content';
import { cn } from '@/lib/utils';

interface Props {
  data: LessonHeadingSection['data'];
}

export function LessonHeading({ data }: Props) {
  const levels = {
    2: 'text-xl font-bold mb-3',
    3: 'text-lg font-bold mb-2',
  };

  const HeadingTag = `h${data.level || 2}` as 'h2' | 'h3';

  return (
    <HeadingTag className={cn('text-[#393939] dark:text-foreground', levels[data.level || 2])}>
      {data.text}
    </HeadingTag>
  );
}
