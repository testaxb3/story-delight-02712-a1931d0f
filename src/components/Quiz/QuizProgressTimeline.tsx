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
      className="space-y-3 md:space-y-4 lg:space-y-6"
    >
      {/* Title */}
      <div className="text-center space-y-1 md:space-y-1.5 lg:space-y-2 px-2">
        <h3 className="text-base md:text-lg lg:text-2xl font-bold text-foreground font-relative">
          Long-term progress: Nep vs Traditional
        </h3>
        <p className="text-xs md:text-sm lg:text-base text-muted-foreground max-w-2xl mx-auto">
          Challenge level over 6 months
        </p>
      </div>

      {/* Enhanced Chart with Gradient */}
      <div className="w-full h-56 md:h-64 lg:h-80 bg-gradient-to-br from-card/50 to-accent/10 rounded-lg md:rounded-xl lg:rounded-2xl p-3 md:p-4 lg:p-6 border border-border/20 md:border-2 shadow-lg">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={timelineData} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
            {/* Remove grid for cleaner look */}
            <defs>
              <linearGradient id={`gradient-${brainType}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={nepColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={nepColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            
            <XAxis
              dataKey="week"
              stroke="transparent"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: window.innerWidth < 768 ? 12 : 14, fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              stroke="transparent"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: window.innerWidth < 768 ? 12 : 14, fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
              domain={[0, 10]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '2px solid hsl(var(--border))',
                borderRadius: '12px',
                fontSize: window.innerWidth < 768 ? '13px' : '15px',
                fontWeight: 600,
                padding: '12px'
              }}
              labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold', marginBottom: '4px' }}
              formatter={(value: number, name: string) => [
                `Level ${value}`,
                name === 'nep' ? 'NEP System' : 'Traditional'
              ]}
            />
            <Legend
              wrapperStyle={{ fontSize: window.innerWidth < 768 ? 13 : 15, fontWeight: 600, paddingTop: '16px' }}
              iconType="line"
              iconSize={20}
            />
            
            {/* NEP Line with gradient fill */}
            <Line
              type="monotone"
              dataKey="nep"
              name="NEP System"
              stroke={nepColor}
              strokeWidth={window.innerWidth < 768 ? 4 : 5}
              dot={{ fill: nepColor, r: window.innerWidth < 768 ? 6 : 8, strokeWidth: 3, stroke: '#fff' }}
              activeDot={{ r: window.innerWidth < 768 ? 8 : 10, strokeWidth: 4 }}
              fill={`url(#gradient-${brainType})`}
            />
            
            {/* Traditional Line */}
            <Line
              type="monotone"
              dataKey="traditional"
              name="Traditional"
              stroke="#ef4444"
              strokeWidth={window.innerWidth < 768 ? 3 : 4}
              strokeDasharray="6 4"
              dot={{ fill: '#ef4444', r: window.innerWidth < 768 ? 5 : 6, strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: window.innerWidth < 768 ? 7 : 8, strokeWidth: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Key Insights with Annotations */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3 lg:gap-4"
      >
        <div className="bg-card/50 dark:bg-card rounded-lg md:rounded-xl p-2.5 md:p-3 lg:p-4 border border-border/30 text-center">
          <div className="text-base md:text-lg lg:text-xl font-bold text-foreground mb-0.5 md:mb-1">Week 2</div>
          <div className="text-[10px] md:text-xs lg:text-sm text-muted-foreground">First improvements visible</div>
        </div>

        <div className="bg-card/50 dark:bg-card rounded-lg md:rounded-xl p-2.5 md:p-3 lg:p-4 border border-border/30 text-center">
          <div className="text-base md:text-lg lg:text-xl font-bold text-foreground mb-0.5 md:mb-1">Week 8</div>
          <div className="text-[10px] md:text-xs lg:text-sm text-muted-foreground">Clear behavior changes</div>
        </div>

        <div className="bg-card/50 dark:bg-card rounded-lg md:rounded-xl p-2.5 md:p-3 lg:p-4 border border-border/30 text-center">
          <div className="text-base md:text-lg lg:text-xl font-bold text-foreground mb-0.5 md:mb-1">Week 24</div>
          <div className="text-[10px] md:text-xs lg:text-sm text-muted-foreground">Long-term stability achieved</div>
        </div>
      </motion.div>

      {/* Enhanced Statistics */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg md:rounded-xl p-3 md:p-4 lg:p-6 border border-border/30 text-center space-y-2 md:space-y-3"
      >
        <div className="flex items-center justify-center gap-1.5 md:gap-2">
          <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full flex-shrink-0" style={{ backgroundColor: nepColor }} />
          <p className="text-xs md:text-sm lg:text-base font-bold text-foreground">
            83% of parents maintain improvements even 6 months later
          </p>
        </div>
        <p className="text-[10px] md:text-xs lg:text-sm text-muted-foreground max-w-xl mx-auto px-2">
          Unlike traditional approaches that often regress, Nep System's neuroscience-based
          strategies create <strong>lasting behavioral changes</strong> through brain-type specific approaches
        </p>
      </motion.div>
    </motion.div>
  );
};
