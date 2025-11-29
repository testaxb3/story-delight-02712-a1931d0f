import { useState, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Book, Wrench, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BonusData } from "@/types/bonus";
import { cn } from "@/lib/utils";

interface HeroCarouselProps {
  items: BonusData[];
  onAction: (bonus: BonusData) => void;
  autoRotateInterval?: number;
}

export const HeroCarousel = memo(function HeroCarousel({
  items,
  onAction,
  autoRotateInterval = 6000,
}: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const heroItems = items.slice(0, 5); // Max 5 items

  // Auto-rotate
  useEffect(() => {
    if (heroItems.length <= 1 || isPaused) return;
    
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % heroItems.length);
    }, autoRotateInterval);

    return () => clearInterval(timer);
  }, [heroItems.length, autoRotateInterval, isPaused]);

  const goTo = useCallback((index: number) => {
    setActiveIndex(index);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 10000); // Resume after 10s
  }, []);

  const goNext = useCallback(() => {
    goTo((activeIndex + 1) % heroItems.length);
  }, [activeIndex, heroItems.length, goTo]);

  const goPrev = useCallback(() => {
    goTo(activeIndex === 0 ? heroItems.length - 1 : activeIndex - 1);
  }, [activeIndex, heroItems.length, goTo]);

  if (!heroItems.length) return null;

  const current = heroItems[activeIndex];
  const isEbook = current.category === 'ebook';

  const getActionLabel = (cat: string) => {
    switch(cat) {
      case 'video': return 'Watch Now';
      case 'ebook': return 'Read Now';
      case 'tool': return 'Open Tool';
      default: return 'View Now';
    }
  };

  const getActionIcon = (cat: string) => {
    switch(cat) {
      case 'video': return Play;
      case 'ebook': return Book;
      case 'tool': case 'template': return Wrench;
      default: return Sparkles;
    }
  };

  const Icon = getActionIcon(current.category);

  return (
    <div 
      className="relative w-full aspect-[4/5] sm:aspect-[16/9] overflow-hidden group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute inset-0"
        >
          {/* Background */}
          <div className="absolute inset-0 overflow-hidden">
            <img 
              src={current.thumbnail || ""} 
              alt={current.title} 
              className={cn(
                "absolute inset-0 w-full h-full object-cover transition-transform duration-[10s] scale-105 group-hover:scale-110",
                isEbook && "blur-3xl scale-125 opacity-50"
              )}
            />
            {/* Gradient Overlay */}
            <div className={cn(
              "absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/90",
              isEbook && "bg-black/40"
            )} />
          </div>
          
          {/* Content */}
          <div 
            className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 pb-[calc(3rem+env(safe-area-inset-bottom))] cursor-pointer"
            onClick={() => onAction(current)}
          >
            <div className="w-full max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
              
              {/* Ebook Cover */}
              {isEbook && (
                <motion.div 
                  initial={{ opacity: 0, y: 20, rotate: -5 }}
                  animate={{ opacity: 1, y: 0, rotate: -2 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="w-[130px] sm:w-[160px] aspect-[3/4] rounded-lg shadow-2xl overflow-hidden border border-white/10 flex-shrink-0"
                >
                  <img 
                    src={current.thumbnail || ""} 
                    alt={current.title} 
                    className="w-full h-full object-fill"
                  />
                </motion.div>
              )}

              {/* Text */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="flex-1"
              >
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-white mb-3 uppercase tracking-widest">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  Featured
                </span>
                
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white mb-2 leading-tight drop-shadow-lg line-clamp-2">
                  {current.title}
                </h1>
                
                <p className="text-white/80 text-sm sm:text-base line-clamp-2 mb-4 max-w-lg drop-shadow-md">
                  {current.description}
                </p>
                
                <Button 
                  size="lg" 
                  className="rounded-full bg-white text-black hover:bg-white/90 font-bold px-6 sm:px-8 h-11 sm:h-12 shadow-xl transition-transform active:scale-95"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAction(current);
                  }}
                >
                  <Icon className="w-5 h-5 mr-2 fill-current" />
                  {getActionLabel(current.category)}
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {heroItems.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/50"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/50"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {heroItems.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {heroItems.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => { e.stopPropagation(); goTo(idx); }}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                idx === activeIndex 
                  ? "w-8 bg-white" 
                  : "w-1.5 bg-white/40 hover:bg-white/60"
              )}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {heroItems.length > 1 && !isPaused && (
        <motion.div 
          className="absolute bottom-0 left-0 h-0.5 bg-white/80"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: autoRotateInterval / 1000, ease: "linear" }}
          key={`progress-${activeIndex}`}
        />
      )}
    </div>
  );
});
