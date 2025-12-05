import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { ReactNode } from 'react';

type EmptyStateVariant = 'search' | 'favorites' | 'activity' | 'community' | 'default';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: EmptyStateVariant;
  children?: ReactNode;
}

// Premium animated illustrations
const Illustrations: Record<EmptyStateVariant, ReactNode> = {
  search: (
    <svg viewBox="0 0 120 120" className="w-full h-full" fill="none">
      <motion.circle
        cx="60"
        cy="60"
        r="50"
        className="fill-muted/20"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.circle
        cx="50"
        cy="50"
        r="22"
        className="stroke-primary/50"
        strokeWidth="4"
        fill="none"
        animate={{ r: [22, 24, 22] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.line
        x1="66"
        y1="66"
        x2="85"
        y2="85"
        className="stroke-primary/50"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <motion.circle
        cx="50"
        cy="50"
        r="10"
        className="fill-primary/10"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </svg>
  ),
  favorites: (
    <svg viewBox="0 0 120 120" className="w-full h-full" fill="none">
      <circle cx="60" cy="60" r="50" className="fill-muted/20" />
      <motion.path
        d="M60 90 L35 65 C20 50 20 30 40 22 C55 17 60 32 60 32 C60 32 65 17 80 22 C100 30 100 50 85 65 Z"
        className="fill-red-400/20 stroke-red-400/40"
        strokeWidth="3"
        animate={{
          scale: [1, 1.08, 1],
          fill: ['rgba(248, 113, 113, 0.2)', 'rgba(248, 113, 113, 0.35)', 'rgba(248, 113, 113, 0.2)']
        }}
        transition={{ duration: 1.2, repeat: Infinity }}
        style={{ transformOrigin: 'center' }}
      />
    </svg>
  ),
  activity: (
    <svg viewBox="0 0 120 120" className="w-full h-full" fill="none">
      <circle cx="60" cy="60" r="50" className="fill-muted/20" />
      <motion.rect
        x="30" y="55"
        width="15" height="35"
        rx="4"
        className="fill-primary/30"
        animate={{ height: [35, 25, 35], y: [55, 65, 55] }}
        transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
      />
      <motion.rect
        x="52" y="40"
        width="15" height="50"
        rx="4"
        className="fill-primary/50"
        animate={{ height: [50, 35, 50], y: [40, 55, 40] }}
        transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
      />
      <motion.rect
        x="74" y="48"
        width="15" height="42"
        rx="4"
        className="fill-primary/30"
        animate={{ height: [42, 28, 42], y: [48, 62, 48] }}
        transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
      />
    </svg>
  ),
  community: (
    <svg viewBox="0 0 120 120" className="w-full h-full" fill="none">
      <circle cx="60" cy="60" r="50" className="fill-muted/20" />
      <circle cx="45" cy="45" r="14" className="fill-primary/30" />
      <circle cx="75" cy="45" r="14" className="fill-primary/20" />
      <motion.circle
        cx="60" cy="75"
        r="16"
        className="fill-primary/40"
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <circle cx="45" cy="45" r="5" className="fill-background" />
      <circle cx="75" cy="45" r="5" className="fill-background" />
      <circle cx="60" cy="75" r="6" className="fill-background" />
    </svg>
  ),
  default: (
    <svg viewBox="0 0 120 120" className="w-full h-full" fill="none">
      <circle cx="60" cy="60" r="50" className="fill-muted/20" />
      <motion.circle
        cx="60"
        cy="60"
        r="25"
        className="stroke-primary/30"
        strokeWidth="3"
        strokeDasharray="8 4"
        fill="none"
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: 'center' }}
      />
      <motion.circle
        cx="60"
        cy="60"
        r="12"
        className="fill-primary/20"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </svg>
  ),
};

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  variant = 'default',
  children,
}: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-12 px-6 text-center"
    >
      {/* Animated illustration or icon */}
      <div className="relative mb-6 w-32 h-32">
        {Icon ? (
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 3, -3, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            className="w-full h-full"
          >
            <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full" />
            <div className="relative w-full h-full rounded-full bg-muted/30 flex items-center justify-center border-2 border-border/50">
              <Icon className="w-12 h-12 text-muted-foreground" />
            </div>
          </motion.div>
        ) : (
          Illustrations[variant]
        )}
      </div>

      {/* Text content */}
      <h3 className="text-xl font-bold mb-2 text-foreground">{title}</h3>
      <p className="text-muted-foreground text-sm mb-6 max-w-xs leading-relaxed">{description}</p>

      {/* Action button */}
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="touch-target rounded-2xl px-6 py-5 font-semibold"
        >
          {actionLabel}
        </Button>
      )}

      {/* Custom children */}
      {children}
    </motion.div>
  );
};
