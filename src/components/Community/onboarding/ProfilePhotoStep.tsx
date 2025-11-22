import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Image, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProfilePhotoStepProps {
  firstName: string;
  lastName: string;
  onContinue: (photoUrl: string) => void;
}

const AVATAR_COLORS = [
  { gradient: 'from-purple-500 to-purple-600', id: 'purple' },
  { gradient: 'from-blue-500 to-blue-600', id: 'blue' },
  { gradient: 'from-green-500 to-green-600', id: 'green' },
  { gradient: 'from-orange-500 to-orange-600', id: 'orange' },
  { gradient: 'from-pink-500 to-pink-600', id: 'pink' },
  { gradient: 'from-teal-500 to-teal-600', id: 'teal' },
  { gradient: 'from-red-500 to-red-600', id: 'red' },
  { gradient: 'from-yellow-500 to-yellow-600', id: 'yellow' },
];

export function ProfilePhotoStep({ firstName, lastName, onContinue }: ProfilePhotoStepProps) {
  const [selectedColor, setSelectedColor] = useState(AVATAR_COLORS[0].id);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(fileName);

      setUploadedPhoto(publicUrl);
      toast({
        title: "Photo uploaded",
        description: "Your profile photo has been uploaded successfully.",
      });
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    setUploadedPhoto(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleContinue = () => {
    const photoUrl = uploadedPhoto || `avatar-${selectedColor}`;
    onContinue(photoUrl);
  };

  return (
    <div className="flex flex-col h-full justify-between pt-8">
      <div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-3 text-white">Add a profile photo</h1>
        <p className="text-base text-gray-400 mb-12">
          Your profile photo helps others recognize you in communities
        </p>

        {uploadedPhoto ? (
          // Show uploaded photo
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-6">
              <Avatar className="w-32 h-32">
                <AvatarImage src={uploadedPhoto} alt="Profile" />
                <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
              </Avatar>
              <button
                onClick={handleRemovePhoto}
                className="absolute -top-2 -right-2 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <Trash2 className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Avatar Carousel */}
            <div className="flex gap-3 mb-6 overflow-x-auto pb-4 px-1 hide-scrollbar">
              {AVATAR_COLORS.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setSelectedColor(color.id)}
                  className={`flex-shrink-0 transition-all ${
                    selectedColor === color.id 
                      ? 'ring-3 ring-white scale-110' 
                      : 'opacity-70 hover:opacity-100'
                  } rounded-full`}
                >
                  <Avatar className="w-20 h-20">
                    <AvatarFallback className={`bg-gradient-to-br ${color.gradient} text-white text-xl font-bold`}>
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </button>
              ))}
            </div>

            <p className="text-center text-gray-400 text-sm mb-6">
              &lt;&lt; Swipe to select a photo &gt;&gt;
            </p>

            <p className="text-center text-gray-400 text-sm mb-4">OR</p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full h-14 mb-8 bg-transparent border-2 border-gray-600 text-white hover:bg-white/5 hover:border-gray-500 rounded-full font-medium"
            >
              <Image className="w-5 h-5 mr-2" />
              {uploading ? 'Uploading...' : 'Upload a photo'}
            </Button>
          </>
        )}
      </div>

      <div className="pb-8">
        <Button
          onClick={handleContinue}
          disabled={uploading}
          className="w-full h-14 text-base bg-white text-black hover:bg-white/90 rounded-full font-medium"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
