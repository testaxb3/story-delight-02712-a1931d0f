import { memo, useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, Play, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { BonusData } from "@/types/bonus";
import { cn } from "@/lib/utils";

interface QuickBitesShelfProps {
  items: BonusData[];
  onSelect: (bonus: BonusData) => void;
}

export const QuickBitesShelf = memo(function QuickBitesShelf({
  items,
  onSelect,
}: QuickBitesShelfProps) {
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
    return () => el?.removeEventListener('scroll', checkScroll);
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
          <div className="p-1.5 rounded-lg bg-amber-500/10">
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <h3 className="text-lg font-bold tracking-tight text-foreground">
            Quick Bites
          </h3>
          <span className="text-xs text-muted-foreground">Under 5 min</span>
        </div>
      </div>
      
      {/* Scroll Arrows */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-background/90 backdrop-blur-md shadow-lg flex items-center justify-center opacity-0 group-hover/shelf:opacity-100 transition-opacity"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-background/90 backdrop-blur-md shadow-lg flex items-center justify-center opacity-0 group-hover/shelf:opacity-100 transition-opacity"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {/* Scrollable Container - Compact Cards */}
      <div 
        ref={scrollRef}
        className="flex gap-2.5 overflow-x-auto pb-4 px-5 scrollbar-hide snap-x snap-mandatory scroll-smooth"
      >
        {items.map((item, idx) => (
          <QuickBiteCard
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

const QuickBiteCard = memo(function QuickBiteCard({
  item,
  index,
  onSelect,
}: {
  item: BonusData;
  index: number;
  onSelect: (bonus: BonusData) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "50px" }}
      transition={{ delay: Math.min(index * 0.02, 0.1), duration: 0.2 }}
      onClick={() => onSelect(item)}
      className="snap-start shrink-0 w-[130px] group cursor-pointer"
    >
      {/* Thumbnail - Square */}
      <div className="relative aspect-square rounded-xl overflow-hidden bg-muted transition-all duration-200 group-hover:shadow-lg group-hover:-translate-y-0.5">
        <img 
          src={item.thumbnail || "/placeholder.svg"} 
          alt={item.title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
            <Play className="w-4 h-4 text-black fill-black ml-0.5" />
          </div>
        </div>

        {/* Duration */}
        {item.duration && (
          <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-medium text-white flex items-center gap-0.5">
            <Clock className="w-2 h-2" />
            {item.duration}
          </div>
        )}

        {/* Zap Icon */}
        <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
          <Zap className="w-3 h-3 text-black fill-black" />
        </div>
      </div>

      {/* Title */}
      <h4 className="mt-1.5 text-xs font-medium text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors px-0.5">
        {item.title}
      </h4>
    </motion.div>
  );
});
