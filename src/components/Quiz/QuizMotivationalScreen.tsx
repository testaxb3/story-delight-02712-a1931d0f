import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface QuizMotivationalScreenProps {
  milestone: 25 | 50 | 75;
  onContinue: () => void;
}

const progressData = [
  { day: '3 Days', progress: 20 },
  { day: '7 Days', progress: 45 },
  { day: '14 Days', progress: 70 },
  { day: '30 Days', progress: 95 },
];

export const QuizMotivationalScreen = ({ milestone, onContinue }: QuizMotivationalScreenProps) => {
  const content = {
    25: {
      title: "You're doing great!",
      subtitle: "Keep going, we're building your personalized profile...",
      showChart: false,
    },
    50: {
      title: "Halfway there!",
      subtitle: "Your insights are helping us personalize NEP System just for you",
      showChart: true,
    },
    75: {
      title: "Almost done!",
      subtitle: "Just a few more questions and we'll have everything we need",
      showChart: false,
    },
  };

  const { title, subtitle, showChart } = content[milestone];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-12 space-y-8"
    >
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-4xl md:text-5xl font-black text-center text-black dark:text-white max-w-2xl"
      >
        {title}
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-lg md:text-xl text-gray-500 dark:text-gray-400 text-center max-w-xl"
      >
        {subtitle}
      </motion.p>

      {/* Chart (only for 50% milestone) */}
      {showChart && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="w-full max-w-md h-64 mt-8"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={progressData}>
              <XAxis
                dataKey="day"
                stroke="#9ca3af"
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                stroke="#9ca3af"
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#000', fontWeight: 'bold' }}
              />
              <Line
                type="monotone"
                dataKey="progress"
                stroke="#000"
                strokeWidth={3}
                dot={{ fill: '#000', r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-center text-sm text-gray-500 mt-4">
            Expected progress with NEP System
          </p>
        </motion.div>
      )}

      {/* Continue Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: showChart ? 0.8 : 0.6, duration: 0.5 }}
      >
        <Button
          onClick={onContinue}
          size="lg"
          className="rounded-full bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-200 px-12 py-6 text-lg font-semibold"
        >
          Continue
        </Button>
      </motion.div>
    </motion.div>
  );
};
