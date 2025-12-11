import { LessonCalloutSection } from '@/types/lesson-content';
import { AlertCircle, Lightbulb, CheckCircle2, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  data: LessonCalloutSection['data'];
}

const variants = {
  info: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    icon: AlertCircle,
    iconColor: 'text-blue-500',
    titleColor: 'text-blue-600 dark:text-blue-400',
  },
  warning: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    icon: AlertTriangle,
    iconColor: 'text-amber-500',
    titleColor: 'text-amber-600 dark:text-amber-400',
  },
  success: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    icon: CheckCircle2,
    iconColor: 'text-emerald-500',
    titleColor: 'text-emerald-600 dark:text-emerald-400',
  },
  tip: {
    bg: 'bg-primary/10',
    border: 'border-primary/30',
    icon: Lightbulb,
    iconColor: 'text-primary',
    titleColor: 'text-primary',
  },
};

export function LessonCallout({ data }: Props) {
  const style = variants[data.variant];
  const Icon = style.icon;

  return (
    <div className={cn(
      'mb-6 p-4 rounded-xl border',
      style.bg,
      style.border
    )}>
      <div className="flex gap-3">
        <Icon className={cn('w-5 h-5 shrink-0 mt-0.5', style.iconColor)} />
        <div>
          {data.title && (
            <h4 className={cn('font-semibold mb-1', style.titleColor)}>
              {data.title}
            </h4>
          )}
          <p className="text-sm text-foreground/80 leading-relaxed">
            {data.content}
          </p>
        </div>
      </div>
    </div>
  );
}
