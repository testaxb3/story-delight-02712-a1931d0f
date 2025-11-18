import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { BonusData, BonusCategory } from '@/types/bonus';
import { BonusCard } from '@/components/bonuses/BonusCard';
import { Loader2, Upload, CheckCircle2, AlertCircle, FileText, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { parseMarkdownToChapters } from '@/utils/markdownToChapters';
import { validateMarkdown } from '@/utils/markdownValidator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ChaptersPreview } from './ChaptersPreview';

interface SimplifiedBonusFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bonus?: BonusData | null;
  onSave: (bonus: Omit<BonusData, 'id'> | BonusData, ebookData?: { chapters: any[], markdownSource: string }) => void;
  saving?: boolean;
}

const CATEGORIES: BonusCategory[] = [
  BonusCategory.VIDEO,
  BonusCategory.EBOOK,
  BonusCategory.TOOL,
  BonusCategory.PDF,
  BonusCategory.SESSION,
  BonusCategory.TEMPLATE,
];

export function SimplifiedBonusForm({ open, onOpenChange, bonus, onSave, saving }: SimplifiedBonusFormProps) {
  const [formData, setFormData] = useState<Omit<BonusData, 'id'>>({
    title: '',
    description: '',
    category: BonusCategory.VIDEO,
    thumbnail: '',
    duration: '',
    size: '',
    locked: false,
    isNew: false,
    tags: [],
    videoUrl: '',
    viewUrl: '',
    downloadUrl: '',
    requirement: ''
  });

  const [tagsInput, setTagsInput] = useState('');
  const [showPreview, setShowPreview] = useState(true);
  
  // Ebook-specific state
  const [markdownFile, setMarkdownFile] = useState<File | null>(null);
  const [markdownContent, setMarkdownContent] = useState('');
  const [validationResult, setValidationResult] = useState<any>(null);
  const [parsedChapters, setParsedChapters] = useState<any[]>([]);
  const [processingMarkdown, setProcessingMarkdown] = useState(false);

  useEffect(() => {
    if (bonus) {
      setFormData({
        title: bonus.title,
        description: bonus.description,
        category: bonus.category,
        thumbnail: bonus.thumbnail || '',
        duration: bonus.duration || '',
        size: bonus.size || '',
        locked: bonus.locked,
        isNew: bonus.isNew || false,
        tags: bonus.tags || [],
        videoUrl: bonus.videoUrl || '',
        viewUrl: bonus.viewUrl || '',
        downloadUrl: bonus.downloadUrl || '',
        requirement: bonus.requirement || ''
      });
      setTagsInput((bonus.tags || []).join(', '));
    } else {
      setFormData({
        title: '',
        description: '',
        category: BonusCategory.VIDEO,
        thumbnail: '',
        duration: '',
        size: '',
        locked: false,
        isNew: false,
        tags: [],
        videoUrl: '',
        viewUrl: '',
        downloadUrl: '',
        requirement: ''
      });
      setTagsInput('');
      setMarkdownFile(null);
      setMarkdownContent('');
      setValidationResult(null);
      setParsedChapters([]);
    }
  }, [bonus, open]);

  const handleMarkdownFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMarkdownFile(file);
    setProcessingMarkdown(true);

    try {
      const content = await file.text();
      setMarkdownContent(content);

      // Validate markdown
      const validation = validateMarkdown(content);
      setValidationResult(validation);

      if (validation.isValid) {
        // Parse chapters
        const chapters = parseMarkdownToChapters(content);
        setParsedChapters(chapters);

        // Auto-extract data from markdown
        const firstLines = content.split('\n').slice(0, 10);
        const titleMatch = firstLines.find(line => line.startsWith('#'));
        const title = titleMatch ? titleMatch.replace(/^#+\s*/, '').trim() : file.name.replace('.md', '');
        
        // Extract description from first paragraph
        const descMatch = content.match(/\n\n([^\n]+)\n/);
        const description = descMatch ? descMatch[1].substring(0, 200) : '';

        // Calculate file size
        const fileSize = `${(file.size / 1024).toFixed(0)} KB`;

        // Calculate estimated reading time (avg 200 words per minute)
        const wordCount = content.split(/\s+/).length;
        const estimatedTime = Math.ceil(wordCount / 200);

        // Auto-fill form data
        setFormData(prev => ({
          ...prev,
          title: title,
          description: description,
          size: fileSize,
          duration: `${estimatedTime} min`,
          category: BonusCategory.EBOOK,
        }));

        toast.success(`Ebook data extracted: ${chapters.length} chapters, ${estimatedTime} min read time`);
      } else {
        toast.error('Invalid markdown format. Please check the file.');
      }
    } catch (error) {
      console.error('Error processing markdown:', error);
      toast.error('Error processing markdown file');
    } finally {
      setProcessingMarkdown(false);
    }
  };

  const handleSubmit = () => {
    const tags = tagsInput.split(',').map(tag => tag.trim()).filter(Boolean);
    const finalData = { ...formData, tags };

    if (formData.category === BonusCategory.EBOOK && parsedChapters.length > 0) {
      // Include ebook data when creating an ebook bonus
      onSave(finalData, { chapters: parsedChapters, markdownSource: markdownContent });
    } else {
      onSave(finalData);
    }
  };

  const isEbookCategory = formData.category === BonusCategory.EBOOK;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {bonus ? 'Edit Bonus' : 'Create New Bonus'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6">
          {/* Left Column - Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value: BonusCategory) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Ebook Upload Section */}
            {isEbookCategory && (
              <div className="space-y-3">
                <Alert className="border-primary/50 bg-primary/5">
                  <BookOpen className="w-4 h-4" />
                  <AlertDescription className="text-sm">
                    Upload a markdown file (.md) to automatically extract title, description, chapters, and reading time.
                  </AlertDescription>
                </Alert>

                <div>
                  <Label htmlFor="markdown-file" className="cursor-pointer">
                    <div className="border-2 border-dashed border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
                      <div className="flex flex-col items-center gap-2 text-center">
                        <Upload className="w-8 h-8 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">
                            {markdownFile ? markdownFile.name : 'Upload Markdown File'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Click to browse or drag and drop
                          </p>
                        </div>
                      </div>
                    </div>
                    <Input
                      id="markdown-file"
                      type="file"
                      accept=".md"
                      className="hidden"
                      onChange={handleMarkdownFileChange}
                    />
                  </Label>
                </div>

                {processingMarkdown && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing markdown...
                  </div>
                )}

                {validationResult && !validationResult.isValid && (
                  <Alert variant="destructive">
                    <AlertCircle className="w-4 h-4" />
                    <AlertDescription>
                      {validationResult.errors.map((err: string, i: number) => (
                        <div key={i}>{err}</div>
                      ))}
                    </AlertDescription>
                  </Alert>
                )}

                {validationResult?.isValid && (
                  <Alert className="border-green-500/50 bg-green-500/5">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <AlertDescription className="text-green-600">
                      ✓ Valid markdown • {parsedChapters.length} chapters extracted
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder={isEbookCategory ? "Auto-filled from markdown" : "Enter title"}
                readOnly={isEbookCategory && parsedChapters.length > 0}
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={isEbookCategory ? "Auto-filled from markdown" : "Enter description"}
                rows={3}
                readOnly={isEbookCategory && parsedChapters.length > 0}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="duration">
                  {isEbookCategory ? 'Reading Time' : 'Duration'}
                </Label>
                <Input
                  id="duration"
                  value={formData.duration || ''}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder={isEbookCategory ? "Auto-calculated" : "e.g., 10 min"}
                  readOnly={isEbookCategory && parsedChapters.length > 0}
                />
              </div>
              <div>
                <Label htmlFor="size">File Size</Label>
                <Input
                  id="size"
                  value={formData.size || ''}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  placeholder={isEbookCategory ? "Auto-calculated" : "e.g., 5 MB"}
                  readOnly={isEbookCategory && parsedChapters.length > 0}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g., parenting, strategy, quick-win"
              />
            </div>

            {!isEbookCategory && (
              <>
                <div>
                  <Label htmlFor="thumbnail">Thumbnail URL</Label>
                  <Input
                    id="thumbnail"
                    value={formData.thumbnail || ''}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <Label htmlFor="viewUrl">View/Access URL</Label>
                  <Input
                    id="viewUrl"
                    value={formData.viewUrl || ''}
                    onChange={(e) => setFormData({ ...formData, viewUrl: e.target.value })}
                    placeholder="URL where users can access this bonus"
                  />
                </div>
              </>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id="locked"
                checked={formData.locked}
                onCheckedChange={(checked) => setFormData({ ...formData, locked: checked as boolean })}
              />
              <Label htmlFor="locked" className="font-normal cursor-pointer">
                Locked (requires unlock condition)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isNew"
                checked={formData.isNew || false}
                onCheckedChange={(checked) => setFormData({ ...formData, isNew: checked as boolean })}
              />
              <Label htmlFor="isNew" className="font-normal cursor-pointer">
                Mark as "New"
              </Label>
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Preview</Label>
              {parsedChapters.length > 0 && (
                <Badge variant="secondary">
                  {parsedChapters.length} chapters
                </Badge>
              )}
            </div>

            {isEbookCategory && parsedChapters.length > 0 ? (
              <div className="border rounded-lg p-4 space-y-4 max-h-[500px] overflow-y-auto">
                <ChaptersPreview chapters={parsedChapters} />
              </div>
            ) : (
              <div className="border rounded-lg p-4">
                <BonusCard
                  bonus={{
                    id: 'preview',
                    title: formData.title,
                    description: formData.description,
                    category: formData.category,
                    thumbnail: formData.thumbnail,
                    duration: formData.duration,
                    size: formData.size,
                    locked: formData.locked,
                    completed: false,
                    progress: 0,
                    isNew: formData.isNew,
                    requirement: formData.requirement,
                    tags: formData.tags,
                    videoUrl: formData.videoUrl,
                    downloadUrl: formData.downloadUrl,
                    viewUrl: formData.viewUrl,
                  }}
                  onAction={() => {}}
                />
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={saving || (isEbookCategory && parsedChapters.length === 0)}
          >
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {bonus ? 'Update' : 'Create'} Bonus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
