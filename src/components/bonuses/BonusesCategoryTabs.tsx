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
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onCategoryChange(category.id)}
                className={`
                  relative flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap
                  transition-all duration-300 border-2
                  ${isActive 
                    ? 'bg-gradient-to-r from-primary to-accent text-white border-transparent shadow-glow' 
                    : 'bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 hover:bg-card/80'
                  }
                `}
              >
                <IconComponent className={`w-4 h-4 ${isActive ? 'animate-pulse' : ''}`} />
                <span className="font-medium">{category.label}</span>
                
                {/* Count Badge with Pulse */}
                <motion.span
                  animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={`
                    px-2 py-0.5 rounded-full text-xs font-bold
                    ${isActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-primary/10 text-primary'
                    }
                  `}
                >
                  {category.count}
                </motion.span>
                
                {/* Active Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeCategory"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
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
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search bonuses..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bonus-glass border-2 border-border/50 focus:border-primary/80 transition-all"
          />
        </div>

        {/* Premium Sort Dropdown */}
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-full md:w-[200px] bonus-glass border-2 border-border/50 hover:border-primary/50 transition-all">
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bonus-glass backdrop-blur-xl">
            <SelectItem value="newest">
              <span className="flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-primary" />
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
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => onViewModeChange("grid")}
              className={`
                border-2 transition-all duration-300
                ${viewMode === "grid" 
                  ? 'bg-gradient-to-r from-primary to-accent text-white border-transparent shadow-glow' 
                  : 'bonus-glass border-border/50 hover:border-primary/50'
                }
              `}
            >
              <Grid3x3 className="w-4 h-4" />
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => onViewModeChange("list")}
              className={`
                border-2 transition-all duration-300
                ${viewMode === "list" 
                  ? 'bg-gradient-to-r from-primary to-accent text-white border-transparent shadow-glow' 
                  : 'bonus-glass border-border/50 hover:border-primary/50'
                }
              `}
            >
              <LayoutList className="w-4 h-4" />
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className="bonus-glass border-2 border-border/50 hover:border-primary/50 transition-all"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </Button>
          </motion.div>
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
