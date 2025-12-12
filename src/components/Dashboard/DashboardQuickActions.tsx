import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, CheckCircle, Sparkles, User, MessageCircle, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHaptic } from '@/hooks/useHaptic';
import { toast } from 'sonner';
import { useAdminStatus } from '@/hooks/useAdminStatus';

interface QuickAction {
  id: string;
  label: string;
  icon: typeof Plus;
  color: string;
  onClick: () => void;
  disabled?: boolean;
}

interface DashboardQuickActionsProps {
  canLog: boolean;
  timeUntilNextLog: number | null;
  onLogPress: () => void;
  onRequestScriptPress: () => void;
  onSupportPress: () => void;
}

const formatCountdown = (ms: number | null): string => {
  if (!ms) return "Cooldown";
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
};

export function DashboardQuickActions({
  canLog,
  timeUntilNextLog,
  onLogPress,
  onRequestScriptPress,
  onSupportPress,
}: DashboardQuickActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { triggerHaptic } = useHaptic();
  const { isAdmin } = useAdminStatus();

  const handleLogClick = () => {
    if (!canLog) {
      triggerHaptic('error');
      toast.info(`Next log in ${formatCountdown(timeUntilNextLog)}`);
      setIsOpen(false);
      return;
    }
    onLogPress();
    setIsOpen(false);
  };

  const actions: QuickAction[] = [
    {
      id: 'log',
      label: canLog ? 'Log Progress' : `Log (${formatCountdown(timeUntilNextLog)})`,
      icon: CheckCircle,
      color: canLog ? 'bg-green-500' : 'bg-muted',
      onClick: handleLogClick,
      disabled: !canLog,
    },
    {
      id: 'request',
      label: 'Request Script',
      icon: Sparkles,
      color: 'bg-purple-500',
      onClick: () => {
        onRequestScriptPress();
        setIsOpen(false);
      },
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      color: 'bg-blue-500',
      onClick: () => {
        navigate('/profile');
        setIsOpen(false);
      },
    },
    {
      id: 'support',
      label: 'Support',
      icon: MessageCircle,
      color: 'bg-orange-500',
      onClick: () => {
        onSupportPress();
        setIsOpen(false);
      },
    },
    // Admin Panel - only visible for admin users
    ...(isAdmin ? [{
      id: 'admin',
      label: 'Admin Panel',
      icon: Shield,
      color: 'bg-gradient-to-r from-purple-600 to-pink-500',
      onClick: () => {
        triggerHaptic('medium');
        navigate('/admin');
        setIsOpen(false);
      },
    }] : []),
  ];

  const toggleMenu = () => {
    triggerHaptic('medium');
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed right-4 z-50" style={{ bottom: 'calc(env(safe-area-inset-bottom) + 100px)' }}>
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
                  className={cn(
                    "px-3 py-1.5 bg-card border border-border rounded-lg text-sm font-medium shadow-lg whitespace-nowrap",
                    action.disabled && "text-muted-foreground",
                    action.id === 'admin' && "font-bold text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800"
                  )}
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
                    'text-white',
                    action.disabled && 'opacity-60'
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
