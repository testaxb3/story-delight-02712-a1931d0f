import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useChildProfiles, ChildProfile } from '@/contexts/ChildProfilesContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Check, Loader2, Plus, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface ChildProfilesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface EditingChild {
  id: string;
  name: string;
  age: number | null;
  photo_url: string | null;
}

export function ChildProfilesModal({ open, onOpenChange }: ChildProfilesModalProps) {
  const { childProfiles, activeChild, setActiveChild, refreshChildren } = useChildProfiles();
  const navigate = useNavigate();
  const [editingChild, setEditingChild] = useState<EditingChild | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const getInitials = (name: string) => name.substring(0, 2).toUpperCase();

  const handleEditChild = (child: ChildProfile) => {
    setEditingChild({
      id: child.id,
      name: child.name,
      age: child.age ?? null,
      photo_url: child.photo_url ?? null,
    });
  };

  const handleSave = async () => {
    if (!editingChild) return;
    
    if (!editingChild.name.trim()) {
      toast.error('Name is required');
      return;
    }

    if (editingChild.age !== null && (editingChild.age < 1 || editingChild.age > 18)) {
      toast.error('Age must be between 1 and 18');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('child_profiles')
        .update({
          name: editingChild.name.trim(),
          age: editingChild.age,
          photo_url: editingChild.photo_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingChild.id);

      if (error) throw error;

      toast.success('Profile updated');
      await refreshChildren();
      setEditingChild(null);
    } catch (err) {
      console.error('Failed to update child profile:', err);
      toast.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingChild || !e.target.files?.[0]) return;

    const file = e.target.files[0];
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `child-${editingChild.id}-${Date.now()}.${fileExt}`;
      const filePath = `child-photos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('community-images')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('community-images')
        .getPublicUrl(filePath);

      setEditingChild(prev => prev ? { ...prev, photo_url: urlData.publicUrl } : null);
      toast.success('Photo uploaded');
    } catch (err) {
      console.error('Failed to upload photo:', err);
      toast.error('Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    if (!editingChild) return;
    setEditingChild(prev => prev ? { ...prev, photo_url: null } : null);
  };

  const handleAddChild = () => {
    onOpenChange(false);
    navigate('/quiz');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#F2F2F7] dark:bg-[#1C1C1E] border-0 p-0 rounded-3xl overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-2xl font-bold text-foreground">
            {editingChild ? 'Edit Profile' : 'My Family'}
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {editingChild ? (
            <motion.div
              key="edit"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="px-6 pb-6 space-y-6"
            >
              {/* Photo Upload */}
              <div className="flex justify-center">
                <div className="relative">
                  <Avatar className="w-24 h-24 border-4 border-white dark:border-[#2C2C2E] shadow-lg">
                    <AvatarImage src={editingChild.photo_url || undefined} className="object-cover" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-bold">
                      {getInitials(editingChild.name)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer shadow-md hover:bg-primary/90 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                    {uploading ? (
                      <Loader2 className="w-4 h-4 text-primary-foreground animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4 text-primary-foreground" />
                    )}
                  </label>

                  {editingChild.photo_url && (
                    <button
                      onClick={handleRemovePhoto}
                      className="absolute top-0 right-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-md"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  )}
                </div>
              </div>

              {/* Name Input */}
              <div className="space-y-2">
                <Label htmlFor="child-name" className="text-sm font-medium text-muted-foreground">
                  Name
                </Label>
                <Input
                  id="child-name"
                  value={editingChild.name}
                  onChange={(e) => setEditingChild(prev => prev ? { ...prev, name: e.target.value } : null)}
                  className="h-12 rounded-xl bg-white dark:bg-[#2C2C2E] border-0 text-lg"
                  placeholder="Child's name"
                />
              </div>

              {/* Age Input */}
              <div className="space-y-2">
                <Label htmlFor="child-age" className="text-sm font-medium text-muted-foreground">
                  Age (1-18 years)
                </Label>
                <Input
                  id="child-age"
                  type="number"
                  min={1}
                  max={18}
                  value={editingChild.age ?? ''}
                  onChange={(e) => setEditingChild(prev => prev ? { 
                    ...prev, 
                    age: e.target.value ? parseInt(e.target.value) : null 
                  } : null)}
                  className="h-12 rounded-xl bg-white dark:bg-[#2C2C2E] border-0 text-lg"
                  placeholder="Enter age"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setEditingChild(null)}
                  className="flex-1 h-12 rounded-xl border-border/60"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 h-12 rounded-xl bg-primary"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="px-6 pb-6"
            >
              {/* Children List */}
              <div className="space-y-3">
                {childProfiles.map((child) => (
                  <motion.div
                    key={child.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleEditChild(child)}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all",
                      "bg-white dark:bg-[#2C2C2E] hover:bg-gray-50 dark:hover:bg-[#3C3C3E]",
                      activeChild?.id === child.id && "ring-2 ring-primary ring-offset-2 ring-offset-[#F2F2F7] dark:ring-offset-[#1C1C1E]"
                    )}
                  >
                    <div className="relative">
                      <Avatar className="w-14 h-14">
                        <AvatarImage src={child.photo_url || undefined} className="object-cover" />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                          {getInitials(child.name)}
                        </AvatarFallback>
                      </Avatar>
                      {activeChild?.id === child.id && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center border-2 border-white dark:border-[#2C2C2E]">
                          <Check className="w-3 h-3 text-primary-foreground" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{child.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-medium">
                          {child.brain_profile}
                        </span>
                        {child.age && (
                          <span>{child.age} years old</span>
                        )}
                      </div>
                    </div>

                    <div className="text-muted-foreground/50">
                      <Camera className="w-5 h-5" />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Add Child Button */}
              <Button
                variant="outline"
                onClick={handleAddChild}
                className="w-full h-14 mt-4 rounded-2xl border-dashed border-2 border-border/60 hover:border-primary/50 hover:bg-primary/5 transition-all"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Another Child
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
