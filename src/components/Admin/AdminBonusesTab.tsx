import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { BonusData } from '@/components/bonuses/BonusCard';
import { BonusCard } from '@/components/bonuses/BonusCard';
import { BonusesTable } from './BonusesTable';
import { BonusFormModal } from './BonusFormModal';
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
  Loader2
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
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);

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

  const handleSave = async (bonusData: any) => {
    try {
      const selectedEbookId = bonusData._selectedEbookId;

      // Remove _selectedEbookId before saving to database
      const { _selectedEbookId, ...cleanBonusData } = bonusData;

      let savedBonusId: string;

      if (editingBonus) {
        // Update existing
        await updateMutation.mutateAsync({
          id: editingBonus.id,
          updates: cleanBonusData
        });
        savedBonusId = editingBonus.id;
      } else {
        // Create new
        const result = await createMutation.mutateAsync(cleanBonusData as Omit<BonusData, 'id'>);
        savedBonusId = result.id;
      }

      // ✅ If ebook was selected, link it to the bonus
      if (selectedEbookId && savedBonusId) {
        try {
          await updateEbook.mutateAsync({
            id: selectedEbookId,
            updates: {
              bonus_id: savedBonusId,
            },
          });
          toast.success('Bonus created and ebook linked successfully! ✅');
        } catch (linkError) {
          console.error('Error linking ebook:', linkError);
          toast.error('Bonus created but error linking ebook');
        }
      }

      setShowFormModal(false);
      setEditingBonus(null);
      onContentChanged?.();
    } catch (error) {
      console.error('Error saving bonus:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      onContentChanged?.();
    } catch (error) {
      console.error('Error deleting bonus:', error);
    }
  };

  const handleBulkDelete = async () => {
    try {
      await deleteBulkMutation.mutateAsync(selectedIds);
      setSelectedIds([]);
      setShowBulkDeleteDialog(false);
      onContentChanged?.();
    } catch (error) {
      console.error('Error bulk deleting bonuses:', error);
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
                onClick={() => setShowBulkDeleteDialog(true)}
                className="gap-2"
              >
                <Trash2 className="w-4 h-4" />
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
        />
      </Card>

      {/* Form Modal */}
      <BonusFormModal
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

      {/* Bulk Delete Dialog */}
      <AlertDialog open={showBulkDeleteDialog} onOpenChange={setShowBulkDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedIds.length} bonuses?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the selected bonuses. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
