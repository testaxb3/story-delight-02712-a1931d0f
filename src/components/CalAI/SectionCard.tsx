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
        "bg-card rounded-[24px] shadow-sm border-0",
        className
      )}
      onClick={onClick}
    >
      {children}
    </Card>
  );
}
