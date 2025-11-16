import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Grid3x3, List, SlidersHorizontal, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

type FilterType = 'all' | 'watched' | 'unwatched' | 'in-progress' | 'bookmarked';

interface VideoCategoryTabsProps {
  sections: string[];
  sectionFilter: string;
  setSectionFilter: (section: string) => void;
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  sortNewest: boolean;
  setSortNewest: (sort: boolean) => void;
  videoCounts: Record<string, number>;
}

export function VideoCategoryTabs({
  sections,
  sectionFilter,
  setSectionFilter,
  filter,
  setFilter,
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  sortNewest,
  setSortNewest,
  videoCounts,
}: VideoCategoryTabsProps) {
  const filterOptions: { value: FilterType; label: string; count?: number }[] = [
    { value: 'all', label: 'All Videos', count: videoCounts.all },
    { value: 'unwatched', label: 'Unwatched', count: videoCounts.unwatched },
    { value: 'in-progress', label: 'In Progress', count: videoCounts.inProgress },
    { value: 'watched', label: 'Completed', count: videoCounts.watched },
    { value: 'bookmarked', label: 'Bookmarked', count: videoCounts.bookmarked },
  ];

  return (
    <div className="space-y-4">
      {/* Search and Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bonus-glass pl-10 border-border/40 focus:border-primary/50"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={sortNewest ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortNewest(!sortNewest)}
            className="bonus-glass border-border/40 gap-2"
          >
            <Sparkles className="h-4 w-4" />
            Newest First
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="bonus-glass border-border/40"
          >
            {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3x3 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        {filterOptions.map((option) => (
          <motion.div
            key={option.value}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant={filter === option.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(option.value)}
              className={`
                relative overflow-hidden transition-all duration-300
                ${filter === option.value 
                  ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-0 shadow-lg shadow-primary/50' 
                  : 'bonus-glass border-border/40 hover:border-primary/50'
                }
              `}
            >
              {filter === option.value && (
                <motion.div
                  layoutId="activeFilter"
                  className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {option.label}
                {option.count !== undefined && (
                  <Badge 
                    variant="secondary" 
                    className={`
                      ${filter === option.value 
                        ? 'bg-primary-foreground/20 text-primary-foreground' 
                        : 'bg-primary/10 text-primary animate-pulse'
                      }
                    `}
                  >
                    {option.count}
                  </Badge>
                )}
              </span>
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Section Pills */}
      <div className="flex flex-wrap gap-2">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant={sectionFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSectionFilter('all')}
            className={`
              relative overflow-hidden transition-all duration-300
              ${sectionFilter === 'all' 
                ? 'bg-gradient-to-r from-secondary to-secondary/80 border-0 shadow-lg shadow-secondary/50' 
                : 'bonus-glass border-border/40 hover:border-secondary/50'
              }
            `}
          >
            {sectionFilter === 'all' && (
              <motion.div
                layoutId="activeSection"
                className="absolute inset-0 bg-gradient-to-r from-secondary to-secondary/80"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">All Sections</span>
          </Button>
        </motion.div>

        {sections.map((section) => (
          <motion.div
            key={section}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant={sectionFilter === section ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSectionFilter(section)}
              className={`
                relative overflow-hidden transition-all duration-300
                ${sectionFilter === section 
                  ? 'bg-gradient-to-r from-secondary to-secondary/80 border-0 shadow-lg shadow-secondary/50' 
                  : 'bonus-glass border-border/40 hover:border-secondary/50'
                }
              `}
            >
              {sectionFilter === section && (
                <motion.div
                  layoutId="activeSection"
                  className="absolute inset-0 bg-gradient-to-r from-secondary to-secondary/80"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{section}</span>
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
