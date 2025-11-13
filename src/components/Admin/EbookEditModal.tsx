import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, Upload, CheckCircle2, AlertCircle, Palette, Image as ImageIcon } from 'lucide-react';
import { Ebook } from '@/hooks/useEbooks';
import { useUpdateEbook } from '@/hooks/useEbooks';
import { validateMarkdown } from '@/utils/markdownValidator';
import { parseMarkdownToChapters } from '@/utils/markdownToChapters';
import { ChaptersPreview } from './ChaptersPreview';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface EbookEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ebook: Ebook;
  onSuccess?: () => void;
}

const PRESET_COLORS = [
  '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
  '#ec4899', '#8b5cf6', '#6366f1', '#14b8a6', '#f97316'
];

export function EbookEditModal({ open, onOpenChange, ebook, onSuccess }: EbookEditModalProps) {
  const [formData, setFormData] = useState({
    title: ebook.title,
    subtitle: ebook.subtitle || '',
    cover_color: ebook.cover_color,
    thumbnail_url: ebook.thumbnail_url || '',
  });
  const [markdownContent, setMarkdownContent] = useState(ebook.markdown_source || '');
  const [validationResult, setValidationResult] = useState<any>(null);
  const [parsedChapters, setParsedChapters] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  
  const updateEbook = useUpdateEbook();

  useEffect(() => {
    if (open) {
      setFormData({
        title: ebook.title,
        subtitle: ebook.subtitle || '',
        cover_color: ebook.cover_color,
        thumbnail_url: ebook.thumbnail_url || '',
      });
      setMarkdownContent(ebook.markdown_source || '');
      setValidationResult(null);
      setParsedChapters([]);
      setThumbnailFile(null);
    }
  }, [open, ebook]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.md')) {
      toast.error('Por favor, selecione um arquivo Markdown (.md)');
      return;
    }

    try {
      const text = await file.text();
      setMarkdownContent(text);
      
      const validation = validateMarkdown(text);
      setValidationResult(validation);
      
      if (validation.isValid) {
        const chapters = parseMarkdownToChapters(text);
        setParsedChapters(chapters);
        toast.success('Arquivo validado com sucesso!');
      } else {
        setParsedChapters([]);
        toast.error('Markdown inválido. Verifique os erros abaixo.');
      }
    } catch (error) {
      console.error('Error reading file:', error);
      toast.error('Erro ao ler o arquivo');
      setValidationResult(null);
      setParsedChapters([]);
    }
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione uma imagem');
      return;
    }

    setThumbnailFile(file);
    
    // Preview local
    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData(prev => ({ ...prev, thumbnail_url: e.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const uploadThumbnail = async (): Promise<string | null> => {
    if (!thumbnailFile) return formData.thumbnail_url;

    try {
      const fileExt = thumbnailFile.name.split('.').pop();
      const fileName = `${ebook.id}-${Date.now()}.${fileExt}`;
      const filePath = `ebook-covers/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('community-posts')
        .upload(filePath, thumbnailFile);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('community-posts')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      toast.error('Erro ao fazer upload da thumbnail');
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Título é obrigatório');
      return;
    }

    setUploading(true);

    try {
      let updates: Partial<Ebook> = {
        title: formData.title,
        subtitle: formData.subtitle || null,
        cover_color: formData.cover_color,
      };

      // Upload thumbnail if changed
      if (thumbnailFile) {
        const thumbnailUrl = await uploadThumbnail();
        if (thumbnailUrl) {
          updates.thumbnail_url = thumbnailUrl;
        }
      }

      // If markdown was updated, reprocess content
      if (markdownContent && markdownContent !== ebook.markdown_source) {
        const validation = validateMarkdown(markdownContent);
        
        if (!validation.isValid) {
          toast.error('Markdown inválido. Corrija os erros antes de salvar.');
          setUploading(false);
          return;
        }

        const chapters = parseMarkdownToChapters(markdownContent);
        const wordCount = validation.stats.totalWords;
        const readingTime = validation.stats.estimatedReadingTime;

        updates.content = chapters as any;
        updates.markdown_source = markdownContent;
        updates.total_chapters = chapters.length;
        updates.total_words = wordCount;
        updates.estimated_reading_time = readingTime;
      }

      await updateEbook.mutateAsync({
        id: ebook.id,
        updates,
      });

      toast.success('Ebook atualizado com sucesso!');
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating ebook:', error);
      toast.error('Erro ao atualizar ebook');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Ebook</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="metadata" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="metadata">Metadados</TabsTrigger>
              <TabsTrigger value="appearance">Aparência</TabsTrigger>
              <TabsTrigger value="content">Conteúdo</TabsTrigger>
            </TabsList>

            {/* Metadata Tab */}
            <TabsContent value="metadata" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Título do ebook"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtítulo</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="Subtítulo do ebook"
                />
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Estatísticas</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Capítulos:</span>{' '}
                    <span className="font-medium">{ebook.total_chapters}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Palavras:</span>{' '}
                    <span className="font-medium">{ebook.total_words || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Tempo de leitura:</span>{' '}
                    <span className="font-medium">{ebook.estimated_reading_time || 'N/A'} min</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Leitores:</span>{' '}
                    <span className="font-medium">{ebook.total_readers || 0}</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Appearance Tab */}
            <TabsContent value="appearance" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Thumbnail Personalizada</Label>
                <div className="flex gap-4">
                  {formData.thumbnail_url && (
                    <div className="w-32 h-32 rounded-lg overflow-hidden border">
                      <img
                        src={formData.thumbnail_url}
                        alt="Thumbnail"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      className="cursor-pointer"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Recomendado: 800x600px, formato JPG ou PNG
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Cor da Capa
                </Label>
                <div className="grid grid-cols-5 gap-2">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-full h-12 rounded-lg border-2 transition-all ${
                        formData.cover_color === color
                          ? 'border-primary ring-2 ring-primary/20'
                          : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setFormData(prev => ({ ...prev, cover_color: color }))}
                    />
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <Input
                    type="color"
                    value={formData.cover_color}
                    onChange={(e) => setFormData(prev => ({ ...prev, cover_color: e.target.value }))}
                    className="w-20 h-10 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={formData.cover_color}
                    onChange={(e) => setFormData(prev => ({ ...prev, cover_color: e.target.value }))}
                    placeholder="#8b5cf6"
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Preview */}
              <div className="space-y-2">
                <Label>Preview da Capa</Label>
                <div
                  className="w-full h-48 rounded-lg flex items-center justify-center text-white font-bold text-2xl"
                  style={{ backgroundColor: formData.cover_color }}
                >
                  {formData.thumbnail_url ? (
                    <img
                      src={formData.thumbnail_url}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-center p-6">
                      <p className="line-clamp-2">{formData.title}</p>
                      {formData.subtitle && (
                        <p className="text-lg font-normal mt-2 line-clamp-2">{formData.subtitle}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="markdown-file">Re-upload Markdown (Opcional)</Label>
                <Input
                  id="markdown-file"
                  type="file"
                  accept=".md,.markdown"
                  onChange={handleFileUpload}
                  className="cursor-pointer"
                />
                <p className="text-sm text-muted-foreground">
                  Faça upload de um novo arquivo para substituir o conteúdo
                </p>
              </div>

              {validationResult && (
                <div className="space-y-3">
                  {validationResult.errors.length > 0 && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="space-y-1">
                          <p className="font-semibold">Erros:</p>
                          <ul className="list-disc list-inside text-sm">
                            {validationResult.errors.map((error: string, i: number) => (
                              <li key={i}>{error}</li>
                            ))}
                          </ul>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}

                  {validationResult.isValid && (
                    <Alert className="border-green-500 bg-green-50 dark:bg-green-950/30">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-900 dark:text-green-100">
                        <p className="font-semibold">Validado!</p>
                        <div className="text-sm space-y-1 mt-1">
                          <p>• {validationResult.stats.totalChapters} capítulos</p>
                          <p>• {validationResult.stats.totalWords} palavras</p>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}

              {parsedChapters.length > 0 && (
                <ChaptersPreview chapters={parsedChapters} />
              )}

              {markdownContent && (
                <div className="space-y-2">
                  <Label>Markdown Source</Label>
                  <Textarea
                    value={markdownContent}
                    onChange={(e) => {
                      setMarkdownContent(e.target.value);
                      const validation = validateMarkdown(e.target.value);
                      setValidationResult(validation);
                      if (validation.isValid) {
                        const chapters = parseMarkdownToChapters(e.target.value);
                        setParsedChapters(chapters);
                      } else {
                        setParsedChapters([]);
                      }
                    }}
                    rows={10}
                    className="font-mono text-xs"
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={uploading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={uploading || !formData.title}>
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar Alterações'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
