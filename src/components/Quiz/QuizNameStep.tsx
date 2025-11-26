import { memo } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface QuizNameStepProps {
  childName: string;
  nameError: boolean;
  onChange: (name: string) => void;
}

export const QuizNameStep = memo(({ childName, nameError, onChange }: QuizNameStepProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-3 md:space-y-5 lg:space-y-6 w-full max-w-md"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center space-y-1.5 md:space-y-2 lg:space-y-3"
      >
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground font-relative leading-tight px-2">
          What's your child's name?
        </h2>
        <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-2">
          Let's personalize the experience for your family
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-2.5 md:space-y-3 lg:space-y-4"
      >
        <Label htmlFor="childName" className="text-xs md:text-sm font-medium text-foreground">
          Child's Name
        </Label>
        <Input
          id="childName"
          type="text"
          value={childName}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter child's name"
          className={`h-10 md:h-11 lg:h-12 text-sm md:text-base bg-card/50 dark:bg-card backdrop-blur-sm border transition-all ${
            nameError ? 'border-destructive focus:ring-destructive' : 'border-border focus:ring-primary'
          }`}
          autoFocus
        />
        {nameError && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs md:text-sm text-destructive"
          >
            Name must be 2-50 characters and contain only letters, spaces, hyphens, and apostrophes
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
});
