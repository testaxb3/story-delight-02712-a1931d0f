interface QuizProgressBarProps {
  current: number;
  total: number;
}

export const QuizProgressBar = ({ current, total }: QuizProgressBarProps) => {
  const progress = (current / total) * 100;

  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 h-1 rounded-full overflow-hidden">
      <div
        className="h-full bg-gray-900 dark:bg-white transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
