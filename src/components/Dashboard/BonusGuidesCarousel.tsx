import { memo } from 'react';
import { motion } from 'framer-motion';
import { Book, Play, ChevronRight } from 'lucide-react';
import { SPRING, itemVariants } from './animations';

interface Ebook {
  id: string;
  slug: string;
  title: string;
  thumbnail?: string;
  isStarted?: boolean;
}

interface BonusGuidesCarouselProps {
  ebooks: Ebook[];
  onEbookPress: (slug: string) => void;
  onSeeAll: () => void;
}

export const BonusGuidesCarousel = memo(function BonusGuidesCarousel({
  ebooks,
  onEbookPress,
  onSeeAll,
}: BonusGuidesCarouselProps) {
  if (ebooks.length === 0) return null;

  return (
    <motion.div variants={itemVariants}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-foreground">Bonus Guides</h3>
        <motion.button
          whileHover={{ x: 3 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSeeAll}
          className="flex items-center gap-1 text-sm text-muted-foreground"
        >
          See all
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide">
        {ebooks.slice(0, 5).map((ebook, index) => (
          <motion.button
            key={ebook.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, ...SPRING.gentle }}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onEbookPress(ebook.slug)}
            className="relative min-w-[130px] w-[130px] flex-shrink-0"
            style={{ perspective: 1000 }}
          >
            {/* Book cover with 3D effect */}
            <div
              className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-2xl border-[3px] border-white/20 dark:border-white/10"
              style={{
                transformStyle: 'preserve-3d',
                boxShadow: '0 15px 30px -8px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)',
              }}
            >
              {ebook.thumbnail ? (
                <img
                  src={ebook.thumbnail}
                  alt={ebook.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Book className="w-8 h-8 text-white dark:text-white/50" />
                </div>
              )}

              {/* Shine overlay */}
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)',
                }}
              />
            </div>

            {/* Title */}
            <h4 className="mt-2 text-xs font-medium text-foreground/90 line-clamp-2 text-left h-8 leading-tight">
              {ebook.title}
            </h4>

            {/* Continue Button */}
            {ebook.isStarted && (
              <div className="mt-2 flex">
                <div className="bg-primary/10 text-primary dark:text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                  <Play className="w-2 h-2 fill-current" /> Continue
                </div>
              </div>
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
});
