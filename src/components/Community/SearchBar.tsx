import React, { useState, useEffect } from 'react';
import { Search, X, Filter, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

export interface SearchFilters {
  query: string;
  brainTypes: string[];
  postTypes: string[];
  dateRange: 'all' | 'today' | 'week' | 'month';
}

interface SearchBarProps {
  onFiltersChange: (filters: SearchFilters) => void;
  placeholder?: string;
}

const BRAIN_TYPES = [
  { value: 'INTENSE', label: 'Intense', icon: '🧠' },
  { value: 'DISTRACTED', label: 'Distracted', icon: '⚡' },
  { value: 'DEFIANT', label: 'Defiant', icon: '💪' },
];

const POST_TYPES = [
  { value: 'win', label: 'Wins', icon: '🎉' },
  { value: 'help', label: 'Help', icon: '❓' },
  { value: 'general', label: 'General', icon: '💬' },
];

const DATE_RANGES = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
];

export function SearchBar({ onFiltersChange, placeholder = 'Search posts...' }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [brainTypes, setBrainTypes] = useState<string[]>([]);
  const [postTypes, setPostTypes] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Emit filters when they change
  useEffect(() => {
    onFiltersChange({
      query: debouncedQuery,
      brainTypes,
      postTypes,
      dateRange,
    });
  }, [debouncedQuery, brainTypes, postTypes, dateRange, onFiltersChange]);

  const toggleBrainType = (type: string) => {
    setBrainTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const togglePostType = (type: string) => {
    setPostTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const clearFilters = () => {
    setQuery('');
    setBrainTypes([]);
    setPostTypes([]);
    setDateRange('all');
  };

  const activeFiltersCount = brainTypes.length + postTypes.length + (dateRange !== 'all' ? 1 : 0);
  const hasActiveFilters = activeFiltersCount > 0 || query.trim().length > 0;

  return (
    <div className="space-y-3">
      {/* Search Input with Filters */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 pr-9"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Advanced Filters Button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 relative">
              <Filter className="w-4 h-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            {/* Brain Types */}
            <DropdownMenuLabel>Brain Type</DropdownMenuLabel>
            {BRAIN_TYPES.map((type) => (
              <DropdownMenuCheckboxItem
                key={type.value}
                checked={brainTypes.includes(type.value)}
                onCheckedChange={() => toggleBrainType(type.value)}
              >
                <span className="mr-2">{type.icon}</span>
                {type.label}
              </DropdownMenuCheckboxItem>
            ))}

            <DropdownMenuSeparator />

            {/* Post Types */}
            <DropdownMenuLabel>Post Type</DropdownMenuLabel>
            {POST_TYPES.map((type) => (
              <DropdownMenuCheckboxItem
                key={type.value}
                checked={postTypes.includes(type.value)}
                onCheckedChange={() => togglePostType(type.value)}
              >
                <span className="mr-2">{type.icon}</span>
                {type.label}
              </DropdownMenuCheckboxItem>
            ))}

            <DropdownMenuSeparator />

            {/* Date Range */}
            <DropdownMenuLabel>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date Range
              </div>
            </DropdownMenuLabel>
            {DATE_RANGES.map((range) => (
              <DropdownMenuCheckboxItem
                key={range.value}
                checked={dateRange === range.value}
                onCheckedChange={() => setDateRange(range.value as any)}
              >
                {range.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="ghost" size="icon" onClick={clearFilters}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Active Filters Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {query && (
            <Badge variant="secondary" className="gap-1">
              <Search className="w-3 h-3" />
              "{query}"
              <button
                onClick={() => setQuery('')}
                className="ml-1 hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}

          {brainTypes.map((type) => {
            const typeInfo = BRAIN_TYPES.find((t) => t.value === type);
            return (
              <Badge key={type} variant="secondary" className="gap-1">
                <span>{typeInfo?.icon}</span>
                {typeInfo?.label}
                <button
                  onClick={() => toggleBrainType(type)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            );
          })}

          {postTypes.map((type) => {
            const typeInfo = POST_TYPES.find((t) => t.value === type);
            return (
              <Badge key={type} variant="secondary" className="gap-1">
                <span>{typeInfo?.icon}</span>
                {typeInfo?.label}
                <button
                  onClick={() => togglePostType(type)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            );
          })}

          {dateRange !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              <Calendar className="w-3 h-3" />
              {DATE_RANGES.find((r) => r.value === dateRange)?.label}
              <button
                onClick={() => setDateRange('all')}
                className="ml-1 hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
