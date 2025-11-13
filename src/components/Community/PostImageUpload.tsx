import React, { useCallback, useRef, useState } from 'react';
import { Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface PostImageUploadProps {
  onImageSelected: (imageUrl: string, thumbnailUrl: string) => void;
  onImageRemoved: () => void;
  currentImageUrl?: string;
  disabled?: boolean;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const THUMBNAIL_SIZE = 400; // pixels

export function PostImageUpload({
  onImageSelected,
  onImageRemoved,
  currentImageUrl,
  disabled = false,
}: PostImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentImageUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validate image file using magic bytes
  const validateImageFile = async (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const arr = new Uint8Array(e.target?.result as ArrayBuffer).subarray(0, 4);
        let header = '';
        for (let i = 0; i < arr.length; i++) {
          header += arr[i].toString(16).padStart(2, '0');
        }

        // Validate magic bytes for JPEG, PNG, GIF, WebP
        const validHeaders = ['ffd8ffe0', 'ffd8ffe1', 'ffd8ffe2', '89504e47', '47494638', '52494646'];
        resolve(validHeaders.some(h => header.startsWith(h)));
      };
      reader.onerror = () => resolve(false);
      reader.readAsArrayBuffer(file.slice(0, 4));
    });
  };

  // Compress and resize image
  const compressImage = useCallback(async (file: File): Promise<{ full: Blob; thumbnail: Blob }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Create full-size canvas (max 1920x1920)
          const maxSize = 1920;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxSize) {
              height = (height * maxSize) / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = (width * maxSize) / height;
              height = maxSize;
            }
          }

          const fullCanvas = document.createElement('canvas');
          fullCanvas.width = width;
          fullCanvas.height = height;
          const fullCtx = fullCanvas.getContext('2d')!;
          fullCtx.drawImage(img, 0, 0, width, height);

          // Create thumbnail canvas
          let thumbWidth = img.width;
          let thumbHeight = img.height;

          if (thumbWidth > thumbHeight) {
            if (thumbWidth > THUMBNAIL_SIZE) {
              thumbHeight = (thumbHeight * THUMBNAIL_SIZE) / thumbWidth;
              thumbWidth = THUMBNAIL_SIZE;
            }
          } else {
            if (thumbHeight > THUMBNAIL_SIZE) {
              thumbWidth = (thumbWidth * THUMBNAIL_SIZE) / thumbHeight;
              thumbHeight = THUMBNAIL_SIZE;
            }
          }

          const thumbCanvas = document.createElement('canvas');
          thumbCanvas.width = thumbWidth;
          thumbCanvas.height = thumbHeight;
          const thumbCtx = thumbCanvas.getContext('2d')!;
          thumbCtx.drawImage(img, 0, 0, thumbWidth, thumbHeight);

          // Convert to blobs
          fullCanvas.toBlob(
            (fullBlob) => {
              if (!fullBlob) {
                reject(new Error('Failed to create full image'));
                return;
              }

              thumbCanvas.toBlob(
                (thumbBlob) => {
                  if (!thumbBlob) {
                    reject(new Error('Failed to create thumbnail'));
                    return;
                  }

                  resolve({ full: fullBlob, thumbnail: thumbBlob });
                },
                'image/jpeg',
                0.8
              );
            },
            'image/jpeg',
            0.9
          );
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }, []);

  const handleFileSelect = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      // Validate magic bytes to ensure it's a real image
      const isValidImage = await validateImageFile(file);
      if (!isValidImage) {
        toast.error('Invalid image file. Please select a valid image.');
        return;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        toast.error('Image must be less than 2MB');
        return;
      }

      setIsUploading(true);

      try {
        // Create preview
        const previewUrl = URL.createObjectURL(file);
        setPreviewUrl(previewUrl);

        // Compress image
        const { full, thumbnail } = await compressImage(file);

        // Generate unique file names
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substring(2, 15);
        const fileName = `${timestamp}-${randomId}`;

        // Upload full image to Supabase Storage
        const fullPath = `posts/${fileName}.jpg`;
        const { error: fullError } = await supabase.storage
          .from('community-posts')
          .upload(fullPath, full, {
            contentType: 'image/jpeg',
            cacheControl: '3600',
            upsert: false,
          });

        if (fullError) {
          throw fullError;
        }

        // Upload thumbnail
        const thumbPath = `posts/${fileName}-thumb.jpg`;
        const { error: thumbError } = await supabase.storage
          .from('community-posts')
          .upload(thumbPath, thumbnail, {
            contentType: 'image/jpeg',
            cacheControl: '3600',
            upsert: false,
          });

        if (thumbError) {
          // Clean up full image if thumbnail fails
          await supabase.storage.from('community-posts').remove([fullPath]);
          throw thumbError;
        }

        // Get public URLs
        const { data: fullData } = supabase.storage
          .from('community-posts')
          .getPublicUrl(fullPath);

        const { data: thumbData } = supabase.storage
          .from('community-posts')
          .getPublicUrl(thumbPath);

        // Notify parent component
        onImageSelected(fullData.publicUrl, thumbData.publicUrl);

        toast.success('Image uploaded successfully');
      } catch (error: any) {
        console.error('Error uploading image:', error);
        toast.error(error.message || 'Failed to upload image');
        setPreviewUrl(undefined);
      } finally {
        setIsUploading(false);
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    },
    [compressImage, onImageSelected]
  );

  const handleRemove = useCallback(() => {
    setPreviewUrl(undefined);
    onImageRemoved();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onImageRemoved]);

  const handleButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="relative">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={disabled || isUploading}
        className="hidden"
      />

      {/* Image preview */}
      {previewUrl ? (
        <div className="relative rounded-lg overflow-hidden border border-border mb-2">
          <img
            src={previewUrl}
            alt="Upload preview"
            className="w-full max-h-80 object-cover"
          />
          {!disabled && (
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 rounded-full shadow-lg"
              onClick={handleRemove}
              disabled={isUploading}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      ) : (
        /* Upload button */
        <Button
          variant="ghost"
          size="sm"
          onClick={handleButtonClick}
          disabled={disabled || isUploading}
          className="gap-2 text-muted-foreground hover:text-primary"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <ImageIcon className="w-4 h-4" />
              Add Image
            </>
          )}
        </Button>
      )}
    </div>
  );
}
