import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavigationButtonsProps {
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
}

export const NavigationButtons = ({
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
}: NavigationButtonsProps) => {
  return (
    <div className="flex items-center justify-between gap-4 mt-12 pt-8 border-t border-border">
      <Button
        variant="ghost"
        size="lg"
        onClick={onPrevious}
        disabled={!hasPrevious}
        className="smooth-transition disabled:opacity-50"
      >
        <ChevronLeft className="w-5 h-5 mr-2" />
        Anterior
      </Button>
      
      <Button
        size="lg"
        onClick={onNext}
        disabled={!hasNext}
        className="smooth-transition disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90"
      >
        Próximo
        <ChevronRight className="w-5 h-5 ml-2" />
      </Button>
    </div>
  );
};
