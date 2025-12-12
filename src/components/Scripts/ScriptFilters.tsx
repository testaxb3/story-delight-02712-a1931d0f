import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Sparkles } from "lucide-react";

interface ScriptFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
  brainProfile?: string | null;
  showTopPicks: boolean;
  onToggleTopPicks: (value: boolean) => void;
  totalCount: number;
  personalizedCount: number;
}

export const ScriptFilters = ({
  search,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  brainProfile,
  showTopPicks,
  onToggleTopPicks,
  totalCount,
  personalizedCount,
}: ScriptFiltersProps) => {
  const pills = ["all", ...categories];

  return (
    <aside className="sticky top-24 space-y-6">
      <div className="space-y-2">
        <label htmlFor="script-search" className="text-sm font-medium text-muted-foreground">
          Search scripts
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            id="script-search"
            placeholder="Bedtime, tantrums, screens..."
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Personalized for</p>
            <p className="text-lg font-semibold">
              {brainProfile ? `${brainProfile} Brain` : "Complete the quiz"}
            </p>
          </div>
          <Badge variant="secondary">{personalizedCount}/{totalCount}</Badge>
        </div>
        <Button
          variant={showTopPicks ? "default" : "outline"}
          className="w-full justify-center"
          onClick={() => onToggleTopPicks(!showTopPicks)}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          {showTopPicks ? "Showing Top Picks" : "View My Top 5"}
        </Button>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Categories</p>
        <div className="flex flex-wrap gap-2">
          {pills.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <Button
                key={category}
                variant={isSelected ? "default" : "outline"}
                className="rounded-full px-4"
                onClick={() => onCategoryChange(category)}
              >
                {category === "all" ? "All" : category}
              </Button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
