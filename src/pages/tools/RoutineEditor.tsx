import { ArrowLeft, Plus, GripVertical, Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRoutines, useRoutineTemplates } from '@/hooks/useRoutines';
import { toast } from 'sonner';
import type { RoutineStep } from '@/types/routine';

export default function RoutineEditor() {
  const { routineId } = useParams();
  const navigate = useNavigate();
  const isNew = routineId === 'new';
  
  const { routines, createRoutine, updateRoutine, createStep, deleteStep } = useRoutines();
  const { templates } = useRoutineTemplates();
  
  const [title, setTitle] = useState('');
  const [icon, setIcon] = useState('📋');
  const [color, setColor] = useState('#8B5CF6');
  const [steps, setSteps] = useState<Array<Partial<RoutineStep>>>([]);
  const [showTemplates, setShowTemplates] = useState(isNew);

  useEffect(() => {
    if (!isNew && routines) {
      const routine = routines.find((r) => r.id === routineId);
      if (routine) {
        setTitle(routine.title);
        setIcon(routine.icon);
        setColor(routine.color);
        setSteps(routine.routine_steps || []);
      }
    }
  }, [isNew, routineId, routines]);

  const handleAddStep = () => {
    setSteps([
      ...steps,
      {
        title: '',
        icon: '✓',
        duration_seconds: 300,
        position: steps.length,
      },
    ]);
  };

  const handleRemoveStep = (index: number) => {
    const step = steps[index];
    if (step.id) {
      deleteStep.mutate(step.id);
    }
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Please enter a routine title');
      return;
    }

    if (steps.length === 0) {
      toast.error('Please add at least one step');
      return;
    }

    try {
      if (isNew) {
        const { id: newRoutineId } = await createRoutine.mutateAsync({
          title,
          icon,
          color,
        });

        for (let i = 0; i < steps.length; i++) {
          await createStep.mutateAsync({
            routine_id: newRoutineId,
            title: steps[i].title,
            icon: steps[i].icon,
            duration_seconds: steps[i].duration_seconds,
            position: i,
          });
        }

        toast.success('Routine created!');
        navigate('/tools/routine-builder');
      } else {
        await updateRoutine.mutateAsync({
          id: routineId!,
          title,
          icon,
          color,
        });

        toast.success('Routine updated!');
        navigate('/tools/routine-builder');
      }
    } catch (error) {
      toast.error('Failed to save routine');
    }
  };

  const handleUseTemplate = (template: any) => {
    setTitle(template.title);
    setIcon(template.icon);
    setColor(template.color);
    setSteps(
      template.template_steps.map((step: any, index: number) => ({
        title: step.title,
        icon: step.icon,
        duration_seconds: step.duration,
        position: index,
      }))
    );
    setShowTemplates(false);
  };

  if (showTemplates && templates) {
    return (
      <div className="min-h-screen bg-background">
        <div className="fixed top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border">
          <div className="px-4 h-14 flex items-center justify-between">
            <button
              onClick={() => setShowTemplates(false)}
              className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold">Choose Template</h1>
            <div className="w-10" />
          </div>
        </div>

        <div className="pt-20 pb-24 px-4 space-y-3">
          {templates.map((template) => (
            <motion.button
              key={template.id}
              onClick={() => handleUseTemplate(template)}
              className="w-full bg-card border border-border rounded-2xl p-4 text-left"
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: `${template.color}15` }}
                >
                  {template.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{template.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {template.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {template.template_steps.length} steps • {template.brain_profile}
                  </p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="fixed top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => navigate('/tools/routine-builder')}
            className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">{isNew ? 'New' : 'Edit'} Routine</h1>
          <button
            onClick={handleSave}
            className="text-foreground font-semibold"
          >
            Save
          </button>
        </div>
      </div>

      <div className="pt-20 px-4 space-y-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground">Routine Name</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Morning Routine"
              className="w-full h-12 px-4 rounded-xl border border-border bg-transparent mt-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground">Icon</label>
              <input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-border bg-transparent mt-2 text-center text-2xl"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Color</label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full h-12 rounded-xl border border-border bg-transparent mt-2"
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Steps</h2>
            <button
              onClick={handleAddStep}
              className="h-10 px-4 rounded-full bg-foreground text-background flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Step
            </button>
          </div>

          {steps.map((step, index) => (
            <div key={index} className="bg-card border border-border rounded-xl p-3 space-y-3">
              <div className="flex items-start gap-2">
                <GripVertical className="w-5 h-5 text-muted-foreground mt-3" />
                <div className="flex-1 space-y-3">
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => {
                      const newSteps = [...steps];
                      newSteps[index].title = e.target.value;
                      setSteps(newSteps);
                    }}
                    placeholder="Step name"
                    className="w-full h-10 px-3 rounded-lg border border-border bg-transparent"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={step.icon}
                      onChange={(e) => {
                        const newSteps = [...steps];
                        newSteps[index].icon = e.target.value;
                        setSteps(newSteps);
                      }}
                      className="h-10 px-3 rounded-lg border border-border bg-transparent text-center"
                    />
                    <input
                      type="number"
                      value={Math.floor((step.duration_seconds || 0) / 60)}
                      onChange={(e) => {
                        const newSteps = [...steps];
                        newSteps[index].duration_seconds = parseInt(e.target.value) * 60;
                        setSteps(newSteps);
                      }}
                      placeholder="Minutes"
                      className="h-10 px-3 rounded-lg border border-border bg-transparent"
                    />
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveStep(index)}
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
