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
      className="space-y-6 w-full max-w-md"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center space-y-3"
      >
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground font-relative">
          What's your child's name?
        </h2>
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
          Let's personalize the experience for your family
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <Label htmlFor="childName" className="text-sm font-medium text-foreground">
          Child's Name
        </Label>
        <Input
          id="childName"
          type="text"
          value={childName}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter child's name"
          className={`h-12 text-base bg-card/50 backdrop-blur-sm border transition-all ${
            nameError ? 'border-destructive focus:ring-destructive' : 'border-border focus:ring-primary'
          }`}
          autoFocus
        />
        {nameError && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-destructive"
          >
            Name must be 2-50 characters and contain only letters, spaces, hyphens, and apostrophes
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
});
