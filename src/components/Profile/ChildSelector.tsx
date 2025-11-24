import { motion } from 'framer-motion';
import { Check, Plus, Pencil } from 'lucide-react';
import { useChildProfiles } from '@/contexts/ChildProfilesContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const getBrainProfileColor = (profile: string) => {
  switch (profile) {
    case 'INTENSE':
      return 'from-orange-400 to-orange-600';
    case 'DISTRACTED':
      return 'from-blue-400 to-blue-600';
    case 'DEFIANT':
      return 'from-purple-400 to-purple-600';
    default:
      return 'from-gray-400 to-gray-600';
  }
};

const getBrainProfileIcon = (profile: string) => {
  switch (profile) {
    case 'INTENSE':
      return '🔥';
    case 'DISTRACTED':
      return '🦋';
    case 'DEFIANT':
      return '⚡';
    default:
      return '👶';
  }
};

export function ChildSelector() {
  const navigate = useNavigate();
  const { childProfiles, activeChild, setActiveChild, loading, refreshChildren } = useChildProfiles();
  const [editingChildId, setEditingChildId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editAge, setEditAge] = useState<number | ''>('');
  const [saving, setSaving] = useState(false);

  const handleStartEdit = (childId: string, name: string, age: number | null) => {
    setEditingChildId(childId);
    setEditName(name);
    setEditAge(age ?? '');
  };

  const handleSaveEdit = async (childId: string) => {
    if (!editName.trim()) {
      toast.error('Name is required');
      return;
    }

    const ageValue = editAge === '' ? null : Number(editAge);
    if (ageValue !== null && (isNaN(ageValue) || ageValue < 1 || ageValue > 18)) {
      toast.error('Please enter a valid age (1-18)');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('child_profiles')
        .update({
          name: editName.trim(),
          age: ageValue,
          updated_at: new Date().toISOString()
        })
        .eq('id', childId);

      if (error) throw error;

      toast.success('Child updated successfully!');
      setEditingChildId(null);
      await refreshChildren();
    } catch (error) {
      console.error('Error updating child:', error);
      toast.error('Failed to update. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="h-20 bg-card rounded-2xl border border-border/50 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Child Cards */}
      {childProfiles.map((child, index) => {
        const isActive = activeChild?.id === child.id;
        const isEditing = editingChildId === child.id;

        return (
          <motion.div
            key={child.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`
              w-full bg-card rounded-2xl p-4 border-2 transition-all
              ${isActive
                ? 'border-primary shadow-lg shadow-primary/20'
                : 'border-border/50 hover:border-border'
              }
            `}
          >
            {isEditing ? (
              /* Edit Mode */
              <div className="space-y-3">
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Child name"
                  disabled={saving}
                />
                <Input
                  type="number"
                  value={editAge}
                  onChange={(e) => setEditAge(e.target.value ? parseInt(e.target.value) : '')}
                  placeholder="Age (1-18)"
                  min="1"
                  max="18"
                  disabled={saving}
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleSaveEdit(child.id)}
                    disabled={saving}
                    className="flex-1"
                  >
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingChildId(null)}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              /* View Mode */
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <button
                  onClick={() => setActiveChild(child.id)}
                  className="relative flex-shrink-0"
                >
                  <div
                    className={`
                      w-14 h-14 rounded-full bg-gradient-to-br ${getBrainProfileColor(child.brain_profile)}
                      flex items-center justify-center text-2xl overflow-hidden
                      ring-2 ring-background
                    `}
                  >
                    {child.photo_url ? (
                      <img
                        src={child.photo_url}
                        alt={child.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{getBrainProfileIcon(child.brain_profile)}</span>
                    )}
                  </div>

                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg"
                    >
                      <Check className="w-3.5 h-3.5 text-primary-foreground" />
                    </motion.div>
                  )}
                </button>

                {/* Info */}
                <button
                  onClick={() => setActiveChild(child.id)}
                  className="flex-1 text-left min-w-0"
                >
                  <h4 className="font-semibold text-foreground text-base leading-tight mb-0.5">
                    {child.name}
                  </h4>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <span>{getBrainProfileIcon(child.brain_profile)}</span>
                    <span className="font-medium">{child.brain_profile}</span>
                    {child.age && (
                      <>
                        <span className="text-muted-foreground/50">•</span>
                        <span>{child.age} years old</span>
                      </>
                    )}
                  </p>
                </button>

                {/* Edit Button */}
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-8 h-8 p-0"
                  onClick={() => handleStartEdit(child.id, child.name, child.age ?? null)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
              </div>
            )}
          </motion.div>
        );
      })}

      {/* Add Child Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: childProfiles.length * 0.05 }}
        onClick={() => navigate('/quiz')}
        className="w-full bg-card rounded-2xl p-4 border-2 border-dashed border-border/50 hover:border-primary hover:bg-primary/5 transition-all group"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
            <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <div className="flex-1 text-left">
            <h4 className="font-semibold text-foreground text-base">Add another child</h4>
            <p className="text-xs text-muted-foreground">Take the quiz for a new profile</p>
          </div>
        </div>
      </motion.button>
    </div>
  );
}
