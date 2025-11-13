import { BookOpen, Sparkles, Target, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getBrainTypeIcon } from '@/lib/brainTypes';

interface ChildProgressCardProps {
  childName?: string;
  brainProfile?: string | null;
  currentDay: number;
  meltdownCopy: string;
  stressCopy: string;
}

export function ChildProgressCard({
  childName,
  brainProfile,
  currentDay,
  meltdownCopy,
  stressCopy,
}: ChildProgressCardProps) {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 p-4 sm:p-6 text-white shadow-2xl border-2 border-blue-400/50">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-56 h-56 bg-white/10 rounded-full -mr-28 -mt-28 blur-3xl"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 sm:p-3 bg-white/20 rounded-xl backdrop-blur-sm flex-shrink-0">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-black truncate">
                {childName ? `${childName}'s Progress` : 'Living Progress'}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xl sm:text-2xl">{getBrainTypeIcon(brainProfile)}</span>
                <span className="text-sm sm:text-lg font-bold truncate">{brainProfile ?? 'INTENSE'} Brain</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-3 mb-4">
          <div className="bg-white/10 backdrop-blur-sm p-3 sm:p-4 rounded-xl border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-yellow-400/30 rounded-lg flex-shrink-0">
                <Sparkles className="w-4 h-4 text-yellow-300" />
              </div>
              <p className="font-bold text-yellow-300 text-sm sm:text-base">This Week's Wins</p>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed">{meltdownCopy}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-3 sm:p-4 rounded-xl border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-orange-400/30 rounded-lg flex-shrink-0">
                <TrendingDown className="w-4 h-4 text-orange-300" />
              </div>
              <p className="font-bold text-orange-300 text-sm sm:text-base">Nervous System Check-in</p>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed">{stressCopy}</p>
          </div>

          <div className="bg-gradient-to-r from-cyan-500/30 to-blue-500/30 backdrop-blur-sm p-3 sm:p-4 rounded-xl border border-cyan-300/30">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-cyan-400/30 rounded-lg flex-shrink-0">
                <Target className="w-4 h-4 text-cyan-200" />
              </div>
              <p className="font-bold text-cyan-200 text-sm sm:text-base">Next Best Action</p>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed">
              Open My Plan to unlock Day {currentDay} for {childName ?? 'your child'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            className="bg-white text-blue-600 hover:bg-blue-50 font-bold shadow-lg h-10 sm:h-11 text-sm sm:text-base"
            onClick={() => navigate('/tracker')}
          >
            <Target className="w-4 h-4 mr-2" />
            My Plan
          </Button>
          <Button
            variant="outline"
            className="bg-white/10 hover:bg-white/20 text-white border-white/30 font-bold backdrop-blur-sm h-10 sm:h-11 text-sm sm:text-base"
            onClick={() => navigate('/quiz')}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Quiz
          </Button>
        </div>
      </div>
    </div>
  );
}
