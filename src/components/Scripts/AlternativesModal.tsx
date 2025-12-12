import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Lightbulb, HelpCircle, ArrowRight } from "lucide-react";

interface AlternativesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  relatedScripts: Array<{
    id: string;
    title: string;
  }>;
  onNavigateToScript: (scriptId: string) => void;
  onOpenSOS?: () => void;
  onClose: () => void;
}

export const AlternativesModal = ({
  open,
  onOpenChange,
  relatedScripts,
  onNavigateToScript,
  onOpenSOS,
  onClose,
}: AlternativesModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            That's okay - every child is different
          </DialogTitle>
          <p className="text-muted-foreground mt-2">
            Try these alternatives:
          </p>
        </DialogHeader>
        <div className="space-y-6 py-4">

          {/* Alternatives List */}
          <div className="space-y-3">
            {/* Quick Tips */}
            <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
              <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
              <span className="text-sm">Try different tone or timing</span>
            </div>

            {/* Related Scripts */}
            {relatedScripts.length > 0 && (
              <>
                {relatedScripts.map((script) => (
                  <button
                    key={script.id}
                    onClick={() => {
                      onNavigateToScript(script.id);
                      onClose();
                    }}
                    className="w-full flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                  >
                    <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                    <div className="flex-1">
                      <span className="text-sm font-medium">{script.title}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  </button>
                ))}
              </>
            )}
          </div>

          {/* Pro Tip */}
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-sm text-blue-900 dark:text-blue-100">
                  Pro tip:
                </p>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Scripts work best when both parent and child are calm
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            {relatedScripts.length > 0 && (
              <Button
                onClick={() => {
                  if (relatedScripts.length > 0) {
                    onNavigateToScript(relatedScripts[0].id);
                    onClose();
                  }
                }}
                className="w-full"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Try Alternative
              </Button>
            )}
            {onOpenSOS && (
              <Button
                onClick={() => {
                  onOpenSOS();
                  onClose();
                }}
                variant="outline"
                className="w-full"
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                Get Help
              </Button>
            )}
            <Button
              onClick={onClose}
              variant="ghost"
              className="w-full"
            >
              Back to Script
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
