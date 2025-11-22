import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface QuizNameStepProps {
  childName: string;
  nameError: boolean;
  onChange: (name: string) => void;
}

export const QuizNameStep = ({ childName, nameError, onChange }: QuizNameStepProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center space-y-3">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black dark:text-white font-relative">
          What's your child's name?
        </h2>
        <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Let's personalize the experience for your family
        </p>
      </div>

      <div className="space-y-4 max-w-md mx-auto">
        <Label htmlFor="childName" className="text-sm font-medium text-black dark:text-white">
          Child's Name
        </Label>
        <Input
          id="childName"
          type="text"
          value={childName}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter child's name"
          className={`h-12 text-base bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-black dark:text-white ${
            nameError ? 'border-red-500' : ''
          }`}
        />
        {nameError && (
          <p className="text-sm text-red-500">
            Name must be 2-50 characters and contain only letters, spaces, hyphens, and apostrophes
          </p>
        )}
      </div>
    </motion.div>
  );
};
