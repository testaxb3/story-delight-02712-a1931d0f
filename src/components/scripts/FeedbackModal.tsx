import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, TrendingUp, XCircle } from 'lucide-react';
import { useFeedback } from '@/hooks/useFeedback';
import { toast } from '@/components/ui/use-toast';

interface FeedbackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scriptId: string;
  scriptTitle: string;
  onWorked: () => void;
  onProgress: () => void;
  onNotYet: () => void;
}

export const FeedbackModal = ({
  open,
  onOpenChange,
  scriptId,
  scriptTitle,
  onWorked,
  onProgress,
  onNotYet,
}: FeedbackModalProps) => {
  const { submitFeedback, submitting } = useFeedback();
  const [selectedOutcome, setSelectedOutcome] = useState<'worked' | 'progress' | 'not_yet' | null>(null);

  const handleFeedback = async (outcome: 'worked' | 'progress' | 'not_yet') => {
    setSelectedOutcome(outcome);

    try {
      await submitFeedback(scriptId, outcome);

      // Close modal first
      onOpenChange(false);

      // Trigger appropriate response based on outcome
      if (outcome === 'worked') {
        onWorked();
      } else if (outcome === 'progress') {
        onProgress();
      } else {
        onNotYet();
      }
    } catch (error) {
      console.error('Failed to save feedback:', error);
      toast({
        title: 'Failed to save feedback',
        description: 'Please try again.',
        variant: 'destructive',
      });
      setSelectedOutcome(null);
    }
  };

  const handleSkip = () => {
    onOpenChange(false);
    setSelectedOutcome(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            How did it go?
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground mt-2">
            Your feedback helps us recommend better scripts
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-6">
          {/* Worked Button */}
          <Button
            onClick={() => handleFeedback('worked')}
            disabled={submitting && selectedOutcome !== 'worked'}
            className="w-full h-auto py-4 px-6 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          >
            <div className="flex items-center justify-center gap-3 w-full">
              <CheckCircle2 className="w-6 h-6" />
              <div className="flex flex-col items-start">
                <span className="text-lg">It Worked!</span>
                <span className="text-xs text-white/80 font-normal">
                  Script was successful
                </span>
              </div>
            </div>
          </Button>

          {/* Progress Button */}
          <Button
            onClick={() => handleFeedback('progress')}
            disabled={submitting && selectedOutcome !== 'progress'}
            className="w-full h-auto py-4 px-6 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          >
            <div className="flex items-center justify-center gap-3 w-full">
              <TrendingUp className="w-6 h-6" />
              <div className="flex flex-col items-start">
                <span className="text-lg">Some Progress</span>
                <span className="text-xs text-white/80 font-normal">
                  Getting there, keep trying
                </span>
              </div>
            </div>
          </Button>

          {/* Not Yet Button */}
          <Button
            onClick={() => handleFeedback('not_yet')}
            disabled={submitting && selectedOutcome !== 'not_yet'}
            className="w-full h-auto py-4 px-6 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          >
            <div className="flex items-center justify-center gap-3 w-full">
              <XCircle className="w-6 h-6" />
              <div className="flex flex-col items-start">
                <span className="text-lg">Not Yet</span>
                <span className="text-xs text-white/80 font-normal">
                  Need different approach
                </span>
              </div>
            </div>
          </Button>

          {/* Skip Button */}
          <Button
            onClick={handleSkip}
            disabled={submitting}
            variant="ghost"
            className="w-full mt-2 text-muted-foreground hover:text-foreground"
          >
            Skip for now
          </Button>
        </div>

        {submitting && (
          <div className="text-center text-sm text-muted-foreground mt-4">
            Saving your feedback...
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
