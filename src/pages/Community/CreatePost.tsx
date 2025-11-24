import { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Image as ImageIcon, X } from 'lucide-react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useHaptic } from '@/hooks/useHaptic';

export default function CreatePost() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { triggerHaptic } = useHaptic();
  const communityId = location.state?.communityId;

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

  const handleSubmit = useCallback(async () => {
    if (!user?.profileId || !communityId) {
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
        const fileName = `${user.profileId}-${Date.now()}.${fileExt}`;
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
          user_id: user.profileId,
          title: title.trim() || null,
          content: content.trim() || null,
          image_url: imageUrl,
        });

      if (postError) throw postError;

      triggerHaptic('success');
      toast.success('Post created successfully! 🎉');
      navigate('/community/feed', { state: { communityId, refresh: true } });
    } catch (error: any) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
      triggerHaptic('error');
    } finally {
      setUploading(false);
    }
  }, [user, communityId, title, content, imageFile, navigate, triggerHaptic]);

  const handleBack = useCallback(() => {
    navigate('/community/feed', { state: { communityId } });
  }, [navigate, communityId]);

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#F8F9FA] dark:bg-background pb-24">
        {/* Header */}
        <div
          className="sticky top-0 z-50 bg-white dark:bg-[#1C1C1E] border-b border-[#E5E7EB] dark:border-white/10 px-4 py-3"
          style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 12px)' }}
        >
          <div className="flex items-center justify-between">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleBack}
              className="w-10 h-10 rounded-full bg-[#F3F4F6] dark:bg-white/10 flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-[#1A1A1A] dark:text-white" />
            </motion.button>
            <h1 className="text-lg font-bold text-[#1A1A1A] dark:text-white">Create Post</h1>
            <Button
              onClick={handleSubmit}
              disabled={uploading || (!content.trim() && !imageFile)}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold px-6 h-10 rounded-full disabled:opacity-50"
            >
              {uploading ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-6 space-y-4">
          {/* Title Input */}
          <div>
            <label className="text-sm font-medium text-[#6B7280] dark:text-white/60 mb-2 block">
              Title (optional)
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your post a title..."
              className="bg-white dark:bg-white/5 border-[#E5E7EB] dark:border-white/10 text-[#1A1A1A] dark:text-white placeholder:text-[#9CA3AF] dark:placeholder:text-white/40"
              maxLength={100}
            />
          </div>

          {/* Content Textarea */}
          <div>
            <label className="text-sm font-medium text-[#6B7280] dark:text-white/60 mb-2 block">
              Content
            </label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your parenting win, challenge, or question..."
              className="bg-white dark:bg-white/5 border-[#E5E7EB] dark:border-white/10 text-[#1A1A1A] dark:text-white placeholder:text-[#9CA3AF] dark:placeholder:text-white/40 min-h-[200px] resize-none"
              maxLength={1000}
            />
            <p className="text-xs text-[#9CA3AF] dark:text-white/40 mt-1 text-right">
              {content.length}/1000
            </p>
          </div>

          {/* Image Upload */}
          <div>
            <label className="text-sm font-medium text-[#6B7280] dark:text-white/60 mb-2 block">
              Image (optional)
            </label>

            <AnimatePresence mode="wait">
              {imagePreview ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative rounded-2xl overflow-hidden border-2 border-[#E5E7EB] dark:border-white/10"
                >
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full max-h-[400px] object-cover"
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
                  className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-[#E5E7EB] dark:border-white/10 rounded-2xl cursor-pointer bg-white dark:bg-white/5 hover:bg-[#F9FAFB] dark:hover:bg-white/[0.07] transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <div className="w-12 h-12 rounded-full bg-[#F3F4F6] dark:bg-white/10 flex items-center justify-center mb-3">
                      <ImageIcon className="w-6 h-6 text-[#6B7280] dark:text-white/60" />
                    </div>
                    <p className="mb-2 text-sm font-medium text-[#6B7280] dark:text-white/60">
                      Click to upload image
                    </p>
                    <p className="text-xs text-[#9CA3AF] dark:text-white/40">
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
        </div>
      </div>
    </MainLayout>
  );
}
