import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BonusCategory } from "@/types/bonus";
import {
  Video,
  BookOpen,
  FileText,
  Wrench,
  Layout,
  Calendar,
  Search,
  Filter,
  Sparkles,
  Gift
} from "lucide-react";

interface BonusEmptyStateProps {
  selectedCategory: string | null;
  searchQuery: string;
  onClearFilters: () => void;
}

const categoryInfo = {
  [BonusCategory.VIDEO]: {
    icon: Video,
    name: "Videos",
    suggestion: "Try exploring our ebooks or templates instead",
    color: "from-purple-500 to-indigo-500",
  },
  [BonusCategory.EBOOK]: {
    icon: BookOpen,
    name: "Ebooks",
    suggestion: "Check out our video content or downloadable PDFs",
    color: "from-emerald-500 to-teal-500",
  },
  [BonusCategory.PDF]: {
    icon: FileText,
    name: "PDFs",
    suggestion: "Explore our interactive tools or video guides",
    color: "from-blue-500 to-cyan-500",
  },
  [BonusCategory.TOOL]: {
    icon: Wrench,
    name: "Tools",
    suggestion: "Try our templates or educational ebooks",
    color: "from-amber-500 to-orange-500",
  },
  [BonusCategory.TEMPLATE]: {
    icon: Layout,
    name: "Templates",
    suggestion: "Browse our tools or video tutorials",
    color: "from-pink-500 to-rose-500",
  },
  [BonusCategory.SESSION]: {
    icon: Calendar,
    name: "Sessions",
    suggestion: "Explore our on-demand content like videos and ebooks",
    color: "from-violet-500 to-purple-500",
  },
};

export const BonusEmptyState = ({
  selectedCategory,
  searchQuery,
  onClearFilters
}: BonusEmptyStateProps) => {
  const hasFilters = selectedCategory || searchQuery;

  if (!hasFilters) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-5 py-16 text-center"
      >
        {/* Animated Gift Icon */}
        <motion.div
          animate={{
            y: [-8, 8, -8],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="relative w-28 h-28 mx-auto mb-6"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF6631]/40 to-[#FFA300]/40 rounded-[24px] blur-xl" />

          {/* Icon container */}
          <div className="relative w-full h-full rounded-[24px] bg-gradient-to-br from-[#FF6631] to-[#FFA300] flex items-center justify-center shadow-xl shadow-orange-500/30">
            <Gift className="w-14 h-14 text-white" />
          </div>

          {/* Floating sparkles */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-2 -right-2"
          >
            <Sparkles className="w-6 h-6 text-[#FFA300]" />
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            className="absolute -bottom-1 -left-1"
          >
            <Sparkles className="w-5 h-5 text-[#FF6631]" />
          </motion.div>
        </motion.div>

        <h3 className="text-2xl font-bold text-[#393939] mb-2">No Bonuses Yet</h3>
        <p className="text-[#8D8D8D] max-w-sm mx-auto leading-relaxed">
          Amazing bonus content will appear here as they become available. Check back soon!
        </p>

        {/* Animated dots */}
        <div className="flex justify-center gap-2 mt-6">
          {[0, 1, 2].map((i) => (
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
  }

  const categoryData = selectedCategory
    ? categoryInfo[selectedCategory as BonusCategory]
    : null;

  const Icon = categoryData?.icon || Search;
  const gradientColor = categoryData?.color || "from-[#FF6631] to-[#FFA300]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-5 py-16 text-center"
    >
      {/* Icon */}
      <motion.div
        animate={{ y: [-4, 4, -4] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="relative w-24 h-24 mx-auto mb-6"
      >
        <div className={`w-full h-full rounded-[20px] bg-gradient-to-br ${gradientColor} flex items-center justify-center shadow-lg opacity-20`}>
          <Icon className="w-12 h-12 text-white" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className="w-10 h-10 text-[#8D8D8D]" />
        </div>
      </motion.div>

      {searchQuery ? (
        <>
          <h3 className="text-xl font-bold text-[#393939] mb-2">No Results Found</h3>
          <p className="text-[#8D8D8D] mb-6 max-w-sm mx-auto">
            No bonuses match your search for "<span className="text-[#FF6631] font-medium">{searchQuery}</span>"
            {selectedCategory && ` in ${categoryData?.name}`}
          </p>
        </>
      ) : (
        <>
          <h3 className="text-xl font-bold text-[#393939] mb-2">
            No {categoryData?.name} Available
          </h3>
          <p className="text-[#8D8D8D] mb-6 max-w-sm mx-auto">
            {categoryData?.suggestion}
          </p>
        </>
      )}

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          onClick={onClearFilters}
          className="rounded-full bg-gradient-to-r from-[#FF6631] to-[#FFA300] text-white font-semibold px-6 h-11 shadow-lg shadow-orange-500/30 gap-2"
        >
          <Filter className="h-4 w-4" />
          Clear Filters
        </Button>
      </motion.div>
    </motion.div>
  );
};
