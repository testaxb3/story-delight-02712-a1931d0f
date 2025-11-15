import { BookOpen, Sparkles, Target, Users } from 'lucide-react';

interface StatsCardsProps {
  scriptsUsed: number;
  currentStreak: number;
  totalMembers: number;
  activeUsersThisWeek: number;
  scriptsUsedToday: number;
  scriptsUsedThisWeek: number;
  loadingScriptsUsed: boolean;
  loadingLiveStats: boolean;
  getStatsMessage: (type: 'scripts' | 'videos' | 'streak') => string;
}

export function StatsCards({
  scriptsUsed,
  currentStreak,
  totalMembers,
  activeUsersThisWeek,
  scriptsUsedToday,
  scriptsUsedThisWeek,
  loadingScriptsUsed,
  loadingLiveStats,
  getStatsMessage,
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {/* Scripts Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40 p-4 sm:p-5 shadow-lg hover:shadow-xl transition-shadow border-2 border-purple-300/50 dark:border-purple-700/50">
        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-300/30 dark:bg-purple-600/20 rounded-full -mr-12 -mt-12"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="p-2 sm:p-2.5 bg-purple-500 dark:bg-purple-600 rounded-xl shadow-md">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500 dark:text-purple-400" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-purple-900 dark:text-purple-100 mb-1">
            {loadingScriptsUsed ? '...' : scriptsUsed}
          </div>
          <div className="text-xs sm:text-sm font-bold text-purple-700 dark:text-purple-300 mb-1 sm:mb-2">Scripts Used</div>
          <p className="text-xs text-purple-600 dark:text-purple-400 font-medium leading-tight line-clamp-2">
            {getStatsMessage('scripts')}
          </p>
        </div>
      </div>

      {/* Streak Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/40 dark:to-orange-800/40 p-4 sm:p-5 shadow-lg hover:shadow-xl transition-shadow border-2 border-orange-300/50 dark:border-orange-700/50">
        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-300/30 dark:bg-orange-600/20 rounded-full -mr-12 -mt-12"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="p-2 sm:p-2.5 bg-orange-500 dark:bg-orange-600 rounded-xl shadow-md">
              <Target className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-xl sm:text-2xl">🔥</span>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-orange-900 dark:text-orange-100 mb-1">{currentStreak}</div>
          <div className="text-xs sm:text-sm font-bold text-orange-700 dark:text-orange-300 mb-1 sm:mb-2">Day Streak</div>
          <p className="text-xs text-orange-600 dark:text-orange-400 font-medium leading-tight line-clamp-2">
            {getStatsMessage('streak')}
          </p>
        </div>
      </div>

      {/* Community Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 p-4 sm:p-5 shadow-lg hover:shadow-xl transition-shadow border-2 border-green-300/50 dark:border-green-700/50">
        <div className="absolute top-0 right-0 w-24 h-24 bg-green-300/30 dark:bg-green-600/20 rounded-full -mr-12 -mt-12"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="p-2 sm:p-2.5 bg-green-500 dark:bg-green-600 rounded-xl shadow-md">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 dark:text-green-400" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-green-900 dark:text-green-100 mb-1">
            {loadingLiveStats ? '...' : totalMembers.toLocaleString()}
          </div>
          <div className="text-xs sm:text-sm font-bold text-green-700 dark:text-green-300 mb-1 sm:mb-2">Total Parents</div>
          <p className="text-xs text-green-600 dark:text-green-400 font-medium leading-tight line-clamp-2">
            👥 {loadingLiveStats ? 'Loading...' : `${activeUsersThisWeek} online agora`}
          </p>
        </div>
      </div>

      {/* Scripts Today Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 p-4 sm:p-5 shadow-lg hover:shadow-xl transition-shadow border-2 border-blue-300/50 dark:border-blue-700/50">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-300/30 dark:bg-blue-600/20 rounded-full -mr-12 -mt-12"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="p-2 sm:p-2.5 bg-blue-500 dark:bg-blue-600 rounded-xl shadow-md">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-xl sm:text-2xl">🌟</span>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-blue-900 dark:text-blue-100 mb-1">
            {loadingLiveStats ? '...' : scriptsUsedToday.toLocaleString()}
          </div>
          <div className="text-xs sm:text-sm font-bold text-blue-700 dark:text-blue-300 mb-1 sm:mb-2">Scripts Today</div>
          <p className="text-xs text-blue-600 dark:text-blue-400 font-medium leading-tight line-clamp-2">
            📊 {loadingLiveStats ? 'Loading...' : `${scriptsUsedThisWeek} this week`}
          </p>
        </div>
      </div>
    </div>
  );
}
