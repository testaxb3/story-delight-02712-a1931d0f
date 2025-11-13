import { BookOpen } from "lucide-react";

interface ProgressBarProps {
  current: number;
  total: number;
  percentage: number;
}

export const ProgressBar = ({ current, total, percentage }: ProgressBarProps) => {
  return (
    <div className="space-y-3 p-6 rounded-2xl bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border border-primary/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-muted-foreground">
          <BookOpen className="w-5 h-5 text-primary" />
          <span className="text-sm font-semibold font-body tracking-wide">Progresso de Leitura</span>
        </div>
        <span className="text-3xl font-display font-bold gradient-text">{percentage}%</span>
      </div>
      
      <div className="relative">
        <div className="h-3 bg-gradient-to-r from-muted via-muted to-muted rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-primary via-primary to-accent smooth-transition rounded-full shadow-lg shadow-primary/20 relative overflow-hidden"
            style={{ width: `${percentage}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm font-body">
        <span className="text-muted-foreground font-semibold">
          Capítulo {current} de {total}
        </span>
        <span className="text-muted-foreground">{total - current} restantes</span>
      </div>
    </div>
  );
};
