import { memo, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock, BookOpen, WifiOff, CheckCircle, ThumbsUp, ChevronRight,
  Heart, Play, Sparkles, Star, Flame, Calendar
} from 'lucide-react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { usePrograms, ProgramWithProgress, Program } from '@/hooks/usePrograms';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useNavigate } from 'react-router-dom';

// ============================================
// SECTION HEADER - Enhanced
// ============================================
const SectionHeader = memo(function SectionHeader({
  icon,
  iconGradient,
  title,
  badge
}: {
  icon: React.ReactNode;
  iconGradient: string;
  title: string;
  badge?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-3 mb-5"
    >
      <div className={`w-10 h-10 rounded-[12px] bg-gradient-to-br ${iconGradient} flex items-center justify-center shadow-lg`}>
        {icon}
      </div>
      <h2 className="text-[22px] font-bold text-foreground flex-1">{title}</h2>
      {badge && (
        <span className="px-3 py-1 bg-gradient-to-r from-[#FF6631]/10 to-[#FFA300]/10 text-[#FF6631] text-[12px] font-bold rounded-full">
          {badge}
        </span>
      )}
    </motion.div>
  );
});

// ============================================
// CURRENT PROGRAM CARD - Premium
// ============================================
const CurrentProgramCardPremium = memo(function CurrentProgramCardPremium({
  program
}: {
  program: ProgramWithProgress;
}) {
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(false);

  const nextLessonNumber = program.lessons_completed.length + 1;
  const nextLesson = program.nextLesson;
  const imageUrl = nextLesson?.image_url || program.cover_image_url;
  const lessonTitle = nextLesson?.title || 'Continue Learning';
  const lessonSummary = nextLesson?.summary || program.description || '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FF6631]/20 to-[#FFA300]/10 rounded-[20px] blur-xl opacity-60" />

      <div className="relative bg-card dark:bg-card rounded-[20px] overflow-hidden shadow-xl shadow-orange-500/10 border border-orange-100/50 dark:border-orange-900/30">
        {/* Top gradient bar */}
        <div className="h-1 bg-gradient-to-r from-[#FF6631] via-[#FFA300] to-[#FF6631]" />

        {/* Header row */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-[#FF6631]/15 to-[#FFA300]/15 flex items-center justify-center">
              <BookOpen className="w-[18px] h-[18px] text-[#FF6631]" />
            </div>
            <p className="text-[16px] font-semibold text-foreground">{program.title}</p>
          </div>

          {/* Progress - Clear text */}
          <p className="text-[15px] text-muted-foreground">
            <span className="text-[#FF6631] font-bold">{program.lessons_completed.length}</span>
            {' '}out of{' '}
            <span className="text-[#FF6631] font-bold">{program.total_lessons}</span>
          </p>
        </div>

        {/* Lesson title */}
        <div className="px-5 pb-3">
          <p className="text-[13px] text-muted-foreground mb-1">Next up</p>
          <h3 className="text-[20px] font-bold text-foreground leading-tight">
            <span className="text-[#FF6631]">#{nextLessonNumber}</span>{' '}
            {lessonTitle}
          </h3>
        </div>

        {/* Image */}
        <div className="relative mx-5 mb-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="rounded-[16px] overflow-hidden aspect-[16/9] bg-gray-100 shadow-lg"
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={lessonTitle}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
                <BookOpen className="w-16 h-16 text-[#FF6631]/20" />
              </div>
            )}

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

            {/* Play indicator */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="absolute left-4 bottom-4 flex items-center gap-2 px-3 py-1.5 bg-white/95 dark:bg-card/95 backdrop-blur-sm rounded-full shadow-lg"
            >
              <Play className="w-3.5 h-3.5 text-[#FF6631] fill-[#FF6631]" />
              <span className="text-[12px] font-semibold text-foreground">Ready to play</span>
            </motion.div>
          </motion.div>

          {/* Heart button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              setIsFavorited(!isFavorited);
            }}
            className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/95 dark:bg-card/95 backdrop-blur-sm flex items-center justify-center shadow-lg"
          >
            <Heart className={`w-5 h-5 transition-all ${isFavorited ? 'fill-red-500 text-red-500 scale-110' : 'text-muted-foreground'}`} />
          </motion.button>
        </div>

        {/* Description */}
        {lessonSummary && (
          <div className="px-5 pb-4">
            <p className="text-[15px] text-muted-foreground leading-relaxed line-clamp-2">
              {lessonSummary}
            </p>
          </div>
        )}

        {/* CTA Button */}
        <div className="px-5 pb-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/programs/${program.slug}`)}
            className="relative w-full h-[56px] rounded-full bg-gradient-to-r from-[#FF6631] to-[#FFA300] text-white text-[17px] font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30 overflow-hidden group"
          >
            {/* Shine effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
            <Play className="w-5 h-5 fill-current" />
            <span>Continue Learning</span>
            <Sparkles className="w-4 h-4 opacity-70" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
});

// ============================================
// UPCOMING PROGRAM CARD - Premium Grid
// ============================================
const UpcomingProgramCardPremium = memo(function UpcomingProgramCardPremium({
  program,
  index
}: {
  program: Program;
  index: number;
}) {
  const navigate = useNavigate();
  const [voted, setVoted] = useState(false);

  // Alternate background colors
  const bgColors = [
    'from-pink-50 to-rose-100',
    'from-blue-50 to-indigo-100',
    'from-amber-50 to-orange-100',
    'from-green-50 to-emerald-100',
  ];
  const bgColor = bgColors[index % bgColors.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="bg-card dark:bg-card rounded-[20px] overflow-hidden shadow-lg shadow-gray-200/50 dark:shadow-none border border-border"
    >
      {/* Image with gradient background */}
      <div className={`relative aspect-[4/3] bg-gradient-to-br ${bgColor} overflow-hidden`}>
        {program.cover_image_url ? (
          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            src={program.cover_image_url}
            alt={program.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-gray-300" />
          </div>
        )}
      </div>

      {/* Title */}
      <div className="px-4 py-3">
        <h4 className="text-[15px] font-bold text-foreground text-center leading-tight line-clamp-2 min-h-[40px]">
          {program.title}
        </h4>
      </div>

      {/* Buttons */}
      <div className="px-4 pb-5 space-y-2">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setVoted(!voted)}
          className={`w-full h-[42px] rounded-full flex items-center justify-center gap-2 text-[14px] font-bold transition-all ${voted
            ? 'bg-gradient-to-r from-[#FF6631] to-[#FFA300] text-white shadow-lg shadow-orange-500/30'
            : 'border-2 border-[#FF6631] text-[#FF6631] hover:bg-[#FF6631]/5'
            }`}
        >
          <ThumbsUp className={`w-4 h-4 ${voted ? 'fill-current' : ''}`} />
          {voted ? 'Voted!' : 'Vote for this'}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate(`/programs/${program.slug}`)}
          className="w-full h-[42px] rounded-full border-2 border-border text-[14px] font-semibold text-muted-foreground hover:bg-muted/50 hover:border-muted-foreground/30 transition-all"
        >
          Read more
        </motion.button>
      </div>
    </motion.div>
  );
});

