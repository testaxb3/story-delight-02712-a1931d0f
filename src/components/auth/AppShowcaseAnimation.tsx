import { motion } from 'framer-motion';
import { Brain, Zap, BookOpen, Users } from 'lucide-react';

export function AppShowcaseAnimation() {
  // Simula cards de scripts deslizando
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

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Glow effect */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[300px] h-[300px] bg-gradient-to-br from-orange-500/20 to-purple-500/20 rounded-full blur-3xl" />
      </div>

      {/* Cards deslizando */}
      <div className="relative w-full max-w-[280px] h-[400px]">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={index}
              className="absolute inset-0"
              initial={{ 
                x: index * 20,
                y: index * 20,
                scale: 1 - index * 0.05,
                opacity: 1 - index * 0.2,
                rotate: index * 2
              }}
              animate={{
                x: [
                  index * 20,
                  (index - 1) * 20,
                  (index - 2) * 20,
                  (index - 3) * 20,
                  index * 20
                ],
                y: [
                  index * 20,
                  (index - 1) * 20,
                  (index - 2) * 20,
                  (index - 3) * 20,
                  index * 20
                ],
                scale: [
                  1 - index * 0.05,
                  1 - (index - 1 < 0 ? 3 : index - 1) * 0.05,
                  1 - (index - 2 < 0 ? 3 : index - 2) * 0.05,
                  1 - (index - 3 < 0 ? 3 : index - 3) * 0.05,
                  1 - index * 0.05
                ],
                opacity: [
                  1 - index * 0.2,
                  1 - (index - 1 < 0 ? 3 : index - 1) * 0.2,
                  1 - (index - 2 < 0 ? 3 : index - 2) * 0.2,
                  1 - (index - 3 < 0 ? 3 : index - 3) * 0.2,
                  1 - index * 0.2
                ],
                rotate: [
                  index * 2,
                  (index - 1) * 2,
                  (index - 2) * 2,
                  (index - 3) * 2,
                  index * 2
                ]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
                delay: index * 0.5
              }}
            >
              <div className={`
                w-full h-[180px] rounded-3xl
                bg-gradient-to-br ${card.gradient}
                p-6 shadow-2xl
                backdrop-blur-sm
              `}>
                <div className="flex flex-col h-full justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">
                      {card.title}
                    </h3>
                    <p className="text-white/80 text-sm">
                      {card.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white/30 rounded-full blur-sm"
          initial={{
            x: Math.random() * 300 - 150,
            y: Math.random() * 400 - 200
          }}
          animate={{
            x: Math.random() * 300 - 150,
            y: Math.random() * 400 - 200,
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}
