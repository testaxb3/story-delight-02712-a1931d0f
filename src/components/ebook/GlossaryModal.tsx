import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BookText, Search } from "lucide-react";
import { glossaryTerms, searchTerms, GlossaryTerm } from "@/data/glossary";
import { cn } from "@/lib/utils";

export const GlossaryModal = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(null);

  const allTerms = Object.values(glossaryTerms);
  const filteredTerms = searchQuery.length >= 2
    ? searchTerms(searchQuery)
    : allTerms;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-700/50 hover:from-purple-100 hover:to-blue-100 dark:hover:from-purple-900/30 dark:hover:to-blue-900/30 hover:border-purple-300 dark:hover:border-purple-600 text-purple-700 dark:text-purple-300 hover:text-purple-800 dark:hover:text-purple-200 shadow-sm hover:shadow-md transition-all"
        >
          <BookText className="w-4 h-4" />
          <span className="hidden md:inline font-medium">Glossary</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl font-display font-bold">
            Neuroscience Glossary
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Understanding the brain science behind your child's behavior
          </p>
        </DialogHeader>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search terms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex-1 overflow-hidden grid md:grid-cols-2 gap-4">
          {/* Terms List */}
          <div className="overflow-y-auto pr-2 space-y-2 max-h-[calc(85vh-200px)]">
            {filteredTerms.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">
                  No terms found matching "{searchQuery}"
                </p>
              </div>
            ) : (
              filteredTerms.map((term) => (
                <button
                  key={term.term}
                  onClick={() => setSelectedTerm(term)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border-2 transition-all",
                    "hover:border-primary/40 hover:bg-primary/5",
                    selectedTerm?.term === term.term
                      ? "border-primary/40 bg-primary/10 shadow-md"
                      : "border-border bg-card"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-foreground">
                      {term.term}
                    </h4>
                    {selectedTerm?.term === term.term && (
                      <Badge variant="default" className="shrink-0 bg-primary">
                        Selected
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {term.definition}
                  </p>
                </button>
              ))
            )}
          </div>

          {/* Definition Panel */}
          <div className="border-l pl-3 md:pl-4 overflow-y-auto max-h-[calc(85vh-200px)]">
            {selectedTerm ? (
              <div className="space-y-3 md:space-y-4">
                <div>
                  <h3 className="text-xl md:text-2xl font-display font-bold text-foreground mb-2">
                    {selectedTerm.term}
                  </h3>
                  <p className="text-base text-foreground/90 leading-relaxed">
                    {selectedTerm.definition}
                  </p>
                </div>

                {selectedTerm.relatedTerms && selectedTerm.relatedTerms.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-2">
                      Related Terms
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTerm.relatedTerms.map((relatedTermKey) => {
                        const relatedTerm = glossaryTerms[relatedTermKey];
                        if (!relatedTerm) return null;
                        return (
                          <Button
                            key={relatedTermKey}
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedTerm(relatedTerm)}
                            className="text-xs"
                          >
                            {relatedTerm.term}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <BookText className="w-12 h-12 md:w-16 md:h-16 text-muted-foreground/30 mx-auto mb-3 md:mb-4" />
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Select a term to view its definition
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Count */}
        <div className="text-xs text-muted-foreground text-center pt-2 border-t">
          Showing {filteredTerms.length} of {allTerms.length} terms
        </div>
      </DialogContent>
    </Dialog>
  );
};
