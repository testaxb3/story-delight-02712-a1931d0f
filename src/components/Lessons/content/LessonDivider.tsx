import { LessonDividerSection } from '@/types/lesson-content';
import { cn } from '@/lib/utils';

interface Props {
  data?: LessonDividerSection['data'];
}

export function LessonDivider({ data }: Props) {
  const style = data?.style || 'line';

  if (style === 'space') {
    return <div className="h-6" />;
  }

  if (style === 'dots') {
    return (
      <div className="flex items-center justify-center gap-2 my-6">
        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
      </div>
    );
  }

  return <hr className="my-6 border-border/50" />;
}
