import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Area, CartesianGrid } from 'recharts';

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
    <div className="w-full h-full flex flex-col">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-foreground">Long-term Impact</h3>
        <p className="text-sm text-muted-foreground">Challenge Level (Lower is better)</p>
      </div>

      <div className="w-full h-48 md:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={timelineData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
            <defs>
              <linearGradient id={`gradient-${brainType}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={nepColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={nepColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
            
            <XAxis
              dataKey="week"
              stroke="transparent"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              tickFormatter={(val) => `W${val}`}
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis
              stroke="transparent"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              domain={[0, 10]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
                borderRadius: '12px',
                fontSize: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            />
            
            {/* Traditional Line (Dashed) */}
            <Line
              type="monotone"
              dataKey="traditional"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
              activeDot={false}
              opacity={0.5}
            />

            {/* NEP Line (Main) */}
            <Line
              type="monotone"
              dataKey="nep"
              stroke={nepColor}
              strokeWidth={4}
              dot={{ fill: nepColor, r: 4, strokeWidth: 2, stroke: 'hsl(var(--background))' }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
         <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: nepColor }} />
            <span className="font-bold text-foreground">Nep System</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-muted-foreground/50" />
            <span>Traditional</span>
         </div>
      </div>
    </div>
  );
};