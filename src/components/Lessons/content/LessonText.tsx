import { LessonTextSection } from '@/types/lesson-content';
import { cn } from '@/lib/utils';

interface Props {
  data: LessonTextSection['data'];
}

export function LessonText({ data }: Props) {
  const variants = {
    default: 'text-muted-foreground leading-relaxed',
    lead: 'text-lg text-foreground/90 leading-relaxed font-medium',
    highlight: 'text-foreground bg-primary/5 p-4 rounded-xl border-l-4 border-primary',
  };

  return (
    <p className={cn('mb-4', variants[data.variant || 'default'])}>
      {data.content}
    </p>
  );
}
