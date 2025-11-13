import { Clock, ThumbsUp, TrendingDown, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getBrainTypeIcon } from '@/lib/brainTypes';
import type { SuccessStory } from '@/lib/successStories';

interface SuccessStoryCardProps {
  story: SuccessStory;
}

export function SuccessStoryCard({ story }: SuccessStoryCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 p-4 sm:p-6 text-white shadow-2xl border-2 border-emerald-400/50">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600/20 rounded-full -ml-32 -mb-32 blur-3xl"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 sm:p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <ThumbsUp className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <Badge className="bg-white/90 text-emerald-700 border-none font-bold text-xs">
                Success Story
              </Badge>
              <Badge className="bg-white/30 text-white border-white/30 text-xs">
                {getBrainTypeIcon(story.brainType)} {story.brainType} Brain
              </Badge>
            </div>
            <h2 className="text-xl sm:text-2xl font-black truncate">
              {story.name}'s Journey
            </h2>
          </div>
          <span className="text-3xl sm:text-4xl animate-bounce flex-shrink-0">🎉</span>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 mb-4 border border-white/20">
          <p className="text-sm sm:text-lg font-medium italic leading-relaxed">
            "{story.quote}"
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-white/20 text-center">
            <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 text-yellow-300" />
            <div className="font-black text-base sm:text-lg">{story.before.value}</div>
            <div className="text-xl sm:text-2xl my-1">↓</div>
            <div className="font-black text-base sm:text-lg text-yellow-300">{story.after.value}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-white/20 text-center">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1" />
            <div className="text-xs opacity-80 mb-1">Timeline</div>
            <div className="font-bold text-xs sm:text-sm">{story.timeline}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-white/20 text-center">
            <Users className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1" />
            <div className="text-xs opacity-80 mb-1">Child Age</div>
            <div className="font-bold text-xs sm:text-sm">{story.childAge}</div>
          </div>
        </div>

        <p className="text-xs text-white/60 text-center mt-3">
          💫 Stories rotate every 30 seconds
        </p>
      </div>
    </div>
  );
}
