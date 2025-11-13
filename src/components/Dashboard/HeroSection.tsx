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
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 p-8 text-white shadow-2xl">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">Day {currentDay} of {totalDays}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 leading-tight">
              Welcome back,<br />{userName}! 🎉
            </h1>
            <p className="text-base sm:text-lg text-purple-100 mb-6 max-w-2xl">
              You're making real progress in transforming your parenting journey
            </p>
          </div>
          <div className="text-5xl sm:text-7xl ml-4 animate-pulse hidden sm:block">🧠</div>
        </div>

        {/* Progress Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm sm:text-base text-purple-100 font-medium">Your Transformation Progress</span>
            <span className="text-xl sm:text-2xl font-black">{currentDay}/{totalDays}</span>
          </div>
          <div className="relative">
            <Progress value={(currentDay / totalDays) * 100} className="h-3 bg-white/20" />
            <div className="absolute -top-1 left-0" style={{ left: `${(currentDay / totalDays) * 100}%` }}>
              <div className="w-5 h-5 bg-white rounded-full shadow-lg -ml-2.5 flex items-center justify-center">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-yellow-300" />
              <p className="font-bold text-yellow-300 text-sm sm:text-base">Today's Mission</p>
            </div>
            <p className="text-xs sm:text-sm text-purple-50">
              Watch one Foundation video and try your first NEP phrase with your child
            </p>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <Button
            className="bg-white text-purple-600 hover:bg-purple-50 font-bold shadow-lg h-11 sm:h-12 text-sm sm:text-base"
            onClick={() => navigate('/tracker')}
          >
            <Target className="w-4 h-4 mr-2" />
            My Plan
          </Button>
          <Button
            variant="outline"
            className="bg-white/10 hover:bg-white/20 text-white border-white/30 font-bold backdrop-blur-sm h-11 sm:h-12 text-sm sm:text-base"
            onClick={() => navigate('/videos')}
          >
            <Play className="w-4 h-4 mr-2" />
            Watch Videos
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
