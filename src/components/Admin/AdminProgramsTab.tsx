import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAdminPrograms, useDeleteProgram, useDeleteLesson, ProgramWithLessons, Lesson } from '@/hooks/useAdminPrograms';
import { ProgramCard } from './ProgramCard';
import { ProgramForm } from './ProgramForm';
import { LessonFormV2 } from './LessonFormV2';
import { Plus, Loader2, GraduationCap, AlertCircle } from 'lucide-react';
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

export function AdminProgramsTab() {
  const { data: programs, isLoading, error } = useAdminPrograms();
  const deleteProgram = useDeleteProgram();
  const deleteLesson = useDeleteLesson();

  const [programFormOpen, setProgramFormOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<ProgramWithLessons | null>(null);
  const [deletingProgram, setDeletingProgram] = useState<ProgramWithLessons | null>(null);

  const [lessonFormOpen, setLessonFormOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [lessonProgramId, setLessonProgramId] = useState<string | null>(null);
  const [deletingLesson, setDeletingLesson] = useState<Lesson | null>(null);

  const handleAddProgram = () => {
    setEditingProgram(null);
    setProgramFormOpen(true);
  };

  const handleEditProgram = (program: ProgramWithLessons) => {
    setEditingProgram(program);
    setProgramFormOpen(true);
  };

  const handleDeleteProgram = async () => {
    if (!deletingProgram) return;
    await deleteProgram.mutateAsync(deletingProgram.id);
    setDeletingProgram(null);
  };

  const handleAddLesson = (programId: string) => {
    setEditingLesson(null);
    setLessonProgramId(programId);
    setLessonFormOpen(true);
  };

  const handleEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setLessonProgramId(lesson.program_id);
    setLessonFormOpen(true);
  };

  const handleDeleteLesson = async () => {
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
        Failed to load programs: {error.message}
      </div>
    );
  }

  const totalLessons = programs?.reduce((acc, p) => acc + p.lessons.length, 0) || 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-primary" />
          <h2 className="font-semibold">Programs</h2>
          <Badge variant="secondary">{programs?.length || 0} programs</Badge>
          <Badge variant="outline">{totalLessons} lessons</Badge>
        </div>
        <Button onClick={handleAddProgram} className="gap-2">
          <Plus className="w-4 h-4" />
          New Program
        </Button>
      </div>

      {/* Programs List */}
      {!programs?.length ? (
        <Card className="p-8 text-center">
          <GraduationCap className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="font-medium mb-2">No programs yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create your first program to get started
          </p>
          <Button onClick={handleAddProgram} className="gap-2">
            <Plus className="w-4 h-4" />
            New Program
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {programs.map((program) => (
            <ProgramCard
              key={program.id}
              program={program}
              onEditProgram={() => handleEditProgram(program)}
              onDeleteProgram={() => setDeletingProgram(program)}
              onAddLesson={() => handleAddLesson(program.id)}
              onEditLesson={handleEditLesson}
              onDeleteLesson={setDeletingLesson}
            />
          ))}
        </div>
      )}

      {/* Program Form Modal */}
      <ProgramForm
        program={editingProgram}
        open={programFormOpen}
        onOpenChange={setProgramFormOpen}
      />

      {/* Lesson Form Modal */}
      <LessonFormV2
        lesson={editingLesson}
        programId={lessonProgramId}
        programs={programs || []}
        open={lessonFormOpen}
        onOpenChange={setLessonFormOpen}
      />

      {/* Delete Program Confirmation */}
      <AlertDialog open={!!deletingProgram} onOpenChange={(open) => !open && setDeletingProgram(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Program?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingProgram?.title}"? 
              This will also delete all {deletingProgram?.lessons.length || 0} lessons in this program.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProgram}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteProgram.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Lesson Confirmation */}
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
              onClick={handleDeleteLesson}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteLesson.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
