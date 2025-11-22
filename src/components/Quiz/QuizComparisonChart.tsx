import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';

interface QuizComparisonChartProps {
  brainType: 'INTENSE' | 'DISTRACTED' | 'DEFIANT';
}

const comparisonData = {
  INTENSE: {
    multiplier: 2.3,
    nepImprovement: 85,
    traditionalImprovement: 37,
    color: 'hsl(var(--intense))'
  },
  DISTRACTED: {
    multiplier: 2.1,
    nepImprovement: 82,
    traditionalImprovement: 39,
    color: 'hsl(var(--distracted))'
  },
  DEFIANT: {
    multiplier: 2.0,
    nepImprovement: 78,
    traditionalImprovement: 39,
    color: 'hsl(var(--defiant))'
  }
};

export const QuizComparisonChart = ({ brainType }: QuizComparisonChartProps) => {
  const data = comparisonData[brainType];

  const chartData = [
    {
      name: 'Without NEP System',
      value: data.traditionalImprovement,
      color: '#ef4444'
    },
    {
      name: 'With NEP System',
      value: data.nepImprovement,
      color: data.color
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto space-y-6 md:space-y-8 px-4"
    >
      {/* Headline */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center space-y-2 md:space-y-3"
      >
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black dark:text-white font-relative">
          Children with {brainType} profile improve {data.multiplier}X faster
        </h2>
        <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          Comparing traditional parenting approaches vs. NEP System
        </p>
      </motion.div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white/50 dark:bg-black/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-800"
      >
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <XAxis
              dataKey="name"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: window.innerWidth < 768 ? 11 : 13 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: window.innerWidth < 768 ? 11 : 13 }}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
              label={{
                value: 'Improvement %',
                angle: -90,
                position: 'insideLeft',
                style: { fill: 'hsl(var(--muted-foreground))', fontSize: window.innerWidth < 768 ? 11 : 13 }
              }}
            />
            <Bar
              dataKey="value"
              radius={[12, 12, 0, 0]}
              animationDuration={1000}
              label={{
                position: 'top',
                formatter: (value: number) => `${value}%`,
                fill: 'hsl(var(--foreground))',
                fontSize: window.innerWidth < 768 ? 14 : 16,
                fontWeight: 'bold'
              }}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Comparison Cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Without NEP */}
        <div className="bg-red-50 dark:bg-red-950/20 rounded-xl p-4 md:p-5 border border-red-200 dark:border-red-900">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <h3 className="font-bold text-black dark:text-white text-sm md:text-base">Without NEP System</h3>
          </div>
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
            • Generic advice that doesn't match brain type<br />
            • Trial and error with inconsistent results<br />
            • Yo-yo effect: improvements don't last
          </p>
        </div>

        {/* With NEP */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 md:p-5 border-2" style={{ borderColor: data.color }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.color }} />
            <h3 className="font-bold text-black dark:text-white text-sm md:text-base">With NEP System</h3>
          </div>
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
            • Brain-type specific strategies<br />
            • Proven neuroscience-based approaches<br />
            • Lasting behavioral changes
          </p>
        </div>
      </motion.div>

      {/* Statistics */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center space-y-2"
      >
        <div className="inline-flex items-center gap-2 bg-primary/10 dark:bg-primary/5 rounded-full px-4 md:px-6 py-2 md:py-3">
          <span className="text-2xl md:text-3xl font-black" style={{ color: data.color }}>
            {data.multiplier}X
          </span>
          <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium">
            faster improvement
          </span>
        </div>
        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
          Based on data from 12,847 parents using NEP System
        </p>
      </motion.div>
    </motion.div>
  );
};
