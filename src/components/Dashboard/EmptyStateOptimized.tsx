import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GradientText } from '@/components/common/GradientText';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  emoji?: string;
}

export const EmptyStateOptimized = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  emoji
}: EmptyStateProps) => {
  return (
    <div className="card-glass p-12 rounded-2xl text-center animate-scale-in">
      {/* Animated Icon/Emoji */}
      <div className="mb-6 inline-block animate-bounce">
        {emoji ? (
          <span className="text-6xl drop-shadow-lg">{emoji}</span>
        ) : (
          <div className="p-6 rounded-full bg-gradient-primary/10 inline-block hover-lift-strong">
            <Icon className="w-12 h-12 text-primary" />
          </div>
        )}
      </div>

      {/* Title */}
      <GradientText as="h3" className="text-2xl mb-3">
        {title}
      </GradientText>

      {/* Description */}
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        {description}
      </p>

      {/* Action Button */}
      {actionLabel && onAction && (
        <div className="animate-fade-in">
          <Button
            onClick={onAction}
            className="gradient-primary hover-glow-intense"
            size="lg"
          >
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
