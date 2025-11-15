import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { BonusData } from '@/components/bonuses/BonusCard';
import { BonusCard } from '@/components/bonuses/BonusCard';
import { Loader2, X, CheckCircle2, AlertCircle, Upload, BookOpen, Link2, BookX, FileText, Lightbulb, Save } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { parseMarkdownToChapters } from '@/utils/markdownToChapters';
import { validateMarkdown } from '@/utils/markdownValidator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ChaptersPreview } from './ChaptersPreview';
import { TemplateGuideModal } from './TemplateGuideModal';
import { useEbooks, useUpdateEbook } from '@/hooks/useEbooks';

interface BonusFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bonus?: BonusData | null;
  onSave: (bonus: Omit<BonusData, 'id'> | BonusData) => void;
  saving?: boolean;
}

const CATEGORIES: BonusData['category'][] = ['video', 'ebook', 'tool', 'pdf', 'session', 'template'];

// Helper function to extract YouTube video ID and generate thumbnail URL
function getYouTubeThumbnail(url: string): string | null {
  // Match YouTube URLs in various formats:
  // https://www.youtube.com/watch?v=VIDEO_ID
  // https://youtu.be/VIDEO_ID
  // https://www.youtube.com/embed/VIDEO_ID
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&\?\/]+)/);
  if (match && match[1]) {
    return `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
  }
  return null;
}

// Helper function to validate if URL is from YouTube
function isYouTubeUrl(url: string): boolean {
  return /(?:youtube\.com|youtu\.be)/.test(url);
}

export function BonusFormModal({ open, onOpenChange, bonus, onSave, saving }: BonusFormModalProps) {
  const { ebooks } = useEbooks();
  const updateEbook = useUpdateEbook();

  const [formData, setFormData] = useState<Omit<BonusData, 'id'>>({
    title: '',
    description: '',
    category: 'video',
    thumbnail: '',
    duration: '',
    size: '',
    locked: false,
    completed: false,
    progress: 0,
    isNew: false,
    tags: [],
    videoUrl: '',
    viewUrl: '',
    downloadUrl: '',
    requirement: ''
  });

  const [tagsInput, setTagsInput] = useState('');
  const [showPreview, setShowPreview] = useState(true); // Always show preview
  const [thumbnailLoading, setThumbnailLoading] = useState(false);
  const [thumbnailAutoLoaded, setThumbnailAutoLoaded] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [selectedEbookId, setSelectedEbookId] = useState<string>('');
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);

  // Ebook upload state
  const [markdownContent, setMarkdownContent] = useState('');
  const [ebookUploading, setEbookUploading] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [parsedChapters, setParsedChapters] = useState<any[]>([]);
  const [showTemplateGuide, setShowTemplateGuide] = useState(false);

  // Filter ebooks: unlinked OR the currently selected one (when editing)
  const availableEbooks = ebooks?.filter(e => {
    // If editing and this is the currently linked ebook, include it
    if (bonus && selectedEbookId && e.id === selectedEbookId) {
      return true;
    }
    // Otherwise, only include unlinked ebooks
    return !e.bonus_id;
  }) || [];

  // Load bonus data when editing
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
        completed: bonus.completed || false,
        progress: bonus.progress || 0,
        isNew: bonus.isNew || false,
        tags: bonus.tags || [],
        videoUrl: bonus.videoUrl || '',
        viewUrl: bonus.viewUrl || '',
        downloadUrl: bonus.downloadUrl || '',
        requirement: bonus.requirement || ''
      });
      setTagsInput(bonus.tags?.join(', ') || '');
      setThumbnailAutoLoaded(false);
      setUrlError(null);

      // ✅ FIX: If editing an ebook bonus, extract the ebook ID from viewUrl
      if (bonus.category === 'ebook' && bonus.viewUrl) {
        const match = bonus.viewUrl.match(/\/ebook\/([a-f0-9-]+)/);
        if (match && match[1]) {
          setSelectedEbookId(match[1]);
        }
      } else {
        setSelectedEbookId('');
      }
    } else {
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'video',
        thumbnail: '',
        duration: '',
        size: '',
        locked: false,
        completed: false,
        progress: 0,
        isNew: false,
        tags: [],
        videoUrl: '',
        viewUrl: '',
        downloadUrl: '',
        requirement: ''
      });
      setTagsInput('');
      setSelectedEbookId('');
      setThumbnailAutoLoaded(false);
      setUrlError(null);
    }
  }, [bonus, open]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setMarkdownContent(content);
      
      // Validate and parse the markdown
      const validation = validateMarkdown(content);
      setValidationResult(validation);
      
      if (validation.isValid) {
        const chapters = parseMarkdownToChapters(content);
        setParsedChapters(chapters);
        
        // Extract title from first H1
        let autoTitle = formData.title;
        const titleMatch = content.match(/^#\s+(.+)$/m);
        if (titleMatch) {
          autoTitle = titleMatch[1].trim();
        } else if (file.name) {
          autoTitle = file.name.replace(/\.md$/i, '').replace(/[-_]/g, ' ');
        }
        
        // Extract description - look for text between title and first chapter
        let autoDescription = formData.description;
        const lines = content.split('\n');
        let foundTitle = false;
        let descriptionLines = [];
        
        for (const line of lines) {
          if (line.match(/^#\s+/)) {
            foundTitle = true;
            continue;
          }
          if (foundTitle && line.match(/^##\s+/)) {
            break; // Stop at first chapter
          }
          if (foundTitle && line.trim() && !line.match(/^---+$/)) {
            descriptionLines.push(line.trim());
            if (descriptionLines.join(' ').length > 150) break;
          }
        }
        
        if (descriptionLines.length > 0) {
          autoDescription = descriptionLines.join(' ').substring(0, 200);
        }
        
        // Extract tags from content
        const commonKeywords = [
          'comportamento', 'desenvolvimento', 'aprendizado', 'rotina', 'sono',
          'alimentação', 'disciplina', 'emoções', 'socialização', 'autonomia',
          'limites', 'comunicação', 'birra', 'ansiedade', 'autoestima',
          'criatividade', 'foco', 'organização', 'responsabilidade', 'cooperação',
          'telas', 'tecnologia', 'neurociência'
        ];
        
        const contentLower = content.toLowerCase();
        const foundTags = commonKeywords.filter(keyword => 
          contentLower.includes(keyword)
        ).slice(0, 5);
        
        // Calculate stats
        const totalWords = chapters.reduce((sum, chapter) => {
          const chapterWords = chapter.content.reduce((sectionSum, section) => {
            if (typeof section.content === 'string') {
              return sectionSum + section.content.split(/\s+/).length;
            } else if (Array.isArray(section.content)) {
              return sectionSum + section.content.join(' ').split(/\s+/).length;
            }
            return sectionSum;
          }, 0);
          return sum + chapterWords;
        }, 0);
        
        const estimatedReadingTime = Math.ceil(totalWords / 200);
        const fileSizeKB = Math.ceil(content.length / 1024);
        const fileSizeMB = fileSizeKB > 1024 ? (fileSizeKB / 1024).toFixed(1) + ' MB' : fileSizeKB + ' KB';
        
        setFormData(prev => ({
          ...prev,
          title: autoTitle || prev.title,
          description: autoDescription || prev.description,
          thumbnail: '/assets/ebook-screen-strategies-cover-new.jpg',
          duration: `${estimatedReadingTime} min`,
          size: fileSizeMB,
          tags: foundTags.length > 0 ? foundTags : prev.tags,
        }));
        
        if (foundTags.length > 0) {
          setTagsInput(foundTags.join(', '));
        }
        
        toast.success(`Markdown processed! ${chapters.length} chapters, ~${estimatedReadingTime}min reading time`);
      } else {
        setParsedChapters([]);
        toast.error('Invalid markdown. Check errors.');
      }
    };
    reader.readAsText(file);
  };

  const handleCreateEbook = async () => {
    if (!markdownContent || !formData.title) {
      toast.error('Title and markdown content are required');
      return;
    }

    setEbookUploading(true);
    try {
      const chapters = parseMarkdownToChapters(markdownContent);
      
      // Calculate total words from all chapter sections
      const totalWords = chapters.reduce((sum, chapter) => {
        const chapterWords = chapter.content.reduce((sectionSum, section) => {
          if (typeof section.content === 'string') {
            return sectionSum + section.content.split(/\s+/).length;
          } else if (Array.isArray(section.content)) {
            return sectionSum + section.content.join(' ').split(/\s+/).length;
          }
          return sectionSum;
        }, 0);
        return sum + chapterWords;
      }, 0);
      
      const estimatedReadingTime = Math.ceil(totalWords / 200);

      // Build a unique slug based on the title
      const baseSlug = formData.title
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      let slug = baseSlug || 'ebook';

      // Check existing slugs to avoid unique constraint violation
      const { data: existingSlugs } = await supabase
        .from('ebooks')
        .select('slug')
        .ilike('slug', `${baseSlug}%`);

      if (existingSlugs && existingSlugs.length > 0) {
        const used = new Set(existingSlugs.map((e: any) => e.slug));
        if (used.has(baseSlug)) {
          let i = 2;
          while (used.has(`${baseSlug}-${i}`)) i++;
          slug = `${baseSlug}-${i}`;
        }
      }

      const { data: ebookData, error: ebookError } = await supabase
        .from('ebooks')
        .insert({
          title: formData.title,
          subtitle: formData.description || null,
          slug,
          content: chapters,
          markdown_source: markdownContent,
          total_chapters: chapters.length,
          total_words: totalWords,
          estimated_reading_time: estimatedReadingTime,
          cover_color: '#8b5cf6',
        })
        .select()
        .single();

      if (ebookError) throw ebookError;

      // Update formData with ebook view_url
      setFormData(prev => ({
        ...prev,
        viewUrl: `/ebook/${ebookData.id}`,
      }));

      toast.success('Ebook criado com sucesso!');
      setMarkdownContent('');
    } catch (error: any) {
      console.error('Erro ao criar ebook:', error);
      toast.error('Erro ao criar ebook: ' + error.message);
    } finally {
      setEbookUploading(false);
    }
  };

  // Handle View URL changes with YouTube auto-thumbnail extraction
  const handleViewUrlChange = async (url: string) => {
    setFormData({ ...formData, viewUrl: url });
    setUrlError(null);
    setThumbnailAutoLoaded(false);

    // Only process if category is video and URL is not empty
    if (formData.category === 'video' && url.trim()) {
      // Validate that it's a YouTube URL
      if (!isYouTubeUrl(url)) {
        setUrlError('Video URL must be from YouTube (youtube.com or youtu.be)');
        return;
      }

      // Also set videoUrl (same as viewUrl for videos)
      setFormData(prev => ({ ...prev, viewUrl: url, videoUrl: url }));

      // Extract thumbnail
      setThumbnailLoading(true);
      try {
        const thumbnailUrl = getYouTubeThumbnail(url);
        if (thumbnailUrl) {
          // Verify thumbnail exists by trying to load it
          const img = new Image();
          img.onload = () => {
            setFormData(prev => ({ ...prev, thumbnail: thumbnailUrl }));
            setThumbnailAutoLoaded(true);
            setThumbnailLoading(false);
          };
          img.onerror = () => {
            // Fallback to standard resolution if maxresdefault doesn't exist
            const videoId = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&\?\/]+)/)?.[1];
            const fallbackUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
            setFormData(prev => ({ ...prev, thumbnail: fallbackUrl }));
            setThumbnailAutoLoaded(true);
            setThumbnailLoading(false);
          };
          img.src = thumbnailUrl;
        } else {
          setThumbnailLoading(false);
        }
      } catch (error) {
        console.error('Error loading thumbnail:', error);
        setThumbnailLoading(false);
      }
    }
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value as BonusData['category'] }));
    setUrlError(null);
    setThumbnailAutoLoaded(false);
  };

  // Handle thumbnail file upload
  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setUploadingThumbnail(true);

    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `bonus-thumbnails/${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('public-assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('public-assets')
        .getPublicUrl(filePath);

      // Update form data with the URL
      setFormData(prev => ({ ...prev, thumbnail: publicUrl }));
      toast.success('Thumbnail uploaded successfully!');
    } catch (error: any) {
      console.error('Error uploading thumbnail:', error);
      toast.error('Failed to upload thumbnail: ' + error.message);
    } finally {
      setUploadingThumbnail(false);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate YouTube URL if category is video
    if (formData.category === 'video' && formData.viewUrl && !isYouTubeUrl(formData.viewUrl)) {
      setUrlError('Video URL must be from YouTube (youtube.com or youtu.be)');
      return;
    }

    // Validate ebook selection if category is ebook
    if (formData.category === 'ebook' && !selectedEbookId) {
      toast.error('Selecione um ebook para vincular');
      return;
    }

    // Parse tags from input
    const tags = tagsInput
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean);

    const dataToSave: any = {
      ...formData,
      tags,
      // Progress should always be 0 for new items (will be updated automatically by user consumption)
      progress: bonus ? formData.progress : 0,
      // Clean up empty strings
      thumbnail: formData.thumbnail || undefined,
      duration: formData.duration || undefined,
      size: formData.size || undefined,
      videoUrl: formData.videoUrl || undefined,
      viewUrl: formData.category === 'ebook' && selectedEbookId ? `/ebook/${selectedEbookId}` : formData.viewUrl || undefined,
      downloadUrl: formData.downloadUrl || undefined,
      requirement: formData.requirement || undefined,
      // ✅ Pass selectedEbookId to parent for linking
      _selectedEbookId: formData.category === 'ebook' ? selectedEbookId : undefined,
    };

    // Save the bonus
    if (bonus) {
      onSave({ ...(bonus as BonusData), ...dataToSave });
    } else {
      onSave(dataToSave);
    }
  };

  const previewBonus: BonusData = {
    ...formData,
    id: 'preview',
    tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean)
  };

  return (
    <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {bonus ? 'Edit Bonus' : 'Create New Bonus'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="info" className="w-full">
            <TabsList className={`grid w-full ${formData.category === 'ebook' ? 'grid-cols-2' : 'grid-cols-1'}`}>
              <TabsTrigger value="info">Informações</TabsTrigger>
              {formData.category === 'ebook' && (
                <TabsTrigger value="upload">Upload Markdown</TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="info" className="space-y-6 mt-4">
              <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column - Form Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="flex items-center gap-2">
                  Title
                  <Badge variant="destructive" className="text-[10px] px-1.5 py-0">Required</Badge>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Why Your Child Acts This Way - Complete Interactive Ebook"
                  required
                  className={!formData.title ? "border-red-300 focus-visible:ring-red-500" : ""}
                />
                {!formData.title && (
                  <p className="text-xs text-muted-foreground">Give your bonus a clear, descriptive title</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="flex items-center gap-2">
                  Description
                  <Badge variant="destructive" className="text-[10px] px-1.5 py-0">Required</Badge>
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ex: 29 meta-analyzed studies, 3,500+ children in research samples..."
                  rows={3}
                  required
                  className={!formData.description ? "border-red-300 focus-visible:ring-red-500" : ""}
                />
                {!formData.description && (
                  <p className="text-xs text-muted-foreground">Describe what users will get from this bonus</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat.toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="45 min"
                  />
                </div>
              </div>

              {formData.category === 'ebook' && (
                <div className="space-y-4 p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <BookOpen className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">Ebook Configuration</h4>
                      <p className="text-xs text-muted-foreground">Choose one option below</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Option 1: Link Existing */}
                    <div className={`p-4 rounded-lg border-2 transition-all ${
                      selectedEbookId
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 shadow-md'
                        : 'border-muted hover:border-blue-300 cursor-pointer'
                    }`}>
                      <div className="flex items-start gap-2 mb-3">
                        <Link2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                        <div className="min-w-0">
                          <h5 className="text-sm font-medium">Link Existing</h5>
                          <p className="text-xs text-muted-foreground">Connect to an ebook</p>
                        </div>
                      </div>

                      {selectedEbookId ? (
                        <div className="space-y-2">
                          {/* Show selected ebook info */}
                          <div className="p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
                            <div className="flex items-start gap-2 mb-2">
                              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold text-green-900 dark:text-green-100 truncate">
                                  {availableEbooks.find(e => e.id === selectedEbookId)?.title}
                                </p>
                                <p className="text-xs text-green-700 dark:text-green-300">
                                  {availableEbooks.find(e => e.id === selectedEbookId)?.total_chapters} chapters • {availableEbooks.find(e => e.id === selectedEbookId)?.estimated_reading_time || '~30'}min
                                </p>
                              </div>
                            </div>
                          </div>
                          {/* Change button */}
                          <Select value={selectedEbookId} onValueChange={setSelectedEbookId}>
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue placeholder="Change ebook..." />
                            </SelectTrigger>
                            <SelectContent>
                              {availableEbooks.map((ebook) => (
                                <SelectItem key={ebook.id} value={ebook.id}>
                                  <div className="flex flex-col py-1">
                                    <span className="font-medium text-sm">{ebook.title}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {ebook.total_chapters} chapters • {ebook.estimated_reading_time || '~30'}min
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ) : (
                        <Select value={selectedEbookId} onValueChange={setSelectedEbookId}>
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Select ebook..." />
                          </SelectTrigger>
                          <SelectContent>
                            {availableEbooks.length === 0 ? (
                              <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                                <BookX className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p className="font-medium">No ebooks available</p>
                                <p className="text-xs">All linked or create new</p>
                              </div>
                            ) : (
                              availableEbooks.map((ebook) => (
                                <SelectItem key={ebook.id} value={ebook.id}>
                                  <div className="flex flex-col py-1">
                                    <span className="font-medium text-sm">{ebook.title}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {ebook.total_chapters} chapters • {ebook.estimated_reading_time || '~30'}min
                                    </span>
                                  </div>
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      )}
                    </div>

                    {/* Option 2: Upload New */}
                    <div className="p-4 rounded-lg border-2 border-muted hover:border-purple-300 transition-all cursor-pointer">
                      <div className="flex items-start gap-2 mb-3">
                        <Upload className="w-4 h-4 text-purple-500 mt-0.5" />
                        <div>
                          <h5 className="text-sm font-medium">Upload New</h5>
                          <p className="text-xs text-muted-foreground">Create from markdown</p>
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const tabsList = document.querySelector('[role="tablist"]');
                          const uploadTab = tabsList?.querySelector('[value="upload"]') as HTMLElement;
                          uploadTab?.click();
                        }}
                        className="w-full h-9 text-xs"
                      >
                        <FileText className="w-3 h-3 mr-2" />
                        Go to Upload Tab
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="thumbnail" className="flex items-center justify-between">
                  <span>Thumbnail</span>
                  {formData.category === 'video' && (
                    <Badge variant="secondary" className="text-[10px]">Auto-filled</Badge>
                  )}
                </Label>

                {/* Upload or URL input */}
                <div className="flex gap-2">
                  <Input
                    id="thumbnail"
                    value={formData.thumbnail}
                    onChange={(e) => {
                      setFormData({ ...formData, thumbnail: e.target.value });
                      setThumbnailAutoLoaded(false);
                    }}
                    placeholder={
                      formData.category === 'video'
                        ? 'Will auto-extract from YouTube...'
                        : 'https://... or upload image →'
                    }
                    disabled={formData.category === 'video' && thumbnailLoading}
                    className="text-sm"
                  />

                  {/* Upload button for non-video categories */}
                  {formData.category !== 'video' && (
                    <label htmlFor="thumbnail-file">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="shrink-0"
                        disabled={uploadingThumbnail}
                        onClick={() => document.getElementById('thumbnail-file')?.click()}
                      >
                        {uploadingThumbnail ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Upload className="w-4 h-4" />
                        )}
                      </Button>
                      <input
                        id="thumbnail-file"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleThumbnailUpload}
                      />
                    </label>
                  )}
                </div>

                {/* Status messages */}
                {thumbnailLoading && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-950/30 rounded-md">
                    <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
                    <span className="text-xs text-blue-700 dark:text-blue-300">Extracting from YouTube...</span>
                  </div>
                )}

                {uploadingThumbnail && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-950/30 rounded-md">
                    <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
                    <span className="text-xs text-blue-700 dark:text-blue-300">Uploading thumbnail...</span>
                  </div>
                )}

                {thumbnailAutoLoaded && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-950/30 rounded-md">
                    <CheckCircle2 className="w-3 h-3 text-green-600" />
                    <span className="text-xs text-green-700 dark:text-green-300">Thumbnail loaded successfully</span>
                  </div>
                )}

                {/* Preview with better styling */}
                {formData.thumbnail && !uploadingThumbnail && (
                  <div className="relative group rounded-lg overflow-hidden border-2 border-muted">
                    <img
                      src={formData.thumbnail}
                      alt="Thumbnail preview"
                      className="w-full h-32 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  </div>
                )}

                <p className="text-xs text-muted-foreground">
                  {formData.category === 'video'
                    ? 'Paste YouTube URL above to auto-generate thumbnail'
                    : 'Upload image (max 5MB) or paste URL. Recommended: 1280x720px'}
                </p>
              </div>

              <div>
                <Label htmlFor="size">File Size</Label>
                <Input
                  id="size"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  placeholder="12 MB"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Ex: Neuroscience, Research-Based, Interactive"
                />
                {tagsInput && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tagsInput.split(',').map((tag, i) => {
                      const trimmed = tag.trim();
                      return trimmed ? (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {trimmed}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">Separate multiple tags with commas</p>
              </div>

              {/* Document/View URL - Hidden for ebooks as it's auto-generated */}
              {formData.category !== 'ebook' && (
                <div>
                  <Label htmlFor="viewUrl">
                    {formData.category === 'video' && 'YouTube Video URL'}
                    {formData.category === 'pdf' && 'Document URL'}
                    {(formData.category === 'tool' || formData.category === 'template') && 'Tool/Template URL'}
                    {formData.category === 'session' && 'Session URL'}
                  </Label>
                  <Input
                    id="viewUrl"
                    value={formData.viewUrl}
                    onChange={(e) => handleViewUrlChange(e.target.value)}
                    placeholder={
                      formData.category === 'video'
                        ? 'https://www.youtube.com/watch?v=...'
                        : formData.category === 'pdf'
                        ? '/document link'
                        : '/page-url or external link'
                    }
                    type="url"
                  />
                  {urlError && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{urlError}</AlertDescription>
                    </Alert>
                  )}
                </div>
              )}

              {/* Info message for ebooks */}
              {formData.category === 'ebook' && (
                <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-950/30">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-900 dark:text-blue-100">
                    <p className="font-semibold mb-1">URL do Ebook</p>
                    <p className="text-sm">
                      O URL será gerado automaticamente quando você processar o arquivo Markdown na aba "Upload Markdown".
                    </p>
                  </AlertDescription>
                </Alert>
              )}

              <div>
                <Label htmlFor="downloadUrl">Download URL (optional)</Label>
                <Input
                  id="downloadUrl"
                  value={formData.downloadUrl}
                  onChange={(e) => setFormData({ ...formData, downloadUrl: e.target.value })}
                  placeholder="https://..."
                  type="url"
                />
              </div>

              {formData.locked && (
                <div>
                  <Label htmlFor="requirement">Unlock Requirement</Label>
                  <Textarea
                    id="requirement"
                    value={formData.requirement}
                    onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
                    placeholder="Complete 30-day challenge"
                    rows={2}
                  />
                </div>
              )}

              {/* Checkboxes */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="locked"
                    checked={formData.locked}
                    onCheckedChange={(checked) => setFormData({ ...formData, locked: checked as boolean })}
                  />
                  <Label htmlFor="locked" className="cursor-pointer">Locked</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isNew"
                    checked={formData.isNew}
                    onCheckedChange={(checked) => setFormData({ ...formData, isNew: checked as boolean })}
                  />
                  <Label htmlFor="isNew" className="cursor-pointer">Mark as New</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="completed"
                    checked={formData.completed}
                    onCheckedChange={(checked) => setFormData({ ...formData, completed: checked as boolean })}
                  />
                  <Label htmlFor="completed" className="cursor-pointer">Completed</Label>
                </div>
              </div>
            </div>

            {/* Right Column - Live Preview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg">Live Preview</Label>
                <Badge variant="outline" className="text-xs">
                  Real-time
                </Badge>
              </div>

              <div className="border-2 border-dashed border-primary/30 rounded-lg p-4 bg-muted/30">
                <BonusCard bonus={previewBonus} />
              </div>

              {/* Validation Info */}
              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-2">
                <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-100">Required Fields</h4>
                <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                  <li className="flex items-center gap-2">
                    {formData.title ? '✓' : '○'} Title
                  </li>
                  <li className="flex items-center gap-2">
                    {formData.description ? '✓' : '○'} Description
                  </li>
                  <li className="flex items-center gap-2">
                    {formData.category ? '✓' : '○'} Category
                  </li>
                </ul>
              </div>

              {/* Category-specific guidance */}
              <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg p-4 space-y-2">
                <h4 className="font-semibold text-sm text-purple-900 dark:text-purple-100">
                  {formData.category.toUpperCase()} Guidelines
                </h4>
                <ul className="text-xs text-purple-800 dark:text-purple-200 space-y-1">
                  {formData.category === 'video' && (
                    <>
                      <li>• Add YouTube URL - thumbnail auto-loads</li>
                      <li>• Add duration (e.g., "18 min")</li>
                      <li>• Progress tracked automatically by user</li>
                      <li>• Only YouTube videos are supported</li>
                    </>
                  )}
                  {formData.category === 'pdf' && (
                    <>
                      <li>• Add file size (e.g., "2.5 MB")</li>
                      <li>• Add downloadUrl for PDF file</li>
                      <li>• Progress tracked automatically by user</li>
                      <li>• Consider tags for searchability</li>
                    </>
                  )}
                  {formData.category === 'ebook' && (
                    <>
                      <li>• Add duration as read time</li>
                      <li>• Use viewUrl for ebook page</li>
                      <li>• Progress tracked automatically by user</li>
                      <li>• Highlight interactive features</li>
                    </>
                  )}
                  {formData.category === 'tool' && (
                    <>
                      <li>• Describe tool functionality</li>
                      <li>• Use viewUrl for tool page</li>
                      <li>• Tag with tool type</li>
                    </>
                  )}
                  {formData.category === 'session' && (
                    <>
                      <li>• Add session duration</li>
                      <li>• Specify unlock requirements</li>
                      <li>• Consider setting as locked</li>
                    </>
                  )}
                  {formData.category === 'template' && (
                    <>
                      <li>• Add file size if downloadable</li>
                      <li>• Describe customization options</li>
                      <li>• Add relevant tags</li>
                    </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </TabsContent>

      {formData.category === 'ebook' && (
        <TabsContent value="upload" className="space-y-4 mt-4">
          {/* Template Download */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Upload className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm mb-1">Template de Ebook</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Use nosso template completo com 10 capítulos de exemplo e instruções detalhadas.
                </p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = '/ebook-template.md';
                      link.download = 'ebook-template.md';
                      link.click();
                    }}
                    className="gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Baixar Template
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTemplateGuide(true)}
                  >
                    Ver Guia
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="markdown-file">Upload Markdown File</Label>
            <Input
              id="markdown-file"
              type="file"
              accept=".md,.markdown"
              onChange={handleFileUpload}
              className="cursor-pointer"
            />
            <p className="text-sm text-muted-foreground">
              Faça upload de um arquivo .md formatado com capítulos (## CHAPTER X:)
            </p>
          </div>

          {/* Validation Results */}
          {validationResult && (
            <div className="space-y-3">
              {validationResult.errors.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <p className="font-semibold">Erros encontrados:</p>
                      <ul className="list-disc list-inside text-sm">
                        {validationResult.errors.map((error: string, i: number) => (
                          <li key={i}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {validationResult.warnings.length > 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <p className="font-semibold">Avisos:</p>
                      <ul className="list-disc list-inside text-sm">
                        {validationResult.warnings.map((warning: string, i: number) => (
                          <li key={i}>{warning}</li>
                        ))}
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {validationResult.isValid && (
                <Alert className="border-green-500 bg-green-50 dark:bg-green-950/30">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription>
                    <div className="space-y-1 text-green-900 dark:text-green-100">
                      <p className="font-semibold">Markdown validado com sucesso!</p>
                      <div className="text-sm space-y-1">
                        <p>• {validationResult.stats.totalChapters} capítulos</p>
                        <p>• {validationResult.stats.totalSections} seções</p>
                        <p>• {validationResult.stats.totalWords} palavras</p>
                        <p>• ~{validationResult.stats.estimatedReadingTime} min de leitura</p>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Chapters Preview */}
          {parsedChapters.length > 0 && (
            <div className="space-y-2">
              <Label>Preview dos Capítulos Parseados</Label>
              <ChaptersPreview chapters={parsedChapters} />
            </div>
          )}

          {markdownContent && (
            <div className="space-y-2">
              <Label>Markdown Source (Editável)</Label>
              <Textarea
                value={markdownContent}
                onChange={(e) => {
                  setMarkdownContent(e.target.value);
                  // Re-validate on edit
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
              <Button
                type="button"
                onClick={handleCreateEbook}
                disabled={ebookUploading || !validationResult?.isValid}
                className="w-full"
              >
                {ebookUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Upload className="mr-2 h-4 w-4" />
                Processar e Criar Ebook
              </Button>
            </div>
          )}
        </TabsContent>
      )}
    </Tabs>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving || !formData.title || !formData.description}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                bonus ? 'Update Bonus' : 'Create Bonus'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    {/* Template Guide Modal */}
    <TemplateGuideModal
      open={showTemplateGuide}
      onOpenChange={setShowTemplateGuide}
    />
  </>
  );
}
