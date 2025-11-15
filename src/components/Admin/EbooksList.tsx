import { useState } from 'react';
import { useEbooks, useDeleteEbook } from '@/hooks/useEbooks';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Trash2, Edit, ExternalLink, BookOpen, Clock, FileText, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Link } from 'react-router-dom';
import { EbookEditModal } from './EbookEditModal';
import { EbookAnalytics } from './EbookAnalytics';
import { Ebook } from '@/hooks/useEbooks';

export function EbooksList() {
  const { ebooks, isLoading, refetch } = useEbooks();
  const deleteEbook = useDeleteEbook();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingEbook, setEditingEbook] = useState<Ebook | null>(null);
  const [analyticsEbookId, setAnalyticsEbookId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      await deleteEbook.mutateAsync(id);
      toast.success('Ebook deleted successfully');
      refetch();
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) return <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  if (!ebooks?.length) return <Card className="p-12 text-center"><BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" /><h3 className="text-lg font-semibold mb-2">No ebooks created</h3></Card>;

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {ebooks.map((ebook) => (
          <Card key={ebook.id} className="p-6">
            <div className="space-y-4">
              <div className="w-full h-32 rounded-lg flex items-center justify-center" style={{ backgroundColor: ebook.cover_color }}>
                {ebook.thumbnail_url ? <img src={ebook.thumbnail_url} alt={ebook.title} className="w-full h-full object-cover rounded-lg" /> : <BookOpen className="w-12 h-12 text-white/80" />}
              </div>
              <div><h3 className="font-semibold text-lg line-clamp-2">{ebook.title}</h3></div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs"><FileText className="w-3 h-3 mr-1" />{ebook.total_chapters} cap</Badge>
                {ebook.estimated_reading_time && <Badge variant="secondary" className="text-xs"><Clock className="w-3 h-3 mr-1" />{ebook.estimated_reading_time} min</Badge>}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" asChild><Link to={`/ebook/${ebook.id}`} target="_blank"><ExternalLink className="w-4 h-4 mr-1" />View</Link></Button>
                <Button variant="outline" size="sm" onClick={() => setEditingEbook(ebook)}><Edit className="w-4 h-4" /></Button>
                <Button variant="outline" size="sm" onClick={() => setAnalyticsEbookId(ebook.id)}><BarChart3 className="w-4 h-4" /></Button>
                <Button variant="outline" size="sm" onClick={() => setDeletingId(ebook.id)} className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {editingEbook && <EbookEditModal open={!!editingEbook} onOpenChange={(open) => !open && setEditingEbook(null)} ebook={editingEbook} onSuccess={() => { refetch(); setEditingEbook(null); }} />}
      <Dialog open={!!analyticsEbookId} onOpenChange={(open) => !open && setAnalyticsEbookId(null)}><DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto"><DialogHeader><DialogTitle>Analytics</DialogTitle></DialogHeader>{analyticsEbookId && <EbookAnalytics ebookId={analyticsEbookId} />}</DialogContent></Dialog>
      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete Ebook?</AlertDialogTitle><AlertDialogDescription>This action is irreversible</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => deletingId && handleDelete(deletingId)} className="bg-destructive">Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </>
  );
}
