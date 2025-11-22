import { LucideIcon } from 'lucide-react';
import { SectionCard } from './SectionCard';
import { cn } from '@/lib/utils';

interface StatWidgetProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  gradient?: string;
  onClick?: () => void;
}

export function StatWidget({
  icon: Icon,
  value,
  label,
  gradient,
  onClick,
}: StatWidgetProps) {
  return (
    <SectionCard 
      className={cn(
        "cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md",
        onClick && "active:scale-[0.98]"
      )}
      onClick={onClick}
    >
      <div className="flex flex-col items-center justify-center text-center p-2">
        <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-3">
          <Icon className="w-6 h-6 text-foreground" />
        </div>
        <p className="text-3xl font-bold text-foreground mb-1">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </SectionCard>
  );
}
