import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Sparkles, CheckCircle2, ArrowRight, Target, Zap, Heart, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { WelcomeGiftModal } from '@/components/WelcomeGiftModal';

interface QuizWelcomeProps {
  onStart: () => void;
}

export function QuizWelcome({ onStart }: QuizWelcomeProps) {
  const [showGiftModal, setShowGiftModal] = useState(true);

  const handleGetStarted = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#9b87f5', '#D6BCFA', '#FFD700'],
    });
    onStart();
  };

  const handleCloseGiftModal = () => {
    setShowGiftModal(false);
  };

  const benefits = [
    {
      icon: Target,
      title: 'Personalized Scripts',
      description: 'Get communication strategies tailored to your child\'s unique brain type',
      color: 'text-primary'
    },
    {
      icon: Zap,
      title: 'Instant Results',
      description: 'Discover your child\'s brain profile in just 3 minutes',
      color: 'text-accent'
    },
    {
      icon: Heart,
      title: 'Science-Based',
      description: 'Based on neuroscience research and thousands of success stories',
      color: 'text-success'
    },
    {
      icon: Star,
      title: 'Proven System',
      description: 'Join thousands of parents who transformed their relationship with their child',
      color: 'text-warning'
    }
  ];

  return (
    <>
      <WelcomeGiftModal open={showGiftModal} onClose={handleCloseGiftModal} />
      
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            {/* Celebration Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-block mb-6"
            >
              <Badge className="px-6 py-2 text-lg bg-gradient-to-r from-primary to-accent text-primary-foreground border-0">
                <Sparkles className="w-5 h-5 mr-2" />
                🎉 Welcome to The Obedience Language!
              </Badge>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
            >
              You're One Quiz Away From<br />
              Everything Changing
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
            >
              Your $47 investment is about to unlock a <span className="font-semibold text-foreground">personalized roadmap</span> to understanding and communicating with your child like never before.
            </motion.p>

            {/* Brain Quiz Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="p-8 bg-gradient-to-br from-card to-primary/5 border-2 border-primary/20 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="p-4 rounded-full bg-primary/10">
                    <Brain className="w-12 h-12 text-primary" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-3xl font-bold text-foreground">Brain Profile Quiz</h2>
                    <p className="text-muted-foreground">3 minutes • 12 questions</p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3 text-left">
                    <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-foreground">Discover your child's unique brain type</p>
                      <p className="text-sm text-muted-foreground">INTENSE, DISTRACTED, or DEFIANT</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-left">
                    <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-foreground">Unlock personalized communication scripts</p>
                      <p className="text-sm text-muted-foreground">Tailored to your child's specific needs</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-left">
                    <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-foreground">Start seeing results immediately</p>
                      <p className="text-sm text-muted-foreground">Apply your first script within minutes</p>
                    </div>
                  </div>
                </div>

                <Button
                  size="lg"
                  onClick={handleGetStarted}
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Start My Brain Profile Quiz
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Card>
            </motion.div>
          </motion.div>

          {/* Why This Matters Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-16"
          >
            <h3 className="text-2xl font-bold text-center mb-8 text-foreground">
              Why This Quiz Changes Everything
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-all duration-300 bg-card border border-border/50">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg bg-primary/10 ${benefit.color}`}>
                        <benefit.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">{benefit.title}</h4>
                        <p className="text-sm text-muted-foreground">{benefit.description}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Trust Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 text-center"
          >
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">10,000+ parents</span> have already discovered their child's brain type
            </p>
            <div className="flex justify-center items-center gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-warning text-warning" />
              ))}
              <span className="ml-2 text-sm font-semibold text-foreground">4.9/5 average rating</span>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
