import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useProcessLessons, useImportLessons, ProcessedLesson } from '@/hooks/useAdminLessons';
import { Loader2, Sparkles, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LessonImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = 'input' | 'processing' | 'preview' | 'importing';

export function LessonImportModal({ open, onOpenChange }: LessonImportModalProps) {
  const [jsonInput, setJsonInput] = useState('');
  const [step, setStep] = useState<Step>('input');
  const [processedLessons, setProcessedLessons] = useState<ProcessedLesson[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const processLessons = useProcessLessons();
  const importLessons = useImportLessons();

  const handleProcess = async () => {
    setError(null);
    
    try {
      const parsed = JSON.parse(jsonInput);
      const lessons = Array.isArray(parsed) ? parsed : parsed.lessons || parsed.data;
      
      if (!lessons || !Array.isArray(lessons)) {
        throw new Error('Invalid JSON structure. Expected array of lessons.');
      }
      
      setStep('processing');
      
      const result = await processLessons.mutateAsync(lessons);
      setProcessedLessons(result.lessons);
      setStep('preview');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to process JSON');
      setStep('input');
    }
  };

  const handleImport = async () => {
    setStep('importing');
    try {
      await importLessons.mutateAsync(processedLessons);
      onOpenChange(false);
      // Reset state
      setJsonInput('');
      setProcessedLessons([]);
      setStep('input');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to import lessons');
      setStep('preview');
    }
  };

  const handleClose = () => {
    if (step !== 'processing' && step !== 'importing') {
      onOpenChange(false);
      setJsonInput('');
      setProcessedLessons([]);
      setStep('input');
      setError(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Import Lessons with AI
          </DialogTitle>
        </DialogHeader>

        {step === 'input' && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Paste your raw JSON with lessons. AI will clean titles, format content, and generate summaries.
            </p>
            
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}
            
            <Textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='Paste JSON here... e.g. [{"Title": "...", "Body": "..."}]'
              className="min-h-[300px] font-mono text-xs"
            />
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleProcess} 
                disabled={!jsonInput.trim()}
                className="gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Process with AI
              </Button>
            </div>
          </div>
        )}

        {step === 'processing' && (
          <div className="py-12 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <div className="text-center">
              <p className="font-medium">Processing lessons with OpenAI...</p>
              <p className="text-sm text-muted-foreground">This may take a minute</p>
            </div>
          </div>
        )}

        {step === 'preview' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium">Processed {processedLessons.length} lessons</span>
            </div>
            
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}
            
            <ScrollArea className="h-[400px] border rounded-lg">
              <div className="p-4 space-y-3">
                {processedLessons.map((lesson) => (
                  <div 
                    key={lesson.day_number}
                    className="p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
                        Day {lesson.day_number}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {lesson.estimated_minutes} min
                      </span>
                    </div>
                    <h4 className="font-medium text-sm">{lesson.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {lesson.summary}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setStep('input')}>
                Back
              </Button>
              <Button onClick={handleImport} className="gap-2">
                <Upload className="w-4 h-4" />
                Import to Database
              </Button>
            </div>
          </div>
        )}

        {step === 'importing' && (
          <div className="py-12 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <div className="text-center">
              <p className="font-medium">Importing lessons to database...</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
