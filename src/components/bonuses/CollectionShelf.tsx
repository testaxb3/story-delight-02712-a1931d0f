import { memo, useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Play, Clock, Zap, Brain, Heart, Flame, Sparkles, Star, Folder, ChevronLeft } from "lucide-react";
import { BonusData } from "@/types/bonus";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface CollectionShelfProps {
  title: string;
  slug?: string;
  iconName?: string;
  items: BonusData[];
  onSelect: (bonus: BonusData) => void;
  variant?: 'standard' | 'compact' | 'spotlight';
  showSeeAll?: boolean;
}

const iconMap: Record<string, typeof Zap> = {
  zap: Zap,
  brain: Brain,
  heart: Heart,
  flame: Flame,
  sparkles: Sparkles,
  star: Star,
  folder: Folder,
};

export const CollectionShelf = memo(function CollectionShelf({
  title,
  slug,
  iconName = 'folder',
  items,
  onSelect,
  variant = 'standard',
  showSeeAll = true,
}: CollectionShelfProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const Icon = iconMap[iconName] || Folder;

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

  const cardWidth = variant === 'compact' ? 'w-[140px]' : variant === 'spotlight' ? 'w-[300px]' : 'w-[200px] sm:w-[240px]';
  const aspectRatio = variant === 'compact' ? 'aspect-video' : 'aspect-video';

  return (
    <section className="mb-8 relative group/shelf">
      {/* Header */}
      <div className="flex items-center justify-between px-5 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <Icon className="w-4 h-4 text-primary" />
          </div>
          <h3 className="text-lg font-bold tracking-tight text-foreground">
            {title}
          </h3>
        </div>
        {showSeeAll && slug && (
          <Link 
            to={`/bonuses/collection/${slug}`}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            See All
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>
      
      {/* Scroll Arrows (Desktop) */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-background/90 backdrop-blur-md shadow-lg flex items-center justify-center opacity-0 group-hover/shelf:opacity-100 transition-opacity hover:bg-background"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-background/90 backdrop-blur-md shadow-lg flex items-center justify-center opacity-0 group-hover/shelf:opacity-100 transition-opacity hover:bg-background"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Scrollable Container */}
      <div 
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-4 px-5 scrollbar-hide snap-x snap-mandatory scroll-smooth"
        style={{ contentVisibility: 'auto' }}
      >
        {items.map((item, idx) => (
          <VideoCard
            key={item.id}
            item={item}
            index={idx}
            variant={variant}
            cardWidth={cardWidth}
            aspectRatio={aspectRatio}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  );
});

// Extracted VideoCard for performance
const VideoCard = memo(function VideoCard({
  item,
  index,
  variant,
  cardWidth,
  aspectRatio,
  onSelect,
}: {
  item: BonusData;
  index: number;
  variant: string;
  cardWidth: string;
  aspectRatio: string;
  onSelect: (bonus: BonusData) => void;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "100px" }}
      transition={{ delay: Math.min(index * 0.03, 0.15), duration: 0.3 }}
      onClick={() => onSelect(item)}
      className={cn(
        "snap-start shrink-0 group cursor-pointer",
        cardWidth
      )}
    >
      {/* Thumbnail */}
      <div className={cn(
        "relative overflow-hidden rounded-xl bg-muted transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1",
        aspectRatio
      )}>
        {/* Skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-muted" />
        )}
        
        <img 
          src={item.thumbnail || "/placeholder.svg"} 
          alt={item.title}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-105",
            !imageLoaded && "opacity-0"
          )}
        />
        
        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-5 h-5 text-black fill-black ml-0.5" />
          </div>
        </div>

        {/* Duration Badge */}
        {item.duration && (
          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] font-medium text-white flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" />
            {item.duration}
          </div>
        )}

        {/* New Badge */}
        {item.isNew && (
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-amber-500 text-[10px] font-bold text-black uppercase">
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
      </div>

      {/* Title */}
      <div className="mt-2 px-0.5">
        <h4 className={cn(
          "font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors",
          variant === 'compact' ? "text-xs" : "text-sm"
        )}>
          {item.title}
        </h4>
        {variant === 'spotlight' && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {item.description}
          </p>
        )}
      </div>
    </motion.div>
  );
});
