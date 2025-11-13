import { forwardRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Grid3x3,
  List,
  X,
  Clock,
  Sparkles,
  TrendingUp,
  AlphabeticalSort,
} from 'lucide-react';

export type SortOption = 'relevance' | 'recent' | 'popular' | 'alphabetical';
export type ViewMode = 'grid' | 'list';

interface ScriptsFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  placeholder?: string;
  showAdvanced?: boolean;
}

const SORT_OPTIONS = [
  { value: 'relevance' as const, label: 'Most Relevant', icon: Sparkles },
  { value: 'recent' as const, label: 'Recently Added', icon: Clock },
  { value: 'popular' as const, label: 'Most Popular', icon: TrendingUp },
  { value: 'alphabetical' as const, label: 'A-Z', icon: AlphabeticalSort },
];

export const ScriptsFilters = forwardRef<HTMLInputElement, ScriptsFiltersProps>(
  (
    {
      searchQuery,
      onSearchChange,
      sortBy,
      onSortChange,
      viewMode,
      onViewModeChange,
      placeholder = 'Search scripts...',
      showAdvanced = false,
    },
    ref
  ) => {
    const [showFilters, setShowFilters] = useState(false);

    const selectedSort = SORT_OPTIONS.find((opt) => opt.value === sortBy);

    return (
      <div className="space-y-3">
        {/* Main Filter Bar */}
        <div className="flex gap-2">
          {/* Search */}
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground group-focus-within:text-primary w-5 h-5 transition-colors z-10" />
            <Input
              ref={ref}
              placeholder={placeholder}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-12 pr-10 h-12 text-base border-2 transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 shadow-sm focus:shadow-lg"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-12 px-4 border-2 gap-2 min-w-[140px]"
              >
                {selectedSort && <selectedSort.icon className="w-4 h-4" />}
                <span className="hidden sm:inline">Sort</span>
                <ArrowUpDown className="w-4 h-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {SORT_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => onSortChange(option.value)}
                  className={`gap-2 ${sortBy === option.value ? 'bg-accent' : ''}`}
                >
                  <option.icon className="w-4 h-4" />
                  {option.label}
                  {sortBy === option.value && (
                    <Badge variant="secondary" className="ml-auto">
                      Active
                    </Badge>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* View Mode Toggle */}
          <div className="flex border-2 border-border rounded-lg overflow-hidden">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => onViewModeChange('grid')}
              className="h-12 w-12 rounded-none border-0"
              aria-label="Grid view"
            >
              <Grid3x3 className="w-5 h-5" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => onViewModeChange('list')}
              className="h-12 w-12 rounded-none border-0"
              aria-label="List view"
            >
              <List className="w-5 h-5" />
            </Button>
          </div>

          {/* Advanced Filters Toggle (Optional) */}
          {showAdvanced && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className={`h-12 w-12 border-2 ${showFilters ? 'bg-accent' : ''}`}
              aria-label="Toggle advanced filters"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </Button>
          )}
        </div>

        {/* Active Filters Display */}
        {(searchQuery || sortBy !== 'relevance') && (
          <div className="flex flex-wrap gap-2 items-center animate-in fade-in slide-in-from-top-2 duration-200">
            <span className="text-xs text-muted-foreground font-medium">
              Active filters:
            </span>
            {searchQuery && (
              <Badge
                variant="secondary"
                className="gap-1 pr-1 cursor-pointer hover:bg-secondary/80"
                onClick={() => onSearchChange('')}
              >
                Search: "{searchQuery.length > 20 ? searchQuery.slice(0, 20) + '...' : searchQuery}"
                <X className="w-3 h-3" />
              </Badge>
            )}
            {sortBy !== 'relevance' && (
              <Badge
                variant="secondary"
                className="gap-1 pr-1 cursor-pointer hover:bg-secondary/80"
                onClick={() => onSortChange('relevance')}
              >
                Sort: {selectedSort?.label}
                <X className="w-3 h-3" />
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onSearchChange('');
                onSortChange('relevance');
              }}
              className="h-6 px-2 text-xs"
            >
              Clear all
            </Button>
          </div>
        )}

        {/* Advanced Filters Panel (Collapsed by default) */}
        {showAdvanced && showFilters && (
          <div className="p-4 bg-muted/30 rounded-lg border-2 border-border animate-in fade-in slide-in-from-top-4 duration-300">
            <p className="text-sm text-muted-foreground">
              Advanced filters coming soon...
            </p>
          </div>
        )}
      </div>
    );
  }
);

ScriptsFilters.displayName = 'ScriptsFilters';
