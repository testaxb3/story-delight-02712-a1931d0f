import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Zap, BookOpen, Users } from 'lucide-react';
import { useState, useEffect } from 'react';

export function EnhancedAppShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const cards = [
    {
      icon: Brain,
      title: "INTENSE Profile",
      description: "Bedtime strategies that work",
      gradient: "from-orange-500 via-red-500 to-pink-600",
      glow: "bg-orange-500/30"
    },
    {
      icon: Zap,
      title: "Quick Scripts",
      description: "2-minute solutions for tantrums",
      gradient: "from-blue-500 via-cyan-500 to-teal-500",
      glow: "bg-blue-500/30"
    },
    {
      icon: BookOpen,
      title: "Science-Based",
      description: "Backed by neuroscience research",
      gradient: "from-purple-500 via-pink-500 to-rose-500",
      glow: "bg-purple-500/30"
    },
    {
      icon: Users,
      title: "Community",
      description: "Learn from other parents",
      gradient: "from-green-500 via-emerald-500 to-teal-600",
      glow: "bg-green-500/30"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [cards.length]);

  const currentCard = cards[currentIndex];
  const Icon = currentCard.icon;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-6 py-12">
      {/* Dynamic glow effect that follows card changes */}
      <motion.div
        key={`glow-${currentIndex}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div className={`w-[400px] h-[400px] ${currentCard.glow} rounded-full blur-3xl`} />
      </motion.div>

      {/* Simplified Card carousel - mobile optimized */}
      <div className="relative w-full max-w-[300px] h-[220px] mb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute inset-0"
          >
            {/* Card shadow/depth effect */}
            <div className="absolute inset-0 rounded-[28px] bg-black/30 blur-xl transform translate-y-6 scale-95" />

            {/* Main card - simplified for mobile */}
            <div
              className={`
                relative w-full h-full rounded-[28px]
                bg-gradient-to-br ${currentCard.gradient}
                p-6 shadow-2xl
                border border-white/20
                overflow-hidden
              `}
            >
              {/* Glassmorphism overlay */}
              <div className="absolute inset-0 bg-white/5" />

              {/* Content */}
              <div className="relative flex flex-col h-full justify-between z-10">
                {/* Icon container */}
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center shadow-lg">
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Text content */}
                <div>
                  <h3 className="text-white font-bold text-2xl mb-2 leading-tight">
                    {currentCard.title}
                  </h3>
                  <p className="text-white/90 text-base leading-relaxed">
                    {currentCard.description}
                  </p>
                </div>
              </div>

              {/* Gradient border glow */}
              <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-white/20 via-transparent to-white/10 opacity-40" />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Simplified dot indicators */}
      <div className="flex gap-2">
        {cards.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`
              h-2 rounded-full transition-all duration-300
              ${index === currentIndex
                ? 'w-8 bg-white'
                : 'w-2 bg-white/40'
              }
            `}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
