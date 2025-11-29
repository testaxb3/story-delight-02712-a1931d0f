import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useConfirm } from '@/hooks/useConfirm';
import { useAdminRateLimit } from '@/hooks/useAdminRateLimit';
import { BonusData } from '@/components/bonuses/BonusCard';
import { BonusCard } from '@/components/bonuses/BonusCard';
import { BonusesTable } from './BonusesTable';
import { SimplifiedBonusForm } from './SimplifiedBonusForm';
import { OrphanedEbooksManager } from './OrphanedEbooksManager';
import { AdminAuditLog } from './AdminAuditLog';
import { supabase } from '@/integrations/supabase/client';
import {
  useBonuses,
  useCreateBonus,
  useUpdateBonus,
  useDeleteBonus,
  useDeleteBonuses,
  useToggleBonusLock,
  useDuplicateBonus,
  useBonusStats
} from '@/hooks/useBonuses';
import { useUpdateEbook } from '@/hooks/useEbooks';
import {
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  FileJson,
  ChevronDown,
  ChevronUp,
  Loader2,
  Archive,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface AdminBonusesTabProps {
  onContentChanged?: () => void;
}

export function AdminBonusesTab({ onContentChanged }: AdminBonusesTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'title' | 'category' | 'newest' | 'locked'>('title');
  const [showFilters, setShowFilters] = useState(false);

  // Form modal state
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingBonus, setEditingBonus] = useState<BonusData | null>(null);

  // Preview modal state
  const [previewBonus, setPreviewBonus] = useState<BonusData | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Bulk actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Confirmation and rate limiting
  const { confirm, ConfirmDialogComponent } = useConfirm();
  const deleteRateLimit = useAdminRateLimit(10, 60000, 'delete bonuses');
  const bulkActionRateLimit = useAdminRateLimit(5, 60000, 'bulk operations');

  // Import/Export
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importJson, setImportJson] = useState('');

  // Fetch bonuses from Supabase with filters
  const { data: bonusesData, isLoading, error } = useBonuses({
    category: filterCategory !== 'all' ? filterCategory : undefined,
    search: searchQuery
  });
  const bonuses = bonusesData?.data || [];

  // Mutations
  const createMutation = useCreateBonus();
  const updateMutation = useUpdateBonus();
  const deleteMutation = useDeleteBonus();
  const deleteBulkMutation = useDeleteBonuses();
  const toggleLockMutation = useToggleBonusLock();
  const duplicateMutation = useDuplicateBonus();
  const updateEbook = useUpdateEbook();

  // Stats
  const { data: stats } = useBonusStats();

  // Sort bonuses locally
  const filteredAndSortedBonuses = useMemo(() => {
    const sorted = [...bonuses];
    switch (sortBy) {
      case 'title':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'category':
        return sorted.sort((a, b) => a.category.localeCompare(b.category));
      case 'newest':
        return sorted.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      case 'locked':
        return sorted.sort((a, b) => (b.locked ? 1 : 0) - (a.locked ? 1 : 0));
      default:
        return sorted;
    }
  }, [bonuses, sortBy]);

  // Handlers
  const handleCreate = () => {
    setEditingBonus(null);
    setShowFormModal(true);
  };

  const handleEdit = (bonus: BonusData) => {
    setEditingBonus(bonus);
    setShowFormModal(true);
  };

  const handleSave = async (bonusData: any, ebookData?: { chapters: any[], markdownSource: string }) => {
    try {
      let savedBonusId: string;

      if (editingBonus) {
        // Update existing
        await updateMutation.mutateAsync({
          id: editingBonus.id,
          updates: bonusData
        });
        savedBonusId = editingBonus.id;
        toast.success('Bonus updated successfully!');
      } else {
        // Create new
        const result = await createMutation.mutateAsync(bonusData as Omit<BonusData, 'id'>);
        savedBonusId = result.id;

        // If this is an ebook bonus with markdown data, create the ebook in Supabase
        if (ebookData && ebookData.chapters.length > 0) {
          try {
            // Create a slug from the title
            const slug = bonusData.title
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-+|-+$/g, '');

            // Calculate reading stats
            const totalWords = ebookData.markdownSource.split(/\s+/).length;
            const estimatedTime = Math.ceil(totalWords / 200); // 200 words per minute

            // Insert ebook into database
            const { data: ebook, error: ebookError } = await supabase
              .from('ebooks')
              .insert({
                title: bonusData.title,
                subtitle: bonusData.description.substring(0, 200),
                slug: slug,
                content: ebookData.chapters,
                markdown_source: ebookData.markdownSource,
                total_chapters: ebookData.chapters.length,
                total_words: totalWords,
                estimated_reading_time: estimatedTime,
                bonus_id: savedBonusId,
                cover_color: '#8b5cf6',
              })
              .select()
              .single();

            if (ebookError) {
              console.error('Error creating ebook:', ebookError);
              toast.error('Bonus created but error creating ebook');
            } else {
              // Update bonus with ebook view URL
              await updateMutation.mutateAsync({
                id: savedBonusId,
                updates: {
                  viewUrl: `/ebook/${ebook.id}`,
                }
              });
              toast.success('Bonus and ebook created successfully! ✅');
            }
          } catch (ebookError) {
            console.error('Error creating ebook:', ebookError);
            toast.error('Bonus created but error creating ebook');
          }
        } else {
          toast.success('Bonus created successfully!');
        }
      }

      setShowFormModal(false);
      setEditingBonus(null);
      onContentChanged?.();
    } catch (error) {
      console.error('Error saving bonus:', error);
      toast.error('Error saving bonus');
    }
  };

  const handleDelete = async (id: string) => {
    // Check rate limit
    if (!deleteRateLimit.checkRateLimit()) {
      return;
    }

    // Confirm deletion
    const confirmed = await confirm({
      title: 'Delete Bonus',
      description: 'Are you sure you want to delete this bonus? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'destructive',
    });

    if (!confirmed) return;

    try {
      await deleteMutation.mutateAsync(id);
      onContentChanged?.();
      toast.success('Bonus deleted successfully');
    } catch (error) {
      console.error('Error deleting bonus:', error);
      toast.error('Failed to delete bonus');
    }
  };

  const handleBulkDelete = async () => {
    // Check rate limit
    if (!bulkActionRateLimit.checkRateLimit()) {
      return;
    }

    // Confirm bulk deletion
    const confirmed = await confirm({
      title: 'Delete Multiple Bonuses',
      description: `Are you sure you want to delete ${selectedIds.length} bonus${selectedIds.length > 1 ? 'es' : ''}? This action cannot be undone.`,
      confirmText: 'Delete All',
      cancelText: 'Cancel',
      variant: 'destructive',
    });

    if (!confirmed) return;

    try {
      await deleteBulkMutation.mutateAsync(selectedIds);
      setSelectedIds([]);
      onContentChanged?.();
      toast.success(`${selectedIds.length} bonuses deleted successfully`);
    } catch (error) {
      console.error('Error bulk deleting bonuses:', error);
      toast.error('Failed to delete bonuses');
    }
  };

  const handleToggleLock = async (id: string) => {
    try {
      await toggleLockMutation.mutateAsync(id);
      onContentChanged?.();
    } catch (error) {
      console.error('Error toggling lock:', error);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      await duplicateMutation.mutateAsync(id);
      onContentChanged?.();
    } catch (error) {
      console.error('Error duplicating bonus:', error);
    }
  };

  const handleToggleHero = async (bonus: BonusData) => {
    try {
      const tags = bonus.tags || [];
      const isHero = tags.includes('hero');
      let newTags;

      if (isHero) {
        newTags = tags.filter(t => t !== 'hero');
      } else {
        // Optional: Remove hero from others to ensure single hero? 
        // For now, just add it. The frontend picks the first one.
        newTags = [...tags, 'hero'];
      }

      await updateMutation.mutateAsync({
        id: bonus.id,
        updates: { tags: newTags }
      });
      
      toast.success(isHero ? 'Removed from Hero' : 'Set as Hero');
      onContentChanged?.();
    } catch (error) {
      console.error('Error toggling hero status:', error);
      toast.error('Failed to update hero status');
    }
  };

  const handlePreview = (bonus: BonusData) => {
    setPreviewBonus(bonus);
    setShowPreviewModal(true);
  };

  const handleExport = () => {
    const json = JSON.stringify(bonuses, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nep-bonuses-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Bonuses exported to JSON');
  };

  const handleImport = async () => {
    try {
      const imported = JSON.parse(importJson);

      if (!Array.isArray(imported)) {
        toast.error('Invalid format: expected array');
        return;
      }

      // Validate each item
      for (const item of imported) {
        if (!item.title || !item.category || !item.description) {
          toast.error('Invalid bonus data: missing required fields');
          return;
        }
      }

      // Import each bonus
      for (const bonus of imported) {
        const { id, ...bonusData } = bonus; // Remove ID to create new
        await createMutation.mutateAsync(bonusData);
      }

      toast.success(`Imported ${imported.length} bonuses!`);
      setShowImportDialog(false);
      setImportJson('');
      onContentChanged?.();
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import: Invalid JSON format');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-3 text-lg">Loading bonuses...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">Error loading bonuses</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 border-blue-200">
          <div className="text-sm font-medium text-blue-900 dark:text-blue-100">Total</div>
          <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">{stats?.total || 0}</div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 border-green-200">
          <div className="text-sm font-medium text-green-900 dark:text-green-100">Unlocked</div>
          <div className="text-3xl font-bold text-green-900 dark:text-green-100">{stats?.unlocked || 0}</div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950/30 dark:to-yellow-900/30 border-yellow-200">
          <div className="text-sm font-medium text-yellow-900 dark:text-yellow-100">Locked</div>
          <div className="text-3xl font-bold text-yellow-900 dark:text-yellow-100">{stats?.locked || 0}</div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 border-purple-200">
          <div className="text-sm font-medium text-purple-900 dark:text-purple-100">New</div>
          <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">{stats?.new || 0}</div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/30 border-red-200">
          <div className="text-sm font-medium text-red-900 dark:text-red-100">Videos</div>
          <div className="text-3xl font-bold text-red-900 dark:text-red-100">{stats?.byCategory.video || 0}</div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/30 border-emerald-200">
          <div className="text-sm font-medium text-emerald-900 dark:text-emerald-100">PDFs</div>
          <div className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">{stats?.byCategory.pdf || 0}</div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/30 border-orange-200">
          <div className="text-sm font-medium text-orange-900 dark:text-orange-100">Other</div>
          <div className="text-3xl font-bold text-orange-900 dark:text-orange-100">
            {(stats?.byCategory.ebook || 0) + (stats?.byCategory.tool || 0) + (stats?.byCategory.template || 0) + (stats?.byCategory.session || 0)}
          </div>
        </Card>
      </div>

      {/* Actions Bar */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleCreate} className="gap-2">
              <Plus className="w-4 h-4" />
              Add New Bonus
            </Button>
            {selectedIds.length > 0 && (
              <Button
                variant="destructive"
                onClick={handleBulkDelete}
                className="gap-2"
                disabled={deleteBulkMutation.isPending}
              >
                {deleteBulkMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                Delete Selected ({selectedIds.length})
              </Button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowImportDialog(true)} className="gap-2">
              <Upload className="w-4 h-4" />
              Import
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
              {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-xs mb-2">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search bonuses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs mb-2">Category</Label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="ebook">Ebook</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="tool">Tool</SelectItem>
                  <SelectItem value="template">Template</SelectItem>
                  <SelectItem value="session">Session</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs mb-2">Sort By</Label>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title">Title (A-Z)</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="locked">Locked First</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setFilterCategory('all');
                  setSortBy('title');
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Tabs for different management views */}
      <Tabs defaultValue="bonuses" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="bonuses">Bonuses</TabsTrigger>
          <TabsTrigger value="orphaned">
            <Archive className="h-4 w-4 mr-2" />
            Orphaned Ebooks
          </TabsTrigger>
          <TabsTrigger value="audit">
            <Shield className="h-4 w-4 mr-2" />
            Audit Log
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bonuses" className="space-y-6 mt-6">
          {/* Bonuses Table */}
          <Card className="p-6">
            <div className="mb-4">
              <h2 className="text-xl font-bold">
                Bonuses ({filteredAndSortedBonuses.length})
              </h2>
            </div>
            <BonusesTable
              bonuses={filteredAndSortedBonuses}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleLock={handleToggleLock}
              onDuplicate={handleDuplicate}
              onPreview={handlePreview}
              onToggleHero={handleToggleHero}
            />
          </Card>
        </TabsContent>

        <TabsContent value="orphaned" className="space-y-6 mt-6">
          <OrphanedEbooksManager />
        </TabsContent>

        <TabsContent value="audit" className="space-y-6 mt-6">
          <AdminAuditLog />
        </TabsContent>
      </Tabs>

      {/* Form Modal */}
      <SimplifiedBonusForm
        open={showFormModal}
        onOpenChange={setShowFormModal}
        bonus={editingBonus}
        onSave={handleSave}
        saving={createMutation.isPending || updateMutation.isPending}
      />

      {/* Preview Modal */}
      <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Bonus Preview</DialogTitle>
          </DialogHeader>
          {previewBonus && (
            <div className="py-4">
              <BonusCard bonus={previewBonus} />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      {ConfirmDialogComponent}

      {/* Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileJson className="w-5 h-5" />
              Import Bonuses from JSON
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="import-json">Paste JSON data</Label>
              <textarea
                id="import-json"
                value={importJson}
                onChange={(e) => setImportJson(e.target.value)}
                placeholder='[{"title": "Bonus Title", "description": "...", "category": "video", ...}]'
                className="w-full h-64 p-3 border rounded-md font-mono text-sm"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowImportDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleImport} disabled={!importJson.trim()}>
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
