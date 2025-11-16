import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { fixEbookMarkdown, validateEbookMarkdown, previewMarkdownFixes } from '@/utils/ebookMarkdownFixer';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface EbookStatus {
  id: string;
  title: string;
  status: 'pending' | 'analyzing' | 'fixing' | 'success' | 'error';
  warnings: string[];
  errors: string[];
  changes: string[];
}

export const EbookMarkdownFixer = () => {
  const [ebooks, setEbooks] = useState<EbookStatus[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedEbook, setSelectedEbook] = useState<string | null>(null);
  const { toast } = useToast();

  const loadEbooks = async () => {
    try {
      const { data, error } = await supabase
        .from('ebooks')
        .select('id, title, markdown_source')
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const ebookStatuses: EbookStatus[] = (data || []).map(ebook => {
        const validation = validateEbookMarkdown(ebook.markdown_source || '');
        return {
          id: ebook.id,
          title: ebook.title,
          status: validation.isValid ? 'pending' : 'error',
          warnings: validation.warnings,
          errors: validation.errors,
          changes: []
        };
      });

      setEbooks(ebookStatuses);
    } catch (error) {
      console.error('Error loading ebooks:', error);
      toast({
        title: 'Error loading ebooks',
        description: 'Failed to load ebooks from database',
        variant: 'destructive'
      });
    }
  };

  const fixAllEbooks = async () => {
    setIsProcessing(true);

    for (const ebook of ebooks) {
      try {
        // Update status to analyzing
        setEbooks(prev => prev.map(e => 
          e.id === ebook.id ? { ...e, status: 'analyzing' as const } : e
        ));

        // Get current markdown
        const { data, error } = await supabase
          .from('ebooks')
          .select('markdown_source')
          .eq('id', ebook.id)
          .single();

        if (error) throw error;

        const originalMarkdown = data.markdown_source || '';
        
        // Preview and apply fixes
        const preview = previewMarkdownFixes(originalMarkdown);
        
        // Update status to fixing
        setEbooks(prev => prev.map(e => 
          e.id === ebook.id ? { ...e, status: 'fixing' as const, changes: preview.changes } : e
        ));

        // Only update if there are actual changes
        if (preview.fixed !== originalMarkdown) {
          const { error: updateError } = await supabase
            .from('ebooks')
            .update({ 
              markdown_source: preview.fixed,
              updated_at: new Date().toISOString()
            })
            .eq('id', ebook.id);

          if (updateError) throw updateError;
        }

        // Validate the result
        const finalValidation = validateEbookMarkdown(preview.fixed);
        
        // Update status to success
        setEbooks(prev => prev.map(e => 
          e.id === ebook.id ? { 
            ...e, 
            status: 'success' as const,
            warnings: finalValidation.warnings,
            errors: finalValidation.errors
          } : e
        ));

        // Small delay between ebooks
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (error) {
        console.error(`Error processing ebook ${ebook.id}:`, error);
        setEbooks(prev => prev.map(e => 
          e.id === ebook.id ? { 
            ...e, 
            status: 'error' as const,
            errors: [...e.errors, 'Failed to update ebook in database']
          } : e
        ));
      }
    }

    setIsProcessing(false);
    toast({
      title: 'Processing complete',
      description: 'All ebooks have been processed'
    });
  };

  const getStatusIcon = (status: EbookStatus['status']) => {
    switch (status) {
      case 'analyzing':
      case 'fixing':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <FileText className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: EbookStatus['status']) => {
    const variants: Record<EbookStatus['status'], { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      'pending': { variant: 'outline', label: 'Pending' },
      'analyzing': { variant: 'secondary', label: 'Analyzing' },
      'fixing': { variant: 'secondary', label: 'Fixing' },
      'success': { variant: 'default', label: 'Fixed' },
      'error': { variant: 'destructive', label: 'Error' }
    };

    const config = variants[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Ebook Markdown Fixer</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Normalize and fix markdown formatting for all ebooks
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={loadEbooks} disabled={isProcessing} variant="outline">
              Load Ebooks
            </Button>
            <Button 
              onClick={fixAllEbooks} 
              disabled={isProcessing || ebooks.length === 0}
            >
              {isProcessing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Fix All Ebooks
            </Button>
          </div>
        </div>

        {ebooks.length > 0 && (
          <Alert>
            <AlertDescription>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Found <strong>{ebooks.length}</strong> ebook(s) to process</span>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <ScrollArea className="h-[600px]">
          <div className="space-y-3">
            {ebooks.map(ebook => (
              <Card 
                key={ebook.id} 
                className={`p-4 cursor-pointer hover:border-primary/50 transition-colors ${
                  selectedEbook === ebook.id ? 'border-primary' : ''
                }`}
                onClick={() => setSelectedEbook(selectedEbook === ebook.id ? null : ebook.id)}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(ebook.status)}
                      <div>
                        <h3 className="font-semibold">{ebook.title}</h3>
                        <p className="text-xs text-muted-foreground">{ebook.id}</p>
                      </div>
                    </div>
                    {getStatusBadge(ebook.status)}
                  </div>

                  {selectedEbook === ebook.id && (
                    <div className="space-y-3 pt-3 border-t">
                      {ebook.changes.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold mb-2">Changes:</h4>
                          <ul className="text-sm space-y-1">
                            {ebook.changes.map((change, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-blue-500">•</span>
                                <span>{change}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {ebook.warnings.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold mb-2 text-yellow-600">Warnings:</h4>
                          <ul className="text-sm space-y-1">
                            {ebook.warnings.map((warning, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <AlertTriangle className="w-3 h-3 text-yellow-600 mt-0.5" />
                                <span>{warning}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {ebook.errors.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold mb-2 text-red-600">Errors:</h4>
                          <ul className="text-sm space-y-1">
                            {ebook.errors.map((error, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <AlertTriangle className="w-3 h-3 text-red-600 mt-0.5" />
                                <span>{error}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
};
