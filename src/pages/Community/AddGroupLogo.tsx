import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Upload, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const EMOJI_OPTIONS = [
  { emoji: '💪', color: 'from-orange-500 to-orange-600' },
  { emoji: '🏠', color: 'from-pink-500 to-pink-600' },
  { emoji: '🧠', color: 'from-purple-500 to-purple-600' },
  { emoji: '⭐', color: 'from-yellow-500 to-yellow-600' },
  { emoji: '🎨', color: 'from-blue-500 to-blue-600' },
  { emoji: '🌿', color: 'from-green-500 to-green-600' },
  { emoji: '🍳', color: 'from-red-500 to-red-600' },
  { emoji: '🎯', color: 'from-indigo-500 to-indigo-600' },
  { emoji: '❤️', color: 'from-rose-500 to-rose-600' },
  { emoji: '👨‍👩‍👧‍👦', color: 'from-teal-500 to-teal-600' },
  { emoji: '🦸‍♀️', color: 'from-cyan-500 to-cyan-600' },
  { emoji: '🏆', color: 'from-amber-500 to-amber-600' },
];

export default function AddGroupLogo() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const groupName = location.state?.groupName || '';
  
  const [selectedEmoji, setSelectedEmoji] = useState<number | null>(0);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [creating, setCreating] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.profileId) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.profileId}-${Date.now()}.${fileExt}`;
      const filePath = `community-logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('community-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('community-images')
        .getPublicUrl(filePath);

      setUploadedImage(urlData.publicUrl);
      setSelectedEmoji(null);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setSelectedEmoji(0);
  };

  const handleContinue = async () => {
    if (!user?.profileId || !groupName) {
      toast.error('Missing required data');
      return;
    }

    setCreating(true);

    try {
      // Get auth user ID (not profile ID)
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        toast.error('Authentication error');
        return;
      }

      // Create community
      const { data: community, error: communityError } = await supabase
        .from('communities')
        .insert({
          name: groupName,
          logo_emoji: uploadedImage ? null : EMOJI_OPTIONS[selectedEmoji || 0].emoji,
          logo_url: uploadedImage,
          created_by: authUser.id,
        })
        .select()
        .single();

      if (communityError) throw communityError;

      // Add creator as leader (use profile ID for community_members)
      const { error: memberError } = await supabase
        .from('community_members')
        .insert({
          community_id: community.id,
          user_id: user.profileId,
          role: 'leader',
        });

      if (memberError) throw memberError;

      toast.success('Community created successfully!');
      navigate('/community/feed', { state: { communityId: community.id } });
    } catch (error) {
      console.error('Error creating community:', error);
      toast.error('Failed to create community');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-10 pt-[env(safe-area-inset-top)] px-4 pb-4 bg-[#0d0d0d]">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-[#2a2a2a] flex items-center justify-center hover:bg-[#333] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-xl font-bold">Add group logo</h1>
          </div>
          <div className="w-10" />
        </div>
        <p className="text-center text-sm text-gray-400 mt-2">
          Choose an image that represents your group
        </p>
      </div>

      {/* Content */}
      <div className="pt-[calc(env(safe-area-inset-top)+120px)] pb-[calc(env(safe-area-inset-bottom)+100px)] px-6">
        {/* Emoji Carousel */}
        {!uploadedImage && (
          <>
            <div className="mb-2">
              <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                {EMOJI_OPTIONS.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedEmoji(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br ${option.color} flex items-center justify-center text-3xl transition-all ${
                      selectedEmoji === index ? 'ring-4 ring-white scale-110' : 'scale-100'
                    }`}
                  >
                    {option.emoji}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-center text-sm text-gray-400 mb-6">&lt;&lt; Swipe to select a photo &gt;&gt;</p>
          </>
        )}

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-[#333]" />
          <span className="text-sm text-gray-400">OR</span>
          <div className="flex-1 h-px bg-[#333]" />
        </div>

        {/* Upload Button */}
        <label className="flex items-center justify-center gap-2 h-14 border-2 border-[#333] rounded-xl text-white hover:bg-[#1a1a1a] transition-colors cursor-pointer">
          <Upload className="w-5 h-5" />
          <span>Upload a photo</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
            disabled={uploading}
          />
        </label>
        {uploading && <p className="text-center text-sm text-gray-400 mt-2">Uploading...</p>}

        {/* Preview - Only show AFTER selection */}
        {(selectedEmoji !== null || uploadedImage) && (
          <div className="flex flex-col items-center mt-8">
            <div className="relative">
              {uploadedImage ? (
                <div className="relative w-40 h-40 rounded-full overflow-hidden">
                  <img src={uploadedImage} alt="Group logo" className="w-full h-full object-cover" />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className={`w-40 h-40 rounded-full bg-gradient-to-br ${EMOJI_OPTIONS[selectedEmoji || 0].color} flex items-center justify-center text-7xl`}>
                  {EMOJI_OPTIONS[selectedEmoji || 0].emoji}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 pb-[calc(env(safe-area-inset-bottom)+16px)] bg-[#0d0d0d]">
        <Button
          onClick={handleContinue}
          disabled={creating || uploading}
          className="w-full h-14 bg-white text-black rounded-[30px] font-medium hover:bg-gray-100 disabled:opacity-50"
        >
          {creating ? 'Creating...' : 'Continue'}
        </Button>
      </div>
    </div>
  );
}
