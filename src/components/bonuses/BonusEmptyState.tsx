import { Card } from "@/components/ui/card";
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
  Filter
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
  },
  [BonusCategory.EBOOK]: {
    icon: BookOpen,
    name: "Ebooks",
    suggestion: "Check out our video content or downloadable PDFs",
  },
  [BonusCategory.PDF]: {
    icon: FileText,
    name: "PDFs",
    suggestion: "Explore our interactive tools or video guides",
  },
  [BonusCategory.TOOL]: {
    icon: Wrench,
    name: "Tools",
    suggestion: "Try our templates or educational ebooks",
  },
  [BonusCategory.TEMPLATE]: {
    icon: Layout,
    name: "Templates",
    suggestion: "Browse our tools or video tutorials",
  },
  [BonusCategory.SESSION]: {
    icon: Calendar,
    name: "Sessions",
    suggestion: "Explore our on-demand content like videos and ebooks",
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
      <Card className="p-12 text-center max-w-md mx-auto">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <BookOpen className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No Bonuses Yet</h3>
        <p className="text-muted-foreground mb-4">
          Bonuses will appear here as they become available. Check back soon!
        </p>
      </Card>
    );
  }

  const categoryData = selectedCategory 
    ? categoryInfo[selectedCategory as BonusCategory]
    : null;

  const Icon = categoryData?.icon || Search;

  return (
    <Card className="p-12 text-center max-w-md mx-auto">
      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      
      {searchQuery ? (
        <>
          <h3 className="text-xl font-semibold mb-2">No Results Found</h3>
          <p className="text-muted-foreground mb-4">
            No bonuses match your search for "{searchQuery}"
            {selectedCategory && ` in ${categoryData?.name}`}
          </p>
        </>
      ) : (
        <>
          <h3 className="text-xl font-semibold mb-2">
            No {categoryData?.name} Available
          </h3>
          <p className="text-muted-foreground mb-4">
            {categoryData?.suggestion}
          </p>
        </>
      )}

      <Button onClick={onClearFilters} variant="outline" className="gap-2">
        <Filter className="h-4 w-4" />
        Clear Filters
      </Button>
    </Card>
  );
};
