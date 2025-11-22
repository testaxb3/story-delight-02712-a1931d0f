import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FABButtonProps {
  onClick?: () => void;
  className?: string;
}

export function FABButton({ onClick, className }: FABButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed right-5 z-50",
        "w-14 h-14 rounded-full",
        "bg-accent hover:bg-accent/90",
        "flex items-center justify-center",
        "shadow-xl shadow-accent/20",
        "transition-all duration-300",
        "active:scale-95",
        "hover:shadow-2xl hover:shadow-accent/30",
        className
      )}
      style={{ bottom: `calc(env(safe-area-inset-bottom, 0px) + 7.5rem)` }}
    >
      <Plus className="w-7 h-7 text-white" strokeWidth={2.5} />
    </button>
  );
}
