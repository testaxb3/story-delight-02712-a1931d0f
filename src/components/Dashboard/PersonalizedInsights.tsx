import { Lightbulb } from 'lucide-react';
import { GradientText } from '@/components/common/GradientText';
import { usePersonalizedInsightsOptimized } from '@/hooks/usePersonalizedInsightsOptimized';
import { Skeleton } from '@/components/ui/skeleton';

interface PersonalizedInsightsProps {
  userId: string | undefined;
  brainProfile: string | null;
}

export const PersonalizedInsights = ({ userId, brainProfile }: PersonalizedInsightsProps) => {
  const { insights, loading } = usePersonalizedInsightsOptimized(userId, brainProfile);

  if (loading) {
    return (
      <div className="card-glass p-6 rounded-2xl">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-6 w-40" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  if (insights.length === 0) {
    return null;
  }

  return (
    <div className="card-glass p-6 rounded-2xl relative overflow-hidden">
      {/* Gradient Mesh Background */}
      <div className="gradient-mesh absolute inset-0 opacity-20" />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-warning" />
          <GradientText as="h3" className="text-xl">
            Insights for You
          </GradientText>
        </div>

        {/* Insights List */}
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <div
              key={index}
              className="p-4 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 hover-lift"
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="text-3xl">{insight.icon}</div>

                {/* Content */}
                <div className="flex-1">
                  <h4 className={`font-bold mb-1 ${insight.color}`}>
                    {insight.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {insight.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
