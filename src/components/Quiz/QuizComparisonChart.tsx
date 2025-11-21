import { motion } from 'framer-motion';

interface QuizComparisonChartProps {
  brainType: 'INTENSE' | 'DISTRACTED' | 'DEFIANT';
}

const comparisonData = {
  INTENSE: {
    without: 35,
    multiplier: 2.2,
    color: 'hsl(var(--intense))'
  },
  DISTRACTED: {
    without: 38,
    multiplier: 1.9,
    color: 'hsl(var(--distracted))'
  },
  DEFIANT: {
    without: 32,
    multiplier: 2.1,
    color: 'hsl(var(--defiant))'
  }
};

export const QuizComparisonChart = ({ brainType }: QuizComparisonChartProps) => {
  const data = comparisonData[brainType];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 md:space-y-8 px-4"
    >
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center space-y-3"
      >
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-black dark:text-white font-relative leading-tight">
          Children improve {data.multiplier}X faster with NEP System
        </h2>
        <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Based on {brainType} profile parent feedback after 30 days
        </p>
      </motion.div>

      {/* Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-3xl mx-auto mt-8">
        {/* Without NEP */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-6 md:p-8 text-center space-y-4"
        >
          <div className="text-sm md:text-base font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Without NEP System
          </div>
          <div className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-600 dark:text-gray-300 font-relative">
            {data.without}%
          </div>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
            Report noticeable improvement
          </p>
        </motion.div>

        {/* With NEP */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="bg-black dark:bg-white rounded-2xl p-6 md:p-8 text-center space-y-4 relative overflow-hidden"
        >
          {/* Gradient Background */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              background: `linear-gradient(135deg, ${data.color}, transparent)`
            }}
          />
          
          <div className="relative z-10">
            <div className="text-sm md:text-base font-medium uppercase tracking-wide"
              style={{ color: data.color }}
            >
              With NEP System
            </div>
            <div className="text-5xl md:text-6xl lg:text-7xl font-black text-white dark:text-black font-relative mt-4">
              {data.multiplier}X
            </div>
            <p className="text-xs md:text-sm text-gray-300 dark:text-gray-600 mt-4">
              Report significant improvement
            </p>
          </div>
        </motion.div>
      </div>

      {/* Additional Context */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="text-center max-w-2xl mx-auto mt-6"
      >
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
          Parents using NEP System's brain-profile-specific strategies see dramatically faster results 
          compared to generic parenting approaches
        </p>
      </motion.div>

      {/* Success Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="grid grid-cols-3 gap-3 md:gap-4 max-w-2xl mx-auto mt-8"
      >
        <div className="text-center p-3 md:p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
          <div className="text-xl md:text-2xl font-bold" style={{ color: data.color }}>
            3-7
          </div>
          <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Days to first improvement
          </div>
        </div>
        
        <div className="text-center p-3 md:p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
          <div className="text-xl md:text-2xl font-bold" style={{ color: data.color }}>
            89%
          </div>
          <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Success rate
          </div>
        </div>
        
        <div className="text-center p-3 md:p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
          <div className="text-xl md:text-2xl font-bold" style={{ color: data.color }}>
            10K+
          </div>
          <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Parents helped
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
