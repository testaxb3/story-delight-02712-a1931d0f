import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Search, BookOpen, Sparkles, RefreshCw } from 'lucide-react';

type EmptyStateType = 'no-results' | 'no-scripts' | 'no-favorites' | 'error';

interface EmptyStateProps {
  type: EmptyStateType;
  searchQuery?: string;
  onClearSearch?: () => void;
  onRetry?: () => void;
}

const EMPTY_STATES = {
  'no-results': {
    icon: Search,
    title: 'No scripts found',
    description: 'Try adjusting your search or filters',
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-950/20',
  },
  'no-scripts': {
    icon: BookOpen,
    title: 'No scripts available',
    description: 'Scripts will appear here once they are added to your brain type',
    color: 'text-purple-500',
    bg: 'bg-purple-50 dark:bg-purple-950/20',
  },
  'no-favorites': {
    icon: Sparkles,
    title: 'No favorites yet',
    description: 'Save scripts to favorites for quick access',
    color: 'text-yellow-500',
    bg: 'bg-yellow-50 dark:bg-yellow-950/20',
  },
  'error': {
    icon: RefreshCw,
    title: 'Something went wrong',
    description: 'Unable to load scripts. Please try again.',
    color: 'text-red-500',
    bg: 'bg-red-50 dark:bg-red-950/20',
  },
};

export function EmptyState({
  type,
  searchQuery,
  onClearSearch,
  onRetry,
}: EmptyStateProps) {
  const state = EMPTY_STATES[type];
  const Icon = state.icon;

  return (
    <Card className="p-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div
        className={`inline-flex p-6 ${state.bg} rounded-full mb-6 animate-in zoom-in duration-300 delay-100`}
      >
        <Icon className={`w-12 h-12 ${state.color}`} />
      </div>

      <h3 className="text-2xl font-bold mb-3 text-foreground animate-in fade-in slide-in-from-bottom-2 duration-300 delay-200">
        {state.title}
      </h3>

      <p className="text-muted-foreground max-w-md mx-auto mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300 delay-300">
        {type === 'no-results' && searchQuery
          ? `No results for "${searchQuery}"`
          : state.description}
      </p>

      <div className="flex gap-3 justify-center animate-in fade-in slide-in-from-bottom-2 duration-300 delay-400">
        {type === 'no-results' && onClearSearch && (
          <Button onClick={onClearSearch} variant="default" className="gap-2">
            <Search className="w-4 h-4" />
            Clear Search
          </Button>
        )}

        {type === 'error' && onRetry && (
          <Button onClick={onRetry} variant="default" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        )}
      </div>
    </Card>
  );
}
