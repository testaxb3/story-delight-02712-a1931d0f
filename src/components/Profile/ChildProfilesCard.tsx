import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Brain, Pencil, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getBrainTypeIcon } from '@/lib/brainTypes';
import { getBrainDescription } from '@/lib/profileUtils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { ChildProfile } from '@/contexts/ChildProfilesContext';

interface ChildProfilesCardProps {
  childProfiles: ChildProfile[];
  activeChild: ChildProfile | null;
  currentBrain: string;
  onSetActiveChild: (childId: string) => void;
  onRefreshChildren: () => Promise<void>;
}

export function ChildProfilesCard({
  childProfiles,
  activeChild,
  currentBrain,
  onSetActiveChild,
  onRefreshChildren,
}: ChildProfilesCardProps) {
  const navigate = useNavigate();
  const [editingAge, setEditingAge] = useState<string | null>(null);
  const [tempAge, setTempAge] = useState<number | ''>('');
  const [saving, setSaving] = useState(false);

  const handleStartEdit = (childId: string, currentAge: number | null) => {
    setEditingAge(childId);
    setTempAge(currentAge ?? '');
  };

  const handleCancelEdit = () => {
    setEditingAge(null);
    setTempAge('');
  };

  const handleSaveAge = async (childId: string) => {
    // Validate age
    const ageValue = typeof tempAge === 'number' ? tempAge : parseInt(String(tempAge), 10);
    
    if (!tempAge || ageValue < 1 || ageValue > 18 || isNaN(ageValue)) {
      toast.error('Please enter a valid age (1-18)');
      return;
    }

    setSaving(true);
    const { error } = await supabase
      .from('child_profiles')
      .update({ age: ageValue })
      .eq('id', childId);

    setSaving(false);

    if (error) {
      console.error('Error updating age:', error);
      toast.error('Failed to update age');
      return;
    }

    toast.success('Age updated successfully!');
    setEditingAge(null);
    setTempAge('');
    await onRefreshChildren();
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/10 dark:from-purple-950/30 dark:to-purple-900/30 border-purple-500/20 dark:border-purple-700/50 shadow-lg animate-in fade-in slide-in-from-bottom-5 duration-500 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Brain className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          <div>
            <h2 className="text-lg font-bold dark:text-purple-100">Child Profiles</h2>
            <Badge className="bg-purple-500/10 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-500/20 dark:border-purple-600/30 mt-1">
              Active: 🧠 {currentBrain}
            </Badge>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate('/quiz')} className="dark:border-purple-600/50 dark:hover:bg-purple-900/30 transition-colors">
          + Add Child
        </Button>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        {activeChild
          ? getBrainDescription(currentBrain)
          : 'Add your first child to personalize scripts, plans, and community prompts.'}
      </p>
      <div className="space-y-2 mb-4">
        {childProfiles.length > 0 ? (
          childProfiles.map((child, index) => (
            <div
              key={child.id}
              className={`w-full rounded-lg border px-4 py-3 transition-all duration-300 animate-in fade-in slide-in-from-left-2 ${
                activeChild?.id === child.id
                  ? 'bg-primary dark:bg-primary/90 text-white border-primary dark:border-primary/70 shadow dark:shadow-primary/20'
                  : 'bg-white/70 dark:bg-slate-800/40 text-foreground dark:border-slate-700/50'
              }`}
              style={{ animationDelay: `${index * 75}ms` }}
            >
              <div className="flex items-center justify-between">
                <button
                  onClick={() => onSetActiveChild(child.id)}
                  className="flex-1 text-left"
                >
                  <p className="text-sm font-semibold">{child.name}</p>
                  <p className="text-xs opacity-80">
                    {getBrainTypeIcon(child.brain_profile)} {child.brain_profile}
                    {child.age && ` • ${child.age} years`}
                  </p>
                </button>
                <div className="flex items-center gap-2">
                  {editingAge === child.id ? (
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <Input
                        type="number"
                        value={tempAge}
                        onChange={(e) => setTempAge(e.target.value ? parseInt(e.target.value) : '')}
                        className={`w-16 h-7 text-xs ${
                          activeChild?.id === child.id
                            ? 'bg-white/20 border-white/30 text-white placeholder:text-white/60'
                            : ''
                        }`}
                        placeholder="Age"
                        min="1"
                        max="18"
                        disabled={saving}
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0"
                        onClick={() => handleSaveAge(child.id)}
                        disabled={saving}
                      >
                        <Check className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0"
                        onClick={handleCancelEdit}
                        disabled={saving}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 opacity-70 hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartEdit(child.id, child.age);
                        }}
                      >
                        <Pencil className="w-3 h-3" />
                      </Button>
                      {activeChild?.id === child.id ? (
                        <Badge variant="secondary" className="bg-white/30 dark:bg-white/20 text-white border-white/30 dark:border-white/20">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-primary/30 dark:border-primary/50 text-primary dark:text-primary-foreground">
                          Switch
                        </Badge>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-lg border border-dashed border-purple-300 dark:border-purple-700 bg-white/60 dark:bg-purple-950/20 p-4 text-sm text-muted-foreground transition-colors">
            No child profiles yet. Tap "Add Child" to discover their brain profile.
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1 dark:border-purple-600/50 dark:hover:bg-purple-900/30 transition-colors" onClick={() => navigate('/tracker')}>
          Open My Plan
        </Button>
        <Button variant="outline" size="sm" className="flex-1 dark:border-purple-600/50 dark:hover:bg-purple-900/30 transition-colors" onClick={() => navigate('/scripts')}>
          View Scripts
        </Button>
      </div>
    </Card>
  );
}
