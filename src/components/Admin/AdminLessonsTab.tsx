import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAdminLessons, useDeleteLesson, Lesson } from '@/hooks/useAdminLessons';
import { LessonImportModal } from './LessonImportModal';
import { LessonForm } from './LessonForm';
import { 
  Plus, 
  Loader2, 
  Music, 
  Pencil, 
  Trash2, 
  BookOpen,
  Clock,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
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

export function AdminLessonsTab() {
  const { data: lessons, isLoading, error } = useAdminLessons();
  const deleteLesson = useDeleteLesson();
  
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [deletingLesson, setDeletingLesson] = useState<Lesson | null>(null);

  const handleDelete = async () => {
    if (!deletingLesson) return;
    await deleteLesson.mutateAsync(deletingLesson.id);
    setDeletingLesson(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2 text-destructive">
        <AlertCircle className="w-5 h-5" />
        Failed to load lessons: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          <h2 className="font-semibold">Lessons</h2>
          <Badge variant="secondary">{lessons?.length || 0}</Badge>
        </div>
        <Button onClick={() => setImportModalOpen(true)} className="gap-2">
          <Sparkles className="w-4 h-4" />
          Import with AI
        </Button>
      </div>

      {/* Lessons List */}
      {!lessons?.length ? (
        <Card className="p-8 text-center">
          <BookOpen className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="font-medium mb-2">No lessons yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Import your lessons JSON to get started
          </p>
          <Button onClick={() => setImportModalOpen(true)} className="gap-2">
            <Sparkles className="w-4 h-4" />
            Import with AI
          </Button>
        </Card>
      ) : (
        <div className="space-y-2">
          {lessons.map((lesson) => (
            <Card 
              key={lesson.id}
              className="p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors"
            >
              {/* Day Badge */}
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-lg font-bold text-primary">{lesson.day_number}</span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium truncate">{lesson.title}</h4>
                  {lesson.audio_url && (
                    <Music className="w-4 h-4 text-emerald-500 shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {lesson.estimated_minutes && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {lesson.estimated_minutes} min
                    </span>
                  )}
                  {lesson.summary && (
                    <span className="truncate">{lesson.summary}</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditingLesson(lesson)}
                  className="h-8 w-8"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeletingLesson(lesson)}
                  className="h-8 w-8 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Import Modal */}
      <LessonImportModal 
        open={importModalOpen} 
        onOpenChange={setImportModalOpen} 
      />

      {/* Edit Modal */}
      <LessonForm
        lesson={editingLesson}
        open={!!editingLesson}
        onOpenChange={(open) => !open && setEditingLesson(null)}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingLesson} onOpenChange={(open) => !open && setDeletingLesson(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Lesson?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "Day {deletingLesson?.day_number}: {deletingLesson?.title}"? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteLesson.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
