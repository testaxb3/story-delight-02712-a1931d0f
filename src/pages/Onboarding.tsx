import { useState } from "react";
import { AnimatedPage } from "@/components/common/AnimatedPage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { Brain, BookOpen, Users, Sparkles } from "lucide-react";

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const steps = [
    {
      icon: Brain,
      title: "Welcome to NEP System",
      description: "Learn to transform negative thoughts into positive patterns using neuroscience-backed communication techniques.",
    },
    {
      icon: BookOpen,
      title: "Master the Scripts",
      description: "Access our library of proven NEP scripts for every situation. Each script follows the 3-phrase sequence that rewires thinking patterns.",
    },
    {
      icon: Users,
      title: "Join the Community",
      description: "Connect with others on the same journey. Share successes, get support, and learn from real experiences.",
    },
    {
      icon: Sparkles,
      title: "Track Your Progress",
      description: "Monitor your 30-day journey with daily check-ins, streaks, and achievements as you master NEP.",
    },
  ];

  const currentStep = steps[step];
  const Icon = currentStep.icon;
  const progress = ((step + 1) / steps.length) * 100;

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      navigate("/");
    }
  };

  const handleSkip = () => {
    navigate("/");
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-2xl w-full">
          <CardHeader>
            <div className="flex justify-between items-center mb-4">
              <Progress value={progress} className="flex-1 mr-4" />
              <span className="text-sm text-muted-foreground">
                {step + 1} / {steps.length}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon className="w-12 h-12 text-primary" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl">{currentStep.title}</CardTitle>
                <p className="text-muted-foreground max-w-md">
                  {currentStep.description}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={handleSkip} className="flex-1">
                Skip
              </Button>
              <Button onClick={handleNext} className="flex-1">
                {step < steps.length - 1 ? "Next" : "Get Started"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AnimatedPage>
  );
}
