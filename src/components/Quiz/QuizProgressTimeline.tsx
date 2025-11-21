import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface QuizProgressTimelineProps {
  brainType: 'INTENSE' | 'DISTRACTED' | 'DEFIANT';
}

const timelineData = [
  { week: 0, nep: 10, traditional: 10 },
  { week: 2, nep: 8, traditional: 8 },
  { week: 4, nep: 6, traditional: 7 },
  { week: 8, nep: 4, traditional: 6 },
  { week: 12, nep: 3, traditional: 7 },
  { week: 24, nep: 2, traditional: 9 },
];

const brainTypeColors = {
  INTENSE: 'hsl(var(--intense))',
  DISTRACTED: 'hsl(var(--distracted))',
  DEFIANT: 'hsl(var(--defiant))'
};

export const QuizProgressTimeline = ({ brainType }: QuizProgressTimelineProps) => {
  const nepColor = brainTypeColors[brainType];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0 }}
      className="space-y-4 md:space-y-6"
    >
      {/* Title */}
      <div className="text-center space-y-2">
        <h3 className="text-xl md:text-2xl font-bold text-foreground font-relative">
          NEP System creates long-term results
        </h3>
        <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
          Challenge level comparison over 6 months
        </p>
      </div>

      {/* Chart */}
      <div className="w-full h-64 md:h-80 bg-card/30 rounded-xl p-4 md:p-6 border border-border/30">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={timelineData}>
            <XAxis
              dataKey="week"
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: window.innerWidth < 768 ? 11 : 13 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickLine={false}
              label={{
                value: 'Weeks',
                position: 'insideBottom',
                offset: -5,
                style: { fill: 'hsl(var(--muted-foreground))', fontSize: window.innerWidth < 768 ? 11 : 13 }
              }}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: window.innerWidth < 768 ? 11 : 13 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickLine={false}
              domain={[0, 10]}
              label={{
                value: 'Challenge Level',
                angle: -90,
                position: 'insideLeft',
                style: { fill: 'hsl(var(--muted-foreground))', fontSize: window.innerWidth < 768 ? 11 : 13 }
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: window.innerWidth < 768 ? '12px' : '14px'
              }}
              labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
              formatter={(value: number) => [`Level ${value}`, '']}
            />
            <Legend
              wrapperStyle={{ fontSize: window.innerWidth < 768 ? '12px' : '14px' }}
              iconType="line"
            />
            <Line
              type="monotone"
              dataKey="nep"
              name="NEP System"
              stroke={nepColor}
              strokeWidth={window.innerWidth < 768 ? 3 : 4}
              dot={{ fill: nepColor, r: window.innerWidth < 768 ? 5 : 6 }}
              activeDot={{ r: window.innerWidth < 768 ? 7 : 8 }}
            />
            <Line
              type="monotone"
              dataKey="traditional"
              name="Traditional approach"
              stroke="#ef4444"
              strokeWidth={window.innerWidth < 768 ? 2 : 3}
              strokeDasharray="5 5"
              dot={{ fill: '#ef4444', r: window.innerWidth < 768 ? 4 : 5 }}
              activeDot={{ r: window.innerWidth < 768 ? 6 : 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Statistics */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-center space-y-2 pt-2"
      >
        <p className="text-sm md:text-base font-semibold text-foreground">
          83% of parents maintain improvements even 6 months later
        </p>
        <p className="text-xs md:text-sm text-muted-foreground max-w-xl mx-auto">
          Unlike traditional approaches that often lead to regression, NEP System's 
          neuroscience-based strategies create lasting behavioral changes
        </p>
      </motion.div>
    </motion.div>
  );
};