// ============================================
// COMPLETED PROGRAM CARD - Premium
// ============================================
const CompletedProgramCardPremium = memo(function CompletedProgramCardPremium({
  program,
  index
}: {
  program: ProgramWithProgress;
  index: number;
}) {
  const navigate = useNavigate();

  const completedDate = program.completed_at
    ? new Date(program.completed_at).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
    : 'Recently';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ x: 6 }}
      onClick={() => navigate(`/programs/${program.slug}`)}
      className="group relative flex items-start gap-4 p-4 bg-card dark:bg-card rounded-[18px] shadow-md shadow-gray-100 dark:shadow-none border border-border cursor-pointer overflow-hidden"
    >
      {/* Accent line on hover */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 rounded-r-full bg-gradient-to-b from-[#11C222] to-[#22D933] group-hover:h-[60%] transition-all duration-300" />

      {/* Thumbnail */}
      <div className="relative w-20 h-20 rounded-[14px] overflow-hidden bg-gradient-to-br from-green-50 to-emerald-100 flex-shrink-0">
        {program.cover_image_url ? (
          <img
            src={program.cover_image_url}
            alt={program.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-green-300" />
          </div>
        )}

        {/* Completion badge */}
        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-br from-[#11C222] to-[#22D933] flex items-center justify-center shadow-lg">
          <CheckCircle className="w-4 h-4 text-white" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 py-0.5">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="px-2.5 py-1 bg-gradient-to-r from-[#FF6631]/10 to-[#FFA300]/10 text-[#FF6631] text-[11px] font-bold rounded-full">
            {program.total_lessons} Lessons
          </span>
          {program.age_range && (
            <span className="px-2.5 py-1 bg-gradient-to-r from-[#2791E0]/10 to-[#76B9FF]/10 text-[#2791E0] text-[11px] font-bold rounded-full">
              Age {program.age_range}
            </span>
          )}
        </div>

        {/* Title */}
        <h4 className="text-[16px] font-bold text-foreground leading-tight mb-1 group-hover:text-[#11C222] transition-colors">
          {program.title}
        </h4>

        {/* Date */}
        <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
          <Calendar className="w-3.5 h-3.5" />
          <span>Finished on {completedDate}</span>
        </div>
      </div>

      {/* Arrow */}
      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#11C222] transition-colors flex-shrink-0 mt-7" />
    </motion.div>
  );
});

// ============================================
// AVAILABLE PROGRAM ROW - Premium
// ============================================
const AvailableProgramRowPremium = memo(function AvailableProgramRowPremium({
  program,
  index
}: {
  program: Program;
  index: number;
}) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ x: 6 }}
      onClick={() => navigate(`/programs/${program.slug}`)}
      className="group relative flex items-center gap-4 p-4 bg-card dark:bg-card rounded-[18px] shadow-md shadow-gray-100 dark:shadow-none border border-border cursor-pointer overflow-hidden"
    >
      {/* Accent line */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 rounded-r-full bg-gradient-to-b from-[#2791E0] to-[#76B9FF] group-hover:h-[60%] transition-all duration-300" />

      {/* Thumbnail */}
      <div className="w-16 h-16 rounded-[12px] overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 flex-shrink-0 shadow-sm">
        {program.cover_image_url ? (
          <img
            src={program.cover_image_url}
            alt={program.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-blue-300" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="text-[16px] font-bold text-foreground mb-0.5 group-hover:text-[#2791E0] transition-colors">
          {program.title}
        </h4>
        <div className="flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-[14px] text-muted-foreground">{program.total_lessons} lessons</span>
        </div>
      </div>

      {/* Arrow with animation */}
      <motion.div
        animate={{ x: [0, 4, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
        className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2791E0]/10 to-[#76B9FF]/10 flex items-center justify-center group-hover:from-[#2791E0] group-hover:to-[#76B9FF] transition-all"
      >
        <ChevronRight className="w-5 h-5 text-[#2791E0] group-hover:text-white transition-colors" />
      </motion.div>
    </motion.div>
  );
});

// ============================================
// SKELETON - Premium
// ============================================
const ProgramsSkeletonPremium = memo(function ProgramsSkeletonPremium() {
  return (
    <div className="px-5 pt-6 space-y-8">
      {/* Current */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-[12px] bg-orange-100 animate-pulse" />
          <div className="h-7 w-40 bg-muted rounded-lg animate-pulse" />
        </div>
        <div className="bg-card dark:bg-card rounded-[20px] p-5 shadow-lg dark:shadow-none border border-border">
          <div className="flex justify-between mb-4">
            <div className="h-5 w-32 bg-muted rounded animate-pulse" />
            <div className="h-8 w-20 bg-orange-50 rounded-full animate-pulse" />
          </div>
          <div className="h-7 w-56 bg-muted rounded animate-pulse mb-4" />
          <div className="aspect-[16/9] bg-muted rounded-[16px] animate-pulse mb-4" />
          <div className="h-4 w-full bg-muted rounded animate-pulse mb-2" />
          <div className="h-4 w-3/4 bg-muted rounded animate-pulse mb-5" />
          <div className="h-14 bg-gradient-to-r from-orange-100 to-amber-100 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Grid */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-[12px] bg-cyan-100 animate-pulse" />
          <div className="h-7 w-48 bg-muted rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2].map(i => (
            <div key={i} className="bg-card dark:bg-card rounded-[20px] overflow-hidden shadow-lg dark:shadow-none border border-border animate-pulse">
              <div className="aspect-square bg-gradient-to-br from-pink-50 to-rose-100" />
              <div className="p-4 space-y-3">
                <div className="h-5 w-full bg-muted rounded" />
                <div className="h-10 bg-orange-100 rounded-full" />
                <div className="h-10 bg-muted rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

// ============================================
// EMPTY STATE
// ============================================
const EmptyStatePremium = memo(function EmptyStatePremium() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-20 text-center"
    >
      <motion.div
        animate={{ y: [-5, 5, -5], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="relative w-24 h-24 mx-auto mb-6"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-orange-200 to-amber-200 rounded-full blur-xl opacity-60" />
        <div className="relative w-full h-full rounded-full bg-gradient-to-br from-[#FF6631] to-[#FFA300] flex items-center justify-center shadow-xl">
          <BookOpen className="w-11 h-11 text-white" />
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-1 -right-1"
        >
          <Star className="w-6 h-6 text-[#FFA300] fill-[#FFA300]" />
        </motion.div>
      </motion.div>
      <h3 className="text-[20px] font-bold bg-gradient-to-r from-[#FF6631] to-[#FFA300] bg-clip-text text-transparent mb-2">
        No Programs Yet
      </h3>
      <p className="text-[15px] text-muted-foreground max-w-[260px] mx-auto">
        Your learning journey is about to begin! Programs will appear here soon.
      </p>
      <div className="flex justify-center gap-2 mt-6">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
            className="w-2 h-2 rounded-full bg-gradient-to-r from-[#FF6631] to-[#FFA300]"
          />
        ))}
      </div>
    </motion.div>
  );
});

// ============================================
// MAIN PAGE
// ============================================
export default function Programs() {
  const { data, isLoading } = usePrograms();
  const isOnline = useOnlineStatus();

  const counts = useMemo(() => ({
    current: data?.current?.length || 0,
    available: data?.available?.length || 0,
    comingSoon: data?.comingSoon?.length || 0,
    completed: data?.completed?.length || 0,
  }), [data]);

  const hasPrograms = counts.current + counts.available + counts.comingSoon + counts.completed > 0;

  return (
    <MainLayout>
      <div className="min-h-screen bg-background pb-32">
        {/* Safe area */}
        <div style={{ height: 'env(safe-area-inset-top)' }} />

        {/* Offline */}
        <AnimatePresence>
          {!isOnline && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-3 text-center text-sm font-semibold"
            >
              <WifiOff className="w-4 h-4 inline mr-2" />
              You're offline
            </motion.div>
          )}
        </AnimatePresence>

        {isLoading ? (
          <ProgramsSkeletonPremium />
        ) : (
          <div className="px-5 pt-6 space-y-10">

            {/* CURRENT PROGRAM */}
            {data?.current && data.current.length > 0 && (
              <section>
                <SectionHeader
                  icon={<Flame className="w-5 h-5 text-white" />}
                  iconGradient="from-[#FF6631] to-[#FFA300] shadow-orange-500/40"
                  title="Current Program"
                  badge="IN PROGRESS"
                />
                {data.current.map(program => (
                  <CurrentProgramCardPremium key={program.id} program={program} />
                ))}
              </section>
            )}

            {/* AVAILABLE PROGRAMS */}
            {data?.available && data.available.length > 0 && (
              <section>
                <SectionHeader
                  icon={<BookOpen className="w-5 h-5 text-white" />}
                  iconGradient="from-[#2791E0] to-[#76B9FF] shadow-blue-500/30"
                  title="Start a New Program"
                />
                <div className="space-y-3">
                  {data.available.map((program, index) => (
                    <AvailableProgramRowPremium key={program.id} program={program} index={index} />
                  ))}
                </div>
              </section>
            )}

            {/* UPCOMING PROGRAMS */}
            {data?.comingSoon && data.comingSoon.length > 0 && (
              <section className="pt-4">
                {/* Visual separator */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#E8DFD8] to-transparent" />
                  <span className="text-[11px] text-[#B8A99A] font-semibold uppercase tracking-widest">Coming Soon</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#E8DFD8] to-transparent" />
                </div>

                <SectionHeader
                  icon={<Clock className="w-5 h-5 text-white" />}
                  iconGradient="from-cyan-500 to-teal-500 shadow-cyan-500/30"
                  title="Upcoming Programs"
                  badge="VOTE"
                />
                <div className="grid grid-cols-2 gap-4">
                  {data.comingSoon.map((program, index) => (
                    <UpcomingProgramCardPremium key={program.id} program={program} index={index} />
                  ))}
                </div>
              </section>
            )}

            {/* COMPLETED PROGRAMS */}
            {data?.completed && data.completed.length > 0 && (
              <section>
                <SectionHeader
                  icon={<CheckCircle className="w-5 h-5 text-white" />}
                  iconGradient="from-[#11C222] to-[#22D933] shadow-green-500/30"
                  title="Completed"
                  badge={`${counts.completed} DONE`}
                />
                <div className="space-y-3">
                  {data.completed.map((program, index) => (
                    <CompletedProgramCardPremium key={program.id} program={program} index={index} />
                  ))}
                </div>
              </section>
            )}

            {/* EMPTY */}
            {!hasPrograms && <EmptyStatePremium />}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
