import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      {/* Animated icon */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        className="relative mb-6"
      >
        <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full" />
        <div className="relative w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center border-4 border-border">
          <Icon className="w-12 h-12 text-muted-foreground" />
        </div>
      </motion.div>

      {/* Text content */}
      <h3 className="text-2xl font-bold mb-3 text-foreground">{title}</h3>
      <p className="text-muted-foreground mb-8 max-w-md leading-relaxed">{description}</p>
      
      {/* Action button */}
      {actionLabel && onAction && (
        <Button onClick={onAction} size="lg" className="touch-target">
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};
