import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnhancedToastProps {
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;
}

const toastConfig = {
  success: {
    icon: CheckCircle2,
    bgColor: 'bg-success/10 dark:bg-success/20',
    borderColor: 'border-success/30',
    textColor: 'text-success-foreground',
    iconColor: 'text-success',
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-destructive/10 dark:bg-destructive/20',
    borderColor: 'border-destructive/30',
    textColor: 'text-destructive-foreground',
    iconColor: 'text-destructive',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-warning/10 dark:bg-warning/20',
    borderColor: 'border-warning/30',
    textColor: 'text-warning-foreground',
    iconColor: 'text-warning',
  },
  info: {
    icon: Info,
    bgColor: 'bg-primary/10 dark:bg-primary/20',
    borderColor: 'border-primary/30',
    textColor: 'text-primary-foreground',
    iconColor: 'text-primary',
  },
};

export function EnhancedToast({
  type,
  title,
  description,
  action,
  onClose,
}: EnhancedToastProps) {
  const config = toastConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-xl border-2 shadow-xl backdrop-blur-sm animate-in slide-in-from-top-2 duration-300',
        config.bgColor,
        config.borderColor
      )}
    >
      <div className={cn('mt-0.5 flex-shrink-0', config.iconColor)}>
        <Icon className="w-5 h-5" />
      </div>
      
      <div className="flex-1 space-y-1">
        <h4 className="font-semibold text-sm text-foreground">{title}</h4>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        
        {action && (
          <button
            onClick={action.onClick}
            className={cn(
              'text-xs font-semibold underline underline-offset-2 hover:no-underline mt-2',
              config.iconColor
            )}
          >
            {action.label}
          </button>
        )}
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-muted/50 touch-target"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
