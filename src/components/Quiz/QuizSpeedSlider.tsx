import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import { Slider } from '@/components/ui/slider';
import { LottieIcon } from '@/components/LottieIcon';
import slothAnimation from '@/assets/lottie/calai/sloth.json';
import rabbitAnimation from '@/assets/lottie/calai/rabbit.json';
import pantherAnimation from '@/assets/lottie/calai/panther.json';
import { useHaptic } from '@/hooks/useHaptic';

export interface QuizSpeedSliderProps {
  value: 'slow' | 'balanced' | 'intensive';
  onChange: (value: 'slow' | 'balanced' | 'intensive') => void;
}

const speedOptions = {
  slow: {
    label: 'Slow & Steady',
    description: 'Gradual approach - Sustainable changes over time',
    animation: slothAnimation,
    position: -1,
    icon: '🐌',
    feedback: 'Patient transformation with lasting results. Perfect for families wanting gentle, sustainable change.'
  },
  balanced: {
    label: 'Balanced',
    description: 'Moderate pace - Balance between speed and sustainability',
    animation: rabbitAnimation,
    position: 0,
    icon: '🐰',
    feedback: 'Steady progress with practical strategies. Recommended for most families.'
  },
  intensive: {
    label: 'Intensive',
    description: 'Fast results - Aggressive implementation (requires more energy)',
    animation: pantherAnimation,
    position: 1,
    icon: '🐆',
    feedback: 'Accelerated transformation for urgent challenges. Requires high commitment and energy.'
  }
};

export const QuizSpeedSlider = ({ value, onChange }: QuizSpeedSliderProps) => {
  const [sliderValue, setSliderValue] = useState([speedOptions[value].position]);
  const { triggerHaptic } = useHaptic();
  const lastValueRef = useRef(sliderValue[0]);

  const handleSliderChange = (newValue: number[]) => {
    const position = newValue[0];

    // Só vibra se o valor realmente mudou
    if (newValue[0] !== lastValueRef.current) {
      triggerHaptic('light');
      lastValueRef.current = newValue[0];
    }

    setSliderValue(newValue);
    
    // Map position to speed value
    if (position <= -0.5) {
      onChange('slow');
    } else if (position >= 0.5) {
      onChange('intensive');
    } else {
      onChange('balanced');
    }
  };

  const currentOption = speedOptions[value];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 md:space-y-8 px-4"
    >
      {/* Question */}
      <div className="text-center space-y-3">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black dark:text-white font-relative">
          How fast do you want to see results?
        </h2>
        <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Choose the pace that feels right for your family's situation
        </p>
      </div>

      {/* Animals Display */}
      <div className="flex items-center justify-center gap-4 md:gap-8 py-6 md:py-8">
        {Object.entries(speedOptions).map(([key, option]) => (
          <motion.div
            key={key}
            initial={{ opacity: 0.4, scale: 0.8 }}
            animate={{
              opacity: value === key ? 1 : 0.4,
              scale: value === key ? 1.2 : 0.8,
            }}
            transition={{ duration: 0.3, type: 'spring' }}
            className="flex flex-col items-center"
          >
            <LottieIcon
              animationData={option.animation}
              isActive={value === key}
              size={value === key ? (window.innerWidth < 768 ? 100 : 140) : (window.innerWidth < 768 ? 60 : 80)}
              loop={true}
              autoplay={true}
              speed={key === 'slow' ? 0.5 : key === 'intensive' ? 1.5 : 1}
            />
          </motion.div>
        ))}
      </div>

      {/* Slider */}
      <div className="max-w-md mx-auto px-4 md:px-8">
        <Slider
          value={sliderValue}
          onValueChange={handleSliderChange}
          min={-1}
          max={1}
          step={0.1}
          className="touch-none"
        />
      </div>

      {/* Selected Option Info */}
      <motion.div
        key={value}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center space-y-3 max-w-xl mx-auto"
      >
        <div className="text-4xl md:text-5xl">{currentOption.icon}</div>
        <h3 className="text-xl md:text-2xl font-bold text-black dark:text-white font-relative">
          {currentOption.label}
        </h3>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
          {currentOption.description}
        </p>
        
        {/* Feedback */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl"
        >
          <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300">
            💡 {currentOption.feedback}
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
