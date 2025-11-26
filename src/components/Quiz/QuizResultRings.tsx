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
    <div className="grid grid-cols-2 gap-4">
      {rings.map((ring, index) => {
        const percentage = (ring.value / ring.maxValue) * 100;
        const circumference = 2 * Math.PI * 45;
        const strokeDashoffset = circumference - (percentage / 100) * circumference;
        const Icon = ring.icon;
        const animatedValue = getAnimatedValue(index);

        return (
          <motion.div
            key={ring.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.4,
              delay: index * 0.1,
              type: "spring",
              stiffness: 200
            }}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            {/* SVG Ring */}
            <div className="relative w-20 h-20 mb-3">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  className="text-muted/20"
                />
                {/* Progress circle */}
                <motion.circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke={ring.color}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: index * 0.15 }}
                />
              </svg>

              {/* Icon in center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Icon className="w-6 h-6 opacity-80" style={{ color: ring.color }} />
              </div>
            </div>

            {/* Value and Label */}
            <div className="text-center">
              <motion.div
                className="text-2xl font-black leading-none mb-1"
                style={{ color: ring.color }}
              >
                {ring.label === 'Complete' ? `${animatedValue}%` : animatedValue}
              </motion.div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                {ring.label}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};