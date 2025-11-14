import { Clock, Play, Sparkles, Target, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface HeroSectionProps {
  userName: string;
  currentDay: number;
  totalDays: number;
  showBanner: boolean;
  onCloseBanner: () => void;
}

export function HeroSection({
  userName,
  currentDay,
  totalDays,
  showBanner,
  onCloseBanner,
}: HeroSectionProps) {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-accent to-primary/90 p-8 sm:p-10 text-white shadow-2xl">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-8">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-full mb-5 border border-white/20 shadow-lg">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span className="text-sm font-bold tracking-wide">DAY {currentDay} OF {totalDays}</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 leading-[1.1] tracking-tight">
              Hey {userName}! 👋
            </h1>
            <p className="text-lg sm:text-xl text-white/90 font-medium max-w-2xl leading-relaxed">
              Ready to create <span className="font-black underline decoration-white/40 decoration-2 underline-offset-4">real change</span> today?
            </p>
          </div>
          
          <div className="hidden sm:block ml-6">
            <div className="text-7xl animate-bounce-slow filter drop-shadow-2xl">🧠</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 col-span-2">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-white/80 uppercase tracking-wider">Progress</span>
              <span className="text-3xl font-black tabular-nums">{Math.round((currentDay / totalDays) * 100)}%</span>
            </div>
            <div className="relative h-3 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-white to-white/80 rounded-full transition-all duration-1000 ease-out shadow-lg"
                style={{ width: `${(currentDay / totalDays) * 100}%` }}
              >
                <div className="absolute inset-0 bg-white/30 animate-pulse" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/20 col-span-2">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-base mb-1">Today's Mission</p>
                <p className="text-sm text-white/80 leading-relaxed">
                  Watch one video & use a script with your child
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            size="lg"
            className="bg-white text-primary hover:bg-white/95 font-black shadow-2xl h-14 text-base rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-3xl"
            onClick={() => navigate('/scripts')}
          >
            <Target className="w-5 h-5 mr-2" />
            Find Script
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 font-black h-14 text-base rounded-xl backdrop-blur-md transition-all duration-300 hover:scale-105"
            onClick={() => navigate('/videos')}
          >
            <Play className="w-5 h-5 mr-2" />
            Watch Now
          </Button>
        </div>
      </div>

      {/* Urgency Strip */}
      {showBanner && (
        <div className="relative z-10 mt-6 bg-gradient-to-r from-yellow-400/90 to-orange-400/90 backdrop-blur-sm rounded-xl p-4 border border-yellow-300/50">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 text-orange-900 hover:bg-white/20 h-6 w-6"
            onClick={onCloseBanner}
          >
            <X className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-orange-900 flex-shrink-0" />
            <div>
              <p className="font-bold text-orange-900 text-sm sm:text-base">⏰ Day {currentDay} Challenge Active!</p>
              <p className="text-xs sm:text-sm text-orange-800">Don't break your streak! Use 1 script today</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
