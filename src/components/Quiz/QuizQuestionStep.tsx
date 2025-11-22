import { motion } from 'framer-motion';
import { QuizOptionCard } from './QuizOptionCard';

interface Option {
  value: string;
  label: string;
}

interface Question {
  question: string;
  options: Option[];
}

interface QuizQuestionStepProps {
  question: Question;
  currentAnswer?: string;
  onAnswer: (answer: string) => void;
}

export const QuizQuestionStep = ({ question, currentAnswer, onAnswer }: QuizQuestionStepProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="text-left space-y-2 px-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">
          {question.question}
        </h2>
      </div>

      <div className="space-y-4 px-6">
        {question.options.map((option) => (
          <QuizOptionCard
            key={option.value}
            label={option.label}
            value={option.value}
            isSelected={currentAnswer === option.value}
            onSelect={(value) => onAnswer(value)}
          />
        ))}
      </div>
    </motion.div>
  );
};
