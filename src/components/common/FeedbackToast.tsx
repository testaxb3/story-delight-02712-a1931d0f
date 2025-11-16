import { toast } from 'sonner';
import { CheckCircle2, XCircle, AlertTriangle, Info, Loader2 } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';

interface FeedbackToastOptions {
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const icons = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
  loading: Loader2,
};

export const showToast = {
  success: (options: FeedbackToastOptions) => {
    const Icon = icons.success;
    toast.success(options.title, {
      description: options.description,
      duration: options.duration || 4000,
      icon: <Icon className="h-5 w-5" />,
      action: options.action ? {
        label: options.action.label,
        onClick: options.action.onClick,
      } : undefined,
    });
  },

  error: (options: FeedbackToastOptions) => {
    const Icon = icons.error;
    toast.error(options.title, {
      description: options.description,
      duration: options.duration || 5000,
      icon: <Icon className="h-5 w-5" />,
      action: options.action ? {
        label: options.action.label,
        onClick: options.action.onClick,
      } : undefined,
    });
  },

  warning: (options: FeedbackToastOptions) => {
    const Icon = icons.warning;
    toast.warning(options.title, {
      description: options.description,
      duration: options.duration || 4000,
      icon: <Icon className="h-5 w-5" />,
      action: options.action ? {
        label: options.action.label,
        onClick: options.action.onClick,
      } : undefined,
    });
  },

  info: (options: FeedbackToastOptions) => {
    const Icon = icons.info;
    toast.info(options.title, {
      description: options.description,
      duration: options.duration || 4000,
      icon: <Icon className="h-5 w-5" />,
      action: options.action ? {
        label: options.action.label,
        onClick: options.action.onClick,
      } : undefined,
    });
  },

  loading: (options: FeedbackToastOptions) => {
    const Icon = icons.loading;
    return toast.loading(options.title, {
      description: options.description,
      icon: <Icon className="h-5 w-5 animate-spin" />,
    });
  },

  promise: <T,>(
    promise: Promise<T>,
    options: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) => {
    return toast.promise(promise, {
      loading: options.loading,
      success: options.success,
      error: options.error,
    });
  },
};
