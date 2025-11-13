import { Toaster } from 'sonner';

export const ToastProvider = () => {
  return (
    <Toaster
      position="bottom-right"
      richColors
      closeButton
      expand
      visibleToasts={3}
      theme="dark"
      toastOptions={{
        classNames: {
          toast: 'rounded-lg border border-border/50 shadow-lg',
          title: 'font-semibold text-sm',
          description: 'text-xs text-muted-foreground mt-1',
          actionButton: 'bg-primary text-primary-foreground hover:bg-primary/90',
          cancelButton: 'bg-muted text-muted-foreground hover:bg-muted/80',
          closeButton: 'text-muted-foreground hover:text-foreground',
        },
      }}
    />
  );
};

