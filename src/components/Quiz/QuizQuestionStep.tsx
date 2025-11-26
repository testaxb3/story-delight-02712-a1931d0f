import { memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuizOptionCard } from './QuizOptionCard';

interface Option {
  value: string;
  label: string;
}

interface Question {
  question: string;
  context?: string;
  options: Option[];
}

interface QuizQuestionStepProps {
  question: Question;
  currentAnswer?: string;
  onAnswer: (answer: string) => void;
}

export const QuizQuestionStep = memo(({ question, currentAnswer, onAnswer }: QuizQuestionStepProps) => {
  const handleAnswer = useCallback((answer: string) => {
    onAnswer(answer);
  }, [onAnswer]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.question}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.25 }}
        className="space-y-5 md:space-y-6 lg:space-y-8"
      >
        <div className="text-left space-y-2 md:space-y-2.5 lg:space-y-3 px-4 md:px-5 lg:px-6">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground leading-tight font-relative"
          >
            {question.question}
          </motion.h2>

          {question.context && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xs md:text-sm text-muted-foreground"
            >
              {question.context}
            </motion.p>
          )}
        </div>

        <div className="space-y-2.5 md:space-y-3 lg:space-y-4 px-4 md:px-5 lg:px-6 pb-32">
          {question.options.map((option, index) => (
            <QuizOptionCard
              key={option.value}
              label={option.label}
              value={option.value}
              isSelected={currentAnswer === option.value}
              onSelect={handleAnswer}
              index={index}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
});
