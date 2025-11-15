import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GradientText } from '@/components/common/GradientText';
import { PremiumCard } from '@/components/common/PremiumCard';

interface HeroRecommendationProps {
  brainProfile: 'INTENSE' | 'DISTRACTED' | 'DEFIANT' | null;
  childName: string;
}

const recommendations = {
  INTENSE: {
    title: "When Emotions Overflow",
    description: "Your child feels deeply. Try this calming technique during emotional moments.",
    icon: "🌊",
    tag: "Most Used by INTENSE Parents"
  },
  DISTRACTED: {
    title: "Focus Builder Technique",
    description: "Help your child stay engaged without frustration. Works in 2 minutes.",
    icon: "🎯",
    tag: "Proven for DISTRACTED Kids"
  },
  DEFIANT: {
    title: "Power Struggles Solution",
    description: "Transform resistance into cooperation. Tested by 1,200+ parents.",
    icon: "🔥",
    tag: "Breakthrough for DEFIANT"
  }
};

export const HeroRecommendation = ({ brainProfile, childName }: HeroRecommendationProps) => {
  const navigate = useNavigate();
  
  const rec = brainProfile ? recommendations[brainProfile] : recommendations.DISTRACTED;

  return (
    <div className="card-glass p-8 rounded-3xl relative overflow-hidden">
      {/* Animated Gradient Mesh Background */}
      <div className="gradient-mesh absolute inset-0 opacity-30" />
      
      <div className="relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-primary">Your Next Win</span>
        </div>

        {/* Main Content */}
        <div className="flex items-start gap-6 mb-6">
          <div className="text-6xl shine">{rec.icon}</div>
          <div className="flex-1">
            <GradientText as="h2" className="text-3xl mb-2">
              {rec.title}
            </GradientText>
            <p className="text-muted-foreground text-lg mb-3">
              {rec.description}
            </p>
            <div className="inline-block px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
              <span className="text-xs font-medium text-accent">{rec.tag}</span>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <Button 
          size="lg" 
          className="w-full sm:w-auto gradient-primary hover-glow font-bold text-lg group"
          onClick={() => navigate('/scripts')}
        >
          Try This Script Now
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
};
