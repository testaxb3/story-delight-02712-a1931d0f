import { useState, useRef } from 'react';
import { Camera, Loader2, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { compressImage, validateImageFile, getImageDataUrl } from '@/lib/imageCompression';
import { cn } from '@/lib/utils';

interface UserPhotoUploadProps {
  currentPhotoUrl?: string | null;
  userId: string;
  userInitials: string;
  onUploadComplete?: (photoUrl: string | null) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function UserPhotoUpload({
  currentPhotoUrl,
  userId,
  userInitials,
  onUploadComplete,
  className,
  size = 'lg',
}: UserPhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPhotoUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-24 h-24',
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    setUploading(true);

    try {
      // Show preview
      const dataUrl = await getImageDataUrl(file);
      setPreviewUrl(dataUrl);

      // Compress image
      const compressedBlob = await compressImage(file, {
        maxWidth: 400,
        maxHeight: 400,
        quality: 0.85,
      });

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `user-${userId}-${Date.now()}.${fileExt}`;
      const filePath = `user-photos/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, compressedBlob, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        if (uploadError.message?.includes('Bucket not found')) {
          toast.error('Photo upload not configured yet. Please contact support.');
          console.warn('Supabase Storage bucket "profiles" not found. Please create it in the Supabase Dashboard.');
          setPreviewUrl(currentPhotoUrl || null);
          return;
        }
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      // Update user profile in database
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ photo_url: publicUrl })
        .eq('id', userId);

      if (updateError) throw updateError;

      toast.success('Photo updated successfully!');
      setPreviewUrl(publicUrl);
      onUploadComplete?.(publicUrl);
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Failed to upload photo. Please try again.');
      setPreviewUrl(currentPhotoUrl || null);
    } finally {
      setUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemovePhoto = async () => {
    if (!currentPhotoUrl) return;

    setUploading(true);

    try {
      // Update database to remove photo URL
      const { error } = await supabase
        .from('profiles')
        .update({ photo_url: null })
        .eq('id', userId);

      if (error) throw error;

      setPreviewUrl(null);
      toast.success('Photo removed');
      onUploadComplete?.(null);
    } catch (error) {
      console.error('Error removing photo:', error);
      toast.error('Failed to remove photo');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      {/* Avatar Preview */}
      <div className="relative">
        <Avatar className={cn(sizeClasses[size], 'border-4 border-primary/20')}>
          <AvatarImage src={previewUrl || undefined} alt="Profile" />
          <AvatarFallback className="text-2xl bg-gradient-primary text-white">
            {userInitials}
          </AvatarFallback>
        </Avatar>

        {/* Loading overlay */}
        {uploading && (
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
        )}

        {/* Camera badge */}
        {!uploading && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-1 -right-1 p-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors shadow-lg"
            disabled={uploading}
            aria-label="Upload photo"
          >
            <Camera className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />

      {/* Action buttons */}
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <Upload className="w-4 h-4 mr-2" />
          {previewUrl ? 'Change Photo' : 'Upload Photo'}
        </Button>

        {previewUrl && currentPhotoUrl && (
          <Button
            size="sm"
            variant="ghost"
            onClick={handleRemovePhoto}
            disabled={uploading}
          >
            <X className="w-4 h-4 mr-2" />
            Remove
          </Button>
        )}
      </div>

      <p className="text-xs text-muted-foreground text-center">
        JPG, PNG or WebP • Max 10MB
      </p>
    </div>
  );
}
