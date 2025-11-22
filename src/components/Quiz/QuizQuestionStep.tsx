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
      className="space-y-6"
    >
      <div className="text-center space-y-3">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-black dark:text-white font-relative px-4">
          {question.question}
        </h2>
      </div>

      <div className="space-y-3 max-w-2xl mx-auto">
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
