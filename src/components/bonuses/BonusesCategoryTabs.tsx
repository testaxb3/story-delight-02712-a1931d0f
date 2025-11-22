import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  SlidersHorizontal,
  Grid3x3,
  LayoutList,
  Play,
  BookOpen,
  FileText,
  Wrench,
  Sparkles
} from "lucide-react";
import { useState } from "react";
import { useHaptic } from "@/hooks/useHaptic";

interface BonusesCategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  categories: Array<{
    id: string;
    label: string;
    icon: any;
    count: number;
  }>;
}

export function BonusesCategoryTabs({
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  categories
}: BonusesCategoryTabsProps) {
  const [showFilters, setShowFilters] = useState(false);
  const { triggerHaptic } = useHaptic();

  return (
    <div className="space-y-4 mb-6">
      {/* Premium Category Pills */}
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
        >
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            const isActive = activeCategory === category.id;
            
            return (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  triggerHaptic('light');
                  onCategoryChange(category.id);
                }}
                className={`
                  relative flex items-center gap-2 px-4 py-2 rounded-2xl whitespace-nowrap
                  transition-all duration-200 border border-transparent
                  ${isActive 
                    ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.15)] font-semibold' 
                    : 'bg-[#1C1C1E] text-gray-400 border-[#333] hover:bg-[#2C2C2E] hover:text-white'
                  }
                `}
              >
                <IconComponent className={`w-4 h-4 ${isActive ? 'text-black' : 'text-gray-500'}`} />
                <span className="text-sm">{category.label}</span>
                
                {/* Count Badge */}
                <span className={`
                    px-1.5 py-0.5 rounded text-[10px] font-bold ml-1
                    ${isActive 
                      ? 'bg-black text-white' 
                      : 'bg-[#2C2C2E] text-gray-500'
                    }
                  `}
                >
                  {category.count}
                </span>
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      {/* Premium Search and Filters Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col md:flex-row gap-3"
      >
        {/* Premium Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          <Input
            placeholder="Search bonuses..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-11 bg-[#1C1C1E] border-[#333] text-white placeholder:text-gray-600 rounded-xl focus:border-white/20 focus:ring-0 transition-all"
          />
        </div>

        {/* Premium Sort Dropdown */}
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-full md:w-[200px] h-11 bg-[#1C1C1E] border-[#333] text-white rounded-xl focus:ring-0">
            <SlidersHorizontal className="w-4 h-4 mr-2 text-gray-500" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-[#1C1C1E] border-[#333] text-white rounded-xl">
            <SelectItem value="newest">
              <span className="flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-purple-400" />
                Newest First
              </span>
            </SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="title">Title A-Z</SelectItem>
            <SelectItem value="progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        {/* Premium View Mode Toggle */}
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onViewModeChange("grid")}
            className={`
              h-11 w-11 rounded-xl border transition-all duration-200
              ${viewMode === "grid" 
                ? 'bg-[#2C2C2E] text-white border-[#444]' 
                : 'bg-[#1C1C1E] text-gray-500 border-[#333] hover:text-white'
              }
            `}
          >
            <Grid3x3 className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onViewModeChange("list")}
            className={`
              h-11 w-11 rounded-xl border transition-all duration-200
              ${viewMode === "list" 
                ? 'bg-[#2C2C2E] text-white border-[#444]' 
                : 'bg-[#1C1C1E] text-gray-500 border-[#333] hover:text-white'
              }
            `}
          >
            <LayoutList className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      {/* Advanced Filters (collapsible) */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-secondary/30 backdrop-blur-sm rounded-lg p-4 space-y-3 border-2"
        >
          <h4 className="font-semibold flex items-center gap-2 text-sm">
            <SlidersHorizontal className="w-4 h-4" />
            Advanced Filters
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="locked">Locked</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Duration</SelectItem>
                <SelectItem value="short">Under 10 min</SelectItem>
                <SelectItem value="medium">10-30 min</SelectItem>
                <SelectItem value="long">Over 30 min</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Formats</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="interactive">Interactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end">
            <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
              Clear Filters
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
