import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp } from 'lucide-react';
import logo from '@/assets/logo.svg';

interface ScriptsHeaderProps {
  totalScripts: number;
  usedToday: number;
  brainType: string;
  loading: boolean;
  onShowStats?: () => void;
}

const getBrainTypeBadgeColor = (brainType: string) => {
  switch (brainType) {
    case 'INTENSE':
      return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20';
    case 'DISTRACTED':
      return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20';
    case 'DEFIANT':
      return 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

export function ScriptsHeader({
  totalScripts,
  usedToday,
  brainType,
  loading,
  onShowStats,
}: ScriptsHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <img src={logo} alt="NEP" className="h-16 w-auto mb-3" />
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="secondary"
            className="text-sm px-3 py-1 animate-in fade-in slide-in-from-left-2 duration-300"
          >
            {loading ? (
              <>
                <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Loading...
              </>
            ) : (
              `📚 ${totalScripts} Scripts`
            )}
          </Badge>
          <Badge
            variant="outline"
            className="text-sm px-3 py-1 border-green-500/30 text-green-700 dark:text-green-400 bg-green-500/5 animate-in fade-in slide-in-from-left-3 duration-300 delay-75"
          >
            ✅ {usedToday} Used Today
          </Badge>
          <Badge
            className={`text-sm px-3 py-1 animate-in fade-in slide-in-from-left-4 duration-300 delay-150 ${getBrainTypeBadgeColor(brainType)}`}
          >
            🧠 {brainType} Brain
          </Badge>
        </div>
      </div>

      {onShowStats && (
        <Button
          variant="outline"
          onClick={onShowStats}
          className="gap-2 animate-in fade-in slide-in-from-right duration-300"
        >
          <BarChart3 className="w-4 h-4" />
          <span className="hidden sm:inline">View Stats</span>
        </Button>
      )}
    </div>
  );
}
