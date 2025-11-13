import { useState } from 'react';
import { useEbooks, useDeleteEbook } from '@/hooks/useEbooks';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Trash2, Edit, ExternalLink, BookOpen, Clock, FileText } from 'lucide-react';
import { toast } from 'sonner';
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
import { Link } from 'react-router-dom';

interface EbooksListProps {
  onEdit?: (ebookId: string) => void;
}

export function EbooksList({ onEdit }: EbooksListProps) {
  const { ebooks, isLoading, refetch } = useEbooks();
  const deleteEbook = useDeleteEbook();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      await deleteEbook.mutateAsync(id);
      toast.success('Ebook deletado com sucesso');
      refetch();
    } catch (error) {
      console.error('Error deleting ebook:', error);
      toast.error('Erro ao deletar ebook');
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!ebooks || ebooks.length === 0) {
    return (
      <Card className="p-12 text-center">
        <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">Nenhum ebook criado</h3>
        <p className="text-muted-foreground mb-4">
          Crie seu primeiro ebook fazendo upload de um arquivo Markdown
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {ebooks.map((ebook) => (
          <Card key={ebook.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              {/* Thumbnail/Cover */}
              <div
                className="w-full h-32 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: ebook.cover_color }}
              >
                {ebook.thumbnail_url ? (
                  <img
                    src={ebook.thumbnail_url}
                    alt={ebook.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <BookOpen className="w-12 h-12 text-white/80" />
                )}
              </div>

              {/* Title & Subtitle */}
              <div>
                <h3 className="font-semibold text-lg line-clamp-2 mb-1">
                  {ebook.title}
                </h3>
                {ebook.subtitle && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {ebook.subtitle}
                  </p>
                )}
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs">
                  <FileText className="w-3 h-3 mr-1" />
                  {ebook.total_chapters} capítulos
                </Badge>
                {ebook.estimated_reading_time && (
                  <Badge variant="secondary" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    {ebook.estimated_reading_time} min
                  </Badge>
                )}
                {ebook.total_readers !== undefined && ebook.total_readers > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {ebook.total_readers} leitores
                  </Badge>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  asChild
                >
                  <Link to={`/ebook/${ebook.id}`} target="_blank">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Ver
                  </Link>
                </Button>
                {onEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(ebook.id)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeletingId(ebook.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deletar ebook?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O ebook será removido permanentemente
              e os usuários não poderão mais acessá-lo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingId && handleDelete(deletingId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
