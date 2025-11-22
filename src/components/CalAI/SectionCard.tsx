import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SectionCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function SectionCard({ children, className, onClick }: SectionCardProps) {
  return (
    <Card 
      className={cn(
        "bg-white dark:bg-calai-900 rounded-2xl p-4 shadow-sm border border-border/50",
        className
      )}
      onClick={onClick}
    >
      {children}
    </Card>
  );
}
