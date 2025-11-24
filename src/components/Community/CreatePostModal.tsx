import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useHaptic } from '@/hooks/useHaptic';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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
  const { triggerHaptic } = useHaptic();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
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
    setTitle('');
    setContent('');
    setImageFile(null);
    setImagePreview(null);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!userId || !communityId) {
      toast.error('You must be logged in to post');
      return;
    }

    if (!content.trim() && !imageFile) {
      toast.error('Please add some content or an image');
      return;
    }

    try {
      setUploading(true);
      triggerHaptic('medium');

      let imageUrl: string | null = null;

      // Upload image if exists
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${userId}-${Date.now()}.${fileExt}`;
        const filePath = `community-posts/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('community-images')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('community-images')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      // Create post
      const { error: postError } = await supabase
        .from('community_posts')
        .insert({
          community_id: communityId,
          user_id: userId,
          title: title.trim() || null,
          content: content.trim() || null,
          image_url: imageUrl,
        });

      if (postError) throw postError;

      triggerHaptic('success');
      toast.success('Post created successfully! 🎉');
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
  }, [userId, communityId, title, content, imageFile, triggerHaptic, resetForm, onOpenChange, onSuccess]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Title Input */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Title (optional)
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your post a title..."
              maxLength={100}
            />
          </div>

          {/* Content Textarea */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Content
            </label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your parenting win, challenge, or question..."
              className="min-h-[200px] resize-none"
              maxLength={1000}
            />
            <p className="text-xs text-muted-foreground mt-1 text-right">
              {content.length}/1000
            </p>
          </div>

          {/* Image Upload */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Image (optional)
            </label>

            <AnimatePresence mode="wait">
              {imagePreview ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative rounded-xl overflow-hidden border-2 border-border"
                >
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full max-h-[300px] object-cover"
                  />
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRemoveImage}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center"
                  >
                    <X className="w-5 h-5 text-white" />
                  </motion.button>
                </motion.div>
              ) : (
                <motion.label
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border rounded-xl cursor-pointer bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                      <ImageIcon className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="mb-2 text-sm font-medium text-muted-foreground">
                      Click to upload image
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageSelect}
                  />
                </motion.label>
              )}
            </AnimatePresence>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={uploading || (!content.trim() && !imageFile)}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold h-11 rounded-full disabled:opacity-50"
          >
            {uploading ? 'Posting...' : 'Post'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
