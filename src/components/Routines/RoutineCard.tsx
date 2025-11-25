import { motion } from 'framer-motion';
import { Play, Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Routine, RoutineStep } from '@/types/routine';

interface RoutineCardProps {
  routine: Routine & { routine_steps?: RoutineStep[] };
  onDelete: (id: string) => void;
}

export const RoutineCard = ({ routine, onDelete }: RoutineCardProps) => {
  const navigate = useNavigate();
  const stepCount = routine.routine_steps?.length || 0;
  const totalDuration = routine.routine_steps?.reduce(
    (acc, step) => acc + step.duration_seconds,
    0
  ) || 0;
  const minutes = Math.floor(totalDuration / 60);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-2xl p-4 space-y-3"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
            style={{ backgroundColor: `${routine.color}15` }}
          >
            {routine.icon}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{routine.title}</h3>
            <p className="text-sm text-muted-foreground">
              {stepCount} steps • {minutes}min
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => navigate(`/tools/routine-builder/${routine.id}/play`)}
          className="flex-1 h-10 rounded-xl bg-foreground text-background flex items-center justify-center gap-2 font-medium"
        >
          <Play className="w-4 h-4" />
          Start
        </button>
        <button
          onClick={() => navigate(`/tools/routine-builder/${routine.id}/edit`)}
          className="h-10 w-10 rounded-xl border border-border flex items-center justify-center"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(routine.id)}
          className="h-10 w-10 rounded-xl border border-border flex items-center justify-center text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};
