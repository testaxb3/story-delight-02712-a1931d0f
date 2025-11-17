import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnimatedMetricCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  gradient: string;
  delay?: number;
  onClick?: () => void;
  subtitle?: string;
}

export const AnimatedMetricCardOptimized = ({
  icon: Icon,
  value,
  label,
  gradient,
  delay = 0,
  onClick,
  subtitle
}: AnimatedMetricCardProps) => {
  return (
    <div
      className={cn(
        "card-elevated p-4 rounded-xl cursor-pointer group relative overflow-hidden hover-lift transition-all duration-300 animate-fade-in",
        onClick && "hover:shadow-glow"
      )}
      style={{ animationDelay: `${delay * 1000}ms` }}
      onClick={onClick}
    >
      {/* Animated gradient background on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(circle at center, hsl(var(--primary)) 0%, transparent 70%)'
        }}
      />

      <div className="flex items-center gap-3 relative z-10">
        {/* Icon */}
        <div className={`p-2 rounded-lg ${gradient} transition-transform duration-300 group-hover:rotate-12`}>
          <Icon className="w-5 h-5 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="text-2xl font-black animate-scale-in">
            {value}
          </div>
          <div className="text-xs text-muted-foreground">{label}</div>
          {subtitle && (
            <div className="text-xs text-primary mt-1 animate-fade-in">
              {subtitle}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
