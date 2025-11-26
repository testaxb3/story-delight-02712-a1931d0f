import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { BookOpen, Video, FileText, CheckCircle2 } from 'lucide-react';

interface RingData {
  label: string;
  value: number;
  maxValue: number;
  color: string;
  icon: React.ElementType;
}

interface QuizResultRingsProps {
  brainType: 'INTENSE' | 'DISTRACTED' | 'DEFIANT';
  scriptsCount?: number;
  videosCount?: number;
  ebooksCount?: number;
}

export const QuizResultRings = ({ 
  brainType,
  scriptsCount = 45,
  videosCount = 12,
  ebooksCount = 3 
}: QuizResultRingsProps) => {
  const [animatedValues, setAnimatedValues] = useState({
    scripts: 0,
    videos: 0,
    ebooks: 0,
    completion: 0
  });

  const rings: RingData[] = [
    {
      label: 'Scripts',
      value: scriptsCount,
      maxValue: 50,
      color: 'hsl(var(--intense))',
      icon: FileText
    },
    {
      label: 'Videos',
      value: videosCount,
      maxValue: 20,
      color: 'hsl(var(--distracted))',
      icon: Video
    },
    {
      label: 'Ebooks',
      value: ebooksCount,
      maxValue: 5,
      color: 'hsl(var(--defiant))',
      icon: BookOpen
    },
    {
      label: 'Complete',
      value: 100,
      maxValue: 100,
      color: 'hsl(var(--primary))',
      icon: CheckCircle2
    }
  ];

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const interval = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setAnimatedValues({
        scripts: Math.floor(scriptsCount * progress),
        videos: Math.floor(videosCount * progress),
        ebooks: Math.floor(ebooksCount * progress),
        completion: Math.floor(100 * progress)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedValues({
          scripts: scriptsCount,
          videos: videosCount,
          ebooks: ebooksCount,
          completion: 100
        });
      }
    }, interval);

    return () => clearInterval(timer);
  }, [scriptsCount, videosCount, ebooksCount]);

  const getAnimatedValue = (index: number): number => {
    const values = [
      animatedValues.scripts,
      animatedValues.videos,
      animatedValues.ebooks,
      animatedValues.completion
    ];
    return values[index];
  };

  return (
    <div className="grid grid-cols-2 gap-2.5 md:gap-4 lg:gap-6 mb-4 md:mb-6 lg:mb-8">
      {rings.map((ring, index) => {
        const percentage = (ring.value / ring.maxValue) * 100;
        const circumference = 2 * Math.PI * 45;
        const strokeDashoffset = circumference - (percentage / 100) * circumference;
        const Icon = ring.icon;
        const animatedValue = getAnimatedValue(index);

        return (
          <motion.div
            key={ring.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              delay: index * 0.15,
              ease: [0.16, 1, 0.3, 1]
            }}
            whileHover={{ scale: 1.05 }}
            className="relative group"
          >
            {/* Glow Effect on Hover */}
            <motion.div
              className="absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"
              style={{ backgroundColor: ring.color }}
            />

            <div className="relative bg-card/50 dark:bg-card backdrop-blur-sm rounded-lg md:rounded-xl lg:rounded-2xl p-2.5 md:p-4 lg:p-6 border border-border/30 hover:border-border/60 transition-all">
              {/* SVG Ring */}
              <div className="relative w-16 h-16 md:w-20 md:h-20 lg:w-28 lg:h-28 mx-auto mb-1.5 md:mb-2 lg:mb-4">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="hsl(var(--muted))"
                    strokeWidth="8"
                    opacity="0.2"
                  />
                  {/* Progress circle */}
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={ring.color}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: index * 0.15 }}
                  />
                </svg>

                {/* Icon in center */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Icon className="w-5 h-5 md:w-6 md:h-6 lg:w-10 lg:h-10" style={{ color: ring.color }} />
                </div>
              </div>

              {/* Value and Label */}
              <div className="text-center">
                <motion.div
                  className="text-lg md:text-2xl lg:text-3xl font-bold mb-0.5 md:mb-1"
                  style={{ color: ring.color }}
                >
                  {ring.label === 'Complete' ? `${animatedValue}%` : animatedValue}
                </motion.div>
                <div className="text-[10px] md:text-xs lg:text-sm text-muted-foreground font-medium">
                  {ring.label}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
