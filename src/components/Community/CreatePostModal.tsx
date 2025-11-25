import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useHaptic } from '@/hooks/useHaptic';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

import { useAuth } from '@/contexts/AuthContext';

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  communityId: string;
  userId: string;
  onSuccess?: () => void;
}

export function CreatePostModal({
  open,
  onOpenChange,
  communityId,
  userId,
  onSuccess,
}: CreatePostModalProps) {
  const { user } = useAuth();
  const { triggerHaptic } = useHaptic();
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Auto-focus textarea on open
  const textareaRef = useCallback((node: HTMLTextAreaElement | null) => {
    if (node && open) {
      setTimeout(() => node.focus(), 300); // Delay to allow sheet animation
    }
  }, [open]);

  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
      triggerHaptic('light');
    }
  }, [triggerHaptic]);

  const handleRemoveImage = useCallback(() => {
    setImageFile(null);
    setImagePreview(null);
    triggerHaptic('light');
  }, [triggerHaptic]);

  const resetForm = useCallback(() => {
    setContent('');
    setImageFile(null);
    setImagePreview(null);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!userId || !communityId) {
      toast.error('You must be logged in to post');
      return;
    }
    if (!content.trim() && !imageFile) return;

    try {
      setUploading(true);
      triggerHaptic('medium');
      let imageUrl: string | null = null;

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${userId}-${Date.now()}.${fileExt}`;
        const filePath = `community-posts/${fileName}`;
        const { error: uploadError } = await supabase.storage.from('community-images').upload(filePath, imageFile);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('community-images').getPublicUrl(filePath);
        imageUrl = publicUrl;
      }

      const { error: postError } = await supabase.from('community_posts').insert({
        community_id: communityId,
        user_id: userId,
        content: content.trim() || null,
        image_url: imageUrl,
      });

      if (postError) throw postError;

      triggerHaptic('success');
      toast.success('Posted! 🎉');
      resetForm();
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
      triggerHaptic('error');
    } finally {
      setUploading(false);
    }
  }, [userId, communityId, content, imageFile, triggerHaptic, resetForm, onOpenChange, onSuccess]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/*
        PWA SHEET FIX:
        - Using !important to override default Dialog centering styles
        - Explicit bottom positioning and slide animations
      */}
      <DialogContent 
        className="
          fixed !z-[9999] !left-0 !right-0 !bottom-0 !top-auto !translate-x-0 !translate-y-0 
          w-full h-[95dvh] !max-w-none 
          !rounded-t-[24px] !rounded-b-none border-0 
          bg-background shadow-2xl outline-none
          flex flex-col p-0 m-0 gap-0
          data-[state=open]:!animate-in data-[state=closed]:!animate-out 
          data-[state=closed]:!fade-out-0 data-[state=open]:!fade-in-0 
          data-[state=closed]:!slide-out-to-bottom-[100%] data-[state=open]:!slide-in-from-bottom-[100%] 
          duration-300 sm:!rounded-xl sm:!h-auto sm:!max-w-lg sm:!top-[50%] sm:!left-[50%] sm:!translate-x-[-50%] sm:!translate-y-[-50%] sm:!bottom-auto
        "
      >
        <DialogTitle className="sr-only">Create New Post</DialogTitle>

        {/* Pull Handle (iOS Style) */}
        <div className="w-full flex justify-center pt-3 pb-1 bg-background/80 backdrop-blur-xl rounded-t-[24px]">
          <div className="w-12 h-1.5 rounded-full bg-muted-foreground/20" />
        </div>

        {/* Header - Sticky Top of Sheet */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-border/40 shrink-0 bg-background/80 backdrop-blur-xl">
          <button 
            onClick={() => onOpenChange(false)}
            className="text-[17px] text-muted-foreground hover:text-foreground transition-colors font-normal px-2 -ml-2"
          >
            Cancel
          </button>
          <div className="text-[17px] font-semibold">New Post</div>
          <button
            onClick={handleSubmit}
            disabled={uploading || (!content.trim() && !imageFile)}
            className={cn(
              "text-[15px] font-bold transition-colors flex items-center gap-2 px-4 py-1.5 rounded-full",
              (!content.trim() && !imageFile) || uploading
                ? "bg-muted text-muted-foreground"
                : "bg-primary text-primary-foreground"
            )}
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Post'}
          </button>
        </div>

        {/* Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary shrink-0 overflow-hidden">
               {user?.user_metadata?.avatar_url || user?.photo_url ? (
                 <img src={user?.user_metadata?.avatar_url || user?.photo_url} alt="Avatar" className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-xs font-bold text-muted-foreground">
                    {user?.email?.[0]?.toUpperCase()}
                 </div>
               )}
            </div>

            <div className="flex-1 min-w-0 space-y-4 pb-48">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full min-h-[150px] bg-transparent border-none p-0 text-[17px] leading-relaxed placeholder:text-muted-foreground/50 focus:ring-0 resize-none"
                maxLength={1000}
              />

              <AnimatePresence>
                {imagePreview && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="relative rounded-xl overflow-hidden border border-border/50 bg-secondary/20"
                  >
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full max-h-[300px] object-cover"
                    />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Toolbar - Fixed Bottom of Sheet */}
        <div className="border-t border-border/40 bg-background/80 backdrop-blur-xl p-3 pb-[calc(env(safe-area-inset-bottom)+12px)] shrink-0">
          <div className="flex items-center justify-between px-2">
            <label className="p-2 rounded-full hover:bg-secondary transition-colors cursor-pointer active:scale-95 text-primary">
              <ImageIcon className="w-6 h-6" />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageSelect}
              />
            </label>
            
            <div className="text-xs font-medium text-muted-foreground tabular-nums">
              {content.length > 0 && (
                <span className={content.length > 900 ? "text-red-500" : ""}>
                  {1000 - content.length}
                </span>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}