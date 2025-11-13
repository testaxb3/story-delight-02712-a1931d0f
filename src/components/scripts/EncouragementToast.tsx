import { toast } from '@/components/ui/use-toast';
import { TrendingUp } from 'lucide-react';

/**
 * Shows an encouraging toast notification when parent reports "progress"
 * This component exports a function rather than a React component
 */
export function showEncouragementToast() {
  toast({
    title: (
      <div className="flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-orange-500 dark:text-orange-400" />
        <span>Keep going! Progress is how scripts work.</span>
      </div>
    ),
    description: "Most scripts take 2-3 tries to click. You're on the right track!",
    duration: 5000,
    className: "bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-orange-500/30 dark:from-yellow-600/20 dark:to-orange-600/20 dark:border-orange-500/50",
  });
}
