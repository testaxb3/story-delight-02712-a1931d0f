import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GradientText } from '@/components/common/GradientText';
import { getSmartRecommendation } from '@/lib/scriptRecommendations';
import { motion } from 'framer-motion';

interface HeroRecommendationProps {
  brainProfile: 'INTENSE' | 'DISTRACTED' | 'DEFIANT' | null;
  childName: string;
}

export const HeroRecommendation = ({ brainProfile, childName }: HeroRecommendationProps) => {
  const navigate = useNavigate();
  
  // Get intelligent recommendation based on profile and time
  const rec = getSmartRecommendation(brainProfile);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      className="card-glass p-8 rounded-3xl relative overflow-hidden"
    >
      {/* Animated Gradient Mesh Background */}
      <motion.div
        className="gradient-mesh absolute inset-0"
        animate={{
          opacity: [0.2, 0.35, 0.2]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <div className="relative z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4"
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-primary">Your Next Win</span>
        </motion.div>

        {/* Main Content */}
        <div className="flex items-start gap-6 mb-6">
          <motion.div
            className="text-6xl shine"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {rec.icon}
          </motion.div>
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GradientText as="h2" className="text-3xl mb-2">
                {rec.title}
              </GradientText>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-muted-foreground text-lg mb-3"
            >
              {rec.description}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="inline-block px-3 py-1 rounded-full bg-accent/10 border border-accent/20"
            >
              <span className="text-xs font-medium text-accent">{rec.tag}</span>
            </motion.div>
          </div>
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button 
            size="lg" 
            className="w-full sm:w-auto gradient-primary hover-glow font-bold text-lg group"
            onClick={() => navigate('/scripts')}
          >
            Try This Script Now
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight className="ml-2 w-5 h-5" />
            </motion.div>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};
