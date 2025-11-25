import { ArrowLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRoutines } from '@/hooks/useRoutines';
import { RoutineCard } from '@/components/Routines/RoutineCard';
import { toast } from 'sonner';

export default function RoutineBuilder() {
  const navigate = useNavigate();
  const { routines, isLoading, deleteRoutine } = useRoutines();

  const handleDelete = (id: string) => {
    if (confirm('Delete this routine?')) {
      deleteRoutine.mutate(id, {
        onSuccess: () => toast.success('Routine deleted'),
        onError: () => toast.error('Failed to delete routine'),
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => navigate('/bonuses')}
            className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Visual Routines</h1>
          <button
            onClick={() => navigate('/tools/routine-builder/new')}
            className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="pt-20 pb-24 px-4 space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-card animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : routines && routines.length > 0 ? (
          routines.map((routine) => (
            <RoutineCard
              key={routine.id}
              routine={routine}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 space-y-4"
          >
            <div className="text-6xl">📋</div>
            <h2 className="text-2xl font-bold text-foreground">No routines yet</h2>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Create visual step-by-step routines to help your child know what comes next
            </p>
            <button
              onClick={() => navigate('/tools/routine-builder/new')}
              className="mx-auto h-12 px-8 rounded-full bg-foreground text-background font-medium"
            >
              Create First Routine
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
