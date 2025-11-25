import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Zap, BookOpen, Users } from 'lucide-react';
import { useState, useEffect } from 'react';

export function AppShowcaseAnimation() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const cards = [
    {
      icon: Brain,
      title: "INTENSE Profile",
      description: "Bedtime strategies that work",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: Zap,
      title: "Quick Scripts",
      description: "2-minute solutions for tantrums",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: BookOpen,
      title: "Science-Based",
      description: "Backed by neuroscience research",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Users,
      title: "Community",
      description: "Learn from other parents",
      gradient: "from-green-500 to-emerald-500"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [cards.length]);

  const currentCard = cards[currentIndex];
  const Icon = currentCard.icon;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-6">
      {/* Glow effect */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[300px] h-[300px] bg-gradient-to-br from-orange-500/20 to-purple-500/20 rounded-full blur-3xl" />
      </div>

      {/* Card carousel */}
      <div className="relative w-full max-w-[320px] h-[240px] mb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <div className={`
              w-full h-full rounded-3xl
              bg-gradient-to-br ${currentCard.gradient}
              p-8 shadow-2xl
              backdrop-blur-sm
            `}>
              <div className="flex flex-col h-full justify-between">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-2xl mb-2">
                    {currentCard.title}
                  </h3>
                  <p className="text-white/90 text-base">
                    {currentCard.description}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dot indicators */}
      <div className="flex gap-2">
        {cards.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`
              w-2 h-2 rounded-full transition-all duration-300
              ${index === currentIndex 
                ? 'bg-white w-6' 
                : 'bg-white/40'
              }
            `}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
