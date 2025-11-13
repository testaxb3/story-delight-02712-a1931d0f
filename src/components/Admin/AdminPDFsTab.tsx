import { useCallback, useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { FileText, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { Badge } from '@/components/ui/badge';

interface AdminPDFsTabProps {
  onContentChanged?: () => void;
}

export function AdminPDFsTab({ onContentChanged }: AdminPDFsTabProps) {
  type Pdf = Database['public']['Tables']['pdfs']['Row'];

  const [pdfs, setPdfs] = useState<Pdf[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    category: 'guides',
    description: '',
    fileUrl: '',
    fileSize: '',
    pageCount: '',
    premiumOnly: false,
  });
  const [editingPdf, setEditingPdf] = useState<Pdf | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [deletePdfId, setDeletePdfId] = useState<string | null>(null);

  const resetForm = () => {
    setForm({
      title: '',
      category: 'guides',
      description: '',
      fileUrl: '',
      fileSize: '',
      pageCount: '',
      premiumOnly: false,
    });
  };

  const fetchPdfs = useCallback(async () => {
    const { data, error } = await supabase
      .from('pdfs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error(getErrorMessage(error, 'Failed to load PDFs'));
      return;
    }

    setPdfs((data as Pdf[]).map((pdf) => ({ ...pdf, premium_only: pdf.premium_only ?? false })));
  }, []);

  useEffect(() => {
    fetchPdfs();
  }, [fetchPdfs]);

  function getErrorMessage(error: unknown, fallback: string) {
    if (error && typeof error === 'object') {
      const message = 'message' in error ? (error as { message?: string }).message : undefined;
      const details = 'details' in error ? (error as { details?: string }).details : undefined;
      return [message, details].filter(Boolean).join(' ') || fallback;
    }

    return fallback;
  }

  const handleAddPDF = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.title.trim() || !form.fileUrl.trim()) {
      toast.error('Title and file URL are required');
      return;
    }

    setLoading(true);

    const payload = {
      title: form.title.trim(),
      category: form.category,
      description: form.description.trim() || null,
      file_url: form.fileUrl.trim(),
      file_size: form.fileSize.trim() || null,
      page_count: form.pageCount ? Number(form.pageCount) : null,
      premium_only: form.premiumOnly,
    };

    try {
      const { error } = await supabase.from('pdfs').insert(payload);

      if (error) {
        throw error;
      }

      toast.success('PDF added to library!');
      await fetchPdfs();
      onContentChanged?.();
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error, 'Failed to add PDF'));
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (pdf: Pdf) => {
    setEditingPdf(pdf);
    setForm({
      title: pdf.title,
      category: pdf.category,
      description: pdf.description || '',
      fileUrl: pdf.file_url,
      fileSize: pdf.file_size || '',
      pageCount: pdf.page_count ? String(pdf.page_count) : '',
      premiumOnly: pdf.premium_only ?? false,
    });
    setShowEditDialog(true);
  };

  const handleUpdatePDF = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!editingPdf || !form.title.trim() || !form.fileUrl.trim()) {
      toast.error('Title and file URL are required');
      return;
    }

    setLoading(true);

    const payload = {
      title: form.title.trim(),
      category: form.category,
      description: form.description.trim() || null,
      file_url: form.fileUrl.trim(),
      file_size: form.fileSize.trim() || null,
      page_count: form.pageCount ? Number(form.pageCount) : null,
      premium_only: form.premiumOnly,
    };

    try {
      const { error } = await supabase
        .from('pdfs')
        .update(payload)
        .eq('id', editingPdf.id);

      if (error) {
        throw error;
      }

      toast.success('PDF updated!');
      await fetchPdfs();
      onContentChanged?.();
      setShowEditDialog(false);
      setEditingPdf(null);
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error, 'Failed to update PDF'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('pdfs').delete().eq('id', id);

    if (error) {
      toast.error(getErrorMessage(error, 'Failed to delete PDF'));
      return;
    }

    toast.success('PDF deleted!');
    setDeletePdfId(null);
    await fetchPdfs();
    onContentChanged?.();
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white/90 backdrop-blur-glass border-none shadow-lg">
        <h2 className="text-xl font-bold mb-4">Add PDF</h2>
        <form onSubmit={handleAddPDF} className="space-y-4">
          <div>
            <Label htmlFor="pdf-title">Title</Label>
            <Input
              id="pdf-title"
              placeholder="PDF title"
              className="mt-1"
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="pdf-category">Category</Label>
            <Select
              value={form.category}
              onValueChange={(value) => setForm((prev) => ({ ...prev, category: value }))}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="guides">Guides</SelectItem>
                <SelectItem value="checklists">Checklists</SelectItem>
                <SelectItem value="templates">Templates</SelectItem>
                <SelectItem value="worksheets">Worksheets</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="pdf-description">Description</Label>
            <Textarea
              id="pdf-description"
              placeholder="Brief description"
              className="mt-1"
              rows={3}
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="pdf-url">File URL</Label>
            <Input
              id="pdf-url"
              placeholder="https://..."
              className="mt-1"
              value={form.fileUrl}
              onChange={(event) => setForm((prev) => ({ ...prev, fileUrl: event.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pdf-size">File Size (optional)</Label>
              <Input
                id="pdf-size"
                placeholder="2 MB"
                className="mt-1"
                value={form.fileSize}
                onChange={(event) => setForm((prev) => ({ ...prev, fileSize: event.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="pdf-pages">Page Count (optional)</Label>
              <Input
                id="pdf-pages"
                type="number"
                min={1}
                className="mt-1"
                value={form.pageCount}
                onChange={(event) => setForm((prev) => ({ ...prev, pageCount: event.target.value }))}
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="pdf-premium">Premium Content</Label>
            <Switch
              id="pdf-premium"
              checked={form.premiumOnly}
              onCheckedChange={(checked) => setForm((prev) => ({ ...prev, premiumOnly: checked }))}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Adding…' : 'Add PDF'}
          </Button>
        </form>
      </Card>

      <Card className="p-6 bg-white/90 backdrop-blur-glass border-none shadow-lg">
        <h2 className="text-xl font-bold mb-4">Existing PDFs ({pdfs.length})</h2>
        {pdfs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No PDFs published yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {pdfs.map((pdf) => (
              <Card key={pdf.id} className="p-4 relative group">
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEditClick(pdf)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => setDeletePdfId(pdf.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="text-primary">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{pdf.title}</p>
                    <p className="text-xs text-muted-foreground capitalize">{pdf.category}</p>
                  </div>
                  {pdf.premium_only ? (
                    <Badge variant="secondary" className="text-xs">Premium</Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">Free</Badge>
                  )}
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-xs"
                    onClick={() => window.open(pdf.file_url, '_blank', 'noopener,noreferrer')}
                  >
                    View PDF
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      {/* Edit PDF Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit PDF</DialogTitle>
            <DialogDescription>
              Update the PDF details below
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdatePDF} className="space-y-4">
            <div>
              <Label htmlFor="edit-pdf-title">Title</Label>
              <Input
                id="edit-pdf-title"
                placeholder="PDF title"
                className="mt-1"
                value={form.title}
                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="edit-pdf-category">Category</Label>
              <Select
                value={form.category}
                onValueChange={(value) => setForm((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="guides">Guides</SelectItem>
                  <SelectItem value="checklists">Checklists</SelectItem>
                  <SelectItem value="templates">Templates</SelectItem>
                  <SelectItem value="worksheets">Worksheets</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-pdf-description">Description</Label>
              <Textarea
                id="edit-pdf-description"
                placeholder="Brief description"
                className="mt-1"
                rows={3}
                value={form.description}
                onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="edit-pdf-url">File URL</Label>
              <Input
                id="edit-pdf-url"
                placeholder="https://..."
                className="mt-1"
                value={form.fileUrl}
                onChange={(event) => setForm((prev) => ({ ...prev, fileUrl: event.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-pdf-size">File Size (optional)</Label>
                <Input
                  id="edit-pdf-size"
                  placeholder="2 MB"
                  className="mt-1"
                  value={form.fileSize}
                  onChange={(event) => setForm((prev) => ({ ...prev, fileSize: event.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="edit-pdf-pages">Page Count (optional)</Label>
                <Input
                  id="edit-pdf-pages"
                  type="number"
                  min={1}
                  className="mt-1"
                  value={form.pageCount}
                  onChange={(event) => setForm((prev) => ({ ...prev, pageCount: event.target.value }))}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="edit-pdf-premium">Premium Content</Label>
              <Switch
                id="edit-pdf-premium"
                checked={form.premiumOnly}
                onCheckedChange={(checked) => setForm((prev) => ({ ...prev, premiumOnly: checked }))}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowEditDialog(false);
                  setEditingPdf(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Updating…' : 'Update PDF'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deletePdfId !== null} onOpenChange={() => setDeletePdfId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the PDF.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletePdfId && handleDelete(deletePdfId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
