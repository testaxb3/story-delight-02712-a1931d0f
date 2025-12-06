import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  X,
  Bell,
  Upload,
  RefreshCw,
  FileText,
  Wand2,
  Gift
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHaptic } from '@/hooks/useHaptic';

interface QuickAction {
  id: string;
  label: string;
  icon: typeof Plus;
  color: string;
  onClick: () => void;
}

interface AdminQuickActionsProps {
  onSendNotification?: () => void;
  onUploadScripts?: () => void;
  onRefresh?: () => void;
  onCreateBonus?: () => void;
}

export function AdminQuickActions({
  onSendNotification,
  onUploadScripts,
  onRefresh,
  onCreateBonus,
}: AdminQuickActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { triggerHaptic } = useHaptic();

  const actions: QuickAction[] = [
    {
      id: 'refresh',
      label: 'Refresh Data',
      icon: RefreshCw,
      color: 'bg-blue-500',
      onClick: () => {
        onRefresh?.();
        setIsOpen(false);
      },
    },
    {
      id: 'notification',
      label: 'Send Push',
      icon: Bell,
      color: 'bg-purple-500',
      onClick: () => {
        onSendNotification?.();
        setIsOpen(false);
      },
    },
    {
      id: 'upload',
      label: 'Upload CSV',
      icon: Upload,
      color: 'bg-green-500',
      onClick: () => {
        onUploadScripts?.();
        setIsOpen(false);
      },
    },
    {
      id: 'bonus',
      label: 'Add Bonus',
      icon: Gift,
      color: 'bg-orange-500',
      onClick: () => {
        onCreateBonus?.();
        setIsOpen(false);
      },
    },
  ].filter(action => {
    // Only show actions that have handlers
    if (action.id === 'refresh') return !!onRefresh;
    if (action.id === 'notification') return !!onSendNotification;
    if (action.id === 'upload') return !!onUploadScripts;
    if (action.id === 'bonus') return !!onCreateBonus;
    return true;
  });

  const toggleMenu = () => {
    triggerHaptic('medium');
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed right-4 z-50" style={{ bottom: 'calc(env(safe-area-inset-bottom) + 80px)' }}>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Action Items */}
      <AnimatePresence>
        {isOpen && (
          <div className="absolute bottom-16 right-0 flex flex-col-reverse items-end gap-3">
            {actions.map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                transition={{ delay: index * 0.05, duration: 0.2 }}
                className="flex items-center gap-3"
              >
                {/* Label */}
                <motion.span
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 + 0.1 }}
                  className="px-3 py-1.5 bg-card border border-border rounded-lg text-sm font-medium shadow-lg whitespace-nowrap"
                >
                  {action.label}
                </motion.span>

                {/* Button */}
                <button
                  onClick={() => {
                    triggerHaptic('light');
                    action.onClick();
                  }}
                  className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center shadow-lg',
                    'active:scale-95 transition-transform',
                    action.color,
                    'text-white'
                  )}
                >
                  <action.icon className="w-5 h-5" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Main FAB Button */}
      <motion.button
        onClick={toggleMenu}
        animate={{ rotate: isOpen ? 45 : 0 }}
        transition={{ duration: 0.2 }}
        className={cn(
          'w-14 h-14 rounded-full flex items-center justify-center shadow-xl',
          'active:scale-95 transition-all',
          isOpen
            ? 'bg-muted text-foreground'
            : 'bg-primary text-primary-foreground',
          'border-2 border-background'
        )}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Plus className="w-6 h-6" />
        )}
      </motion.button>
    </div>
  );
}
