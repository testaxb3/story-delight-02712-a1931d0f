import { Link } from 'react-router-dom';
import { BookOpen, Video, Target, Gift } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface QuickAccessItem {
  icon: typeof BookOpen;
  label: string;
  count: string;
  path: string;
  gradient: string;
  isRecommended?: boolean;
  isNew?: boolean;
}

interface QuickAccessGridProps {
  scriptsCount: number;
  videosCount: number;
  brainProfile?: string | null;
}

export function QuickAccessGrid({ scriptsCount, videosCount, brainProfile }: QuickAccessGridProps) {
  const quickAccessItems: QuickAccessItem[] = [
    {
      icon: BookOpen,
      label: 'NEP Scripts',
      count: scriptsCount ? `${scriptsCount} items` : '',
      path: '/scripts',
      gradient: 'bg-gradient-primary',
      isRecommended: brainProfile === 'INTENSE',
      isNew: false,
    },
    {
      icon: Video,
      label: 'Video Lessons',
      count: videosCount ? `${videosCount} videos` : '',
      path: '/videos',
      gradient: 'bg-gradient-accent',
      isRecommended: false,
      isNew: true,
    },
    {
      icon: Target,
      label: 'Progress Tracker',
      count: '',
      path: '/tracker',
      gradient: 'bg-gradient-warning',
      isRecommended: false,
      isNew: false,
    },
    {
      icon: Gift,
      label: 'Bonuses',
      count: '',
      path: '/bonuses',
      gradient: 'bg-sky-500',
      isRecommended: false,
      isNew: false,
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">✨</span>
        <h2 className="text-lg sm:text-xl font-bold text-foreground">Quick Access</h2>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {quickAccessItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={cn(
              'group relative rounded-2xl p-3 sm:p-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-glass shadow-lg transition-transform transition-shadow hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:border-slate-700',
              item.isNew
                ? 'border-2 border-warning shadow-warning/20 animate-pulse'
                : item.isRecommended
                  ? 'border-2 border-success shadow-success/20'
                  : 'border border-transparent dark:border-slate-700',
            )}
            aria-label={`Access ${item.label}`}
          >
            {item.isRecommended && (
              <Badge className="absolute top-2 right-2 bg-success text-white border-none text-xs shadow-lg">
                RECOMMENDED
              </Badge>
            )}
            {item.isNew && (
              <Badge className="absolute top-2 right-2 bg-warning text-white border-none text-xs shadow-lg">
                NEW
              </Badge>
            )}
            <div
              className={cn(
                'mb-2 sm:mb-3 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl',
                item.gradient,
                item.isRecommended && 'shadow-lg shadow-success/50',
                item.isNew && 'shadow-lg shadow-warning/50',
              )}
            >
              <item.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" aria-hidden="true" />
            </div>
            <h3 className="mb-1 font-semibold text-sm sm:text-base text-foreground">{item.label}</h3>
            {item.count && <p className="text-xs text-muted-foreground">{item.count}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
}
