import { memo, useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Book, ChevronLeft, Sparkles } from "lucide-react";
import { BonusData } from "@/types/bonus";
import { cn } from "@/lib/utils";

interface EbookShelfProps {
  title: string;
  items: BonusData[];
  onSelect: (bonus: BonusData) => void;
}

export const EbookShelf = memo(function EbookShelf({
  title,
  items,
  onSelect,
}: EbookShelfProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    el?.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);
    return () => {
      el?.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [items]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  if (!items.length) return null;

  return (
    <section className="mb-8 relative group/shelf">
      {/* Header */}
      <div className="flex items-center justify-between px-5 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/10">
            <Book className="w-4 h-4 text-blue-500" />
          </div>
          <h3 className="text-lg font-bold tracking-tight text-foreground">
            {title}
          </h3>
        </div>
        <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          See All
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      
      {/* Scroll Arrows */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-background/90 backdrop-blur-md shadow-lg flex items-center justify-center opacity-0 group-hover/shelf:opacity-100 transition-opacity hover:bg-background"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-background/90 backdrop-blur-md shadow-lg flex items-center justify-center opacity-0 group-hover/shelf:opacity-100 transition-opacity hover:bg-background"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Scrollable Container */}
      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 px-5 scrollbar-hide snap-x snap-mandatory scroll-smooth"
        style={{ contentVisibility: 'auto' }}
      >
        {items.map((item, idx) => (
          <EbookCard
            key={item.id}
            item={item}
            index={idx}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  );
});

// Extracted EbookCard for performance
const EbookCard = memo(function EbookCard({
  item,
  index,
  onSelect,
}: {
  item: BonusData;
  index: number;
  onSelect: (bonus: BonusData) => void;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "100px" }}
      transition={{ delay: Math.min(index * 0.05, 0.2), duration: 0.4 }}
      onClick={() => onSelect(item)}
      className="snap-start shrink-0 w-[140px] sm:w-[160px] group cursor-pointer"
    >
      {/* Book Cover */}
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-muted shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-2 group-hover:rotate-[-1deg]">
        {/* Skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-muted to-muted-foreground/10" />
        )}
        
        <img 
          src={item.thumbnail || "/placeholder.svg"} 
          alt={item.title}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={cn(
            "absolute inset-0 w-full h-full object-fill transition-transform duration-500 group-hover:scale-105",
            !imageLoaded && "opacity-0"
          )}
        />

        {/* Spine Effect */}
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-r from-black/30 to-transparent" />

        {/* Gloss Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10 pointer-events-none" />

        {/* New Badge */}
        {item.isNew && (
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-amber-500 text-[10px] font-bold text-black uppercase flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" />
            New
          </div>
        )}

        {/* Locked Overlay */}
        {item.locked && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
            <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-bold text-white border border-white/20">
              LOCKED
            </div>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
          <span className="text-white text-xs font-medium flex items-center gap-1">
            <Book className="w-3 h-3" />
            Read Now
          </span>
        </div>
      </div>

      {/* Title */}
      <div className="mt-2.5 px-0.5">
        <h4 className="font-semibold text-sm text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {item.title}
        </h4>
      </div>
    </motion.div>
  );
});
