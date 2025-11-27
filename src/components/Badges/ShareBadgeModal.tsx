/**
 * SHARE BADGE MODAL
 * Social proof amplification + virality mechanism
 * Generates shareable badge card with OG meta tags
 */

import { memo, useCallback, useState } from 'react';
import { X, Share2, Download, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BadgeCardV2 } from './BadgeCardV2';
import type { Badge } from '@/types/achievements';

interface ShareBadgeModalProps {
  badge: Badge | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareBadgeModal = memo(({ badge, isOpen, onClose }: ShareBadgeModalProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = useCallback(async () => {
    if (!badge) return;

    const shareUrl = `${window.location.origin}/achievements?badge=${badge.id}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  }, [badge]);

  const handleNativeShare = useCallback(async () => {
    if (!badge) return;

    const shareData = {
      title: `🏆 ${badge.name}`,
      text: `I just unlocked the "${badge.name}" badge! ${badge.description}`,
      url: `${window.location.origin}/achievements?badge=${badge.id}`
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success('Badge shared!');
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          toast.error('Failed to share');
        }
      }
    } else {
      handleCopyLink();
    }
  }, [badge, handleCopyLink]);

  const handleDownload = useCallback(() => {
    if (!badge) return;

    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#3b82f6');
    gradient.addColorStop(1, '#8b5cf6');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 72px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(`🏆 ${badge.name}`, canvas.width / 2, canvas.height / 2);

    ctx.font = '36px Inter';
    ctx.fillText(badge.description, canvas.width / 2, canvas.height / 2 + 60);

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${badge.name.replace(/\s+/g, '-').toLowerCase()}-badge.png`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Badge saved!');
      }
    });
  }, [badge]);

  if (!badge) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Share Badge
            <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-6">
          <div className="relative">
            <BadgeCardV2 badge={badge} size="featured" />
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl -z-10" />
          </div>

          <div className="text-center">
            <h3 className="text-xl font-bold mb-1">{badge.name}</h3>
            <p className="text-sm text-muted-foreground">{badge.description}</p>
            {badge.unlocked_at && (
              <p className="text-xs text-muted-foreground mt-2">
                Unlocked on {new Date(badge.unlocked_at).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            )}
          </div>

          <div className="flex gap-2 w-full">
            <Button
              onClick={handleNativeShare}
              className="flex-1"
              size="lg"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>

            <Button
              onClick={handleCopyLink}
              variant="outline"
              size="lg"
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>

            <Button
              onClick={handleDownload}
              variant="outline"
              size="lg"
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>

          <div className="text-xs text-center text-muted-foreground">
            Show your achievements to friends and inspire other parents!
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

ShareBadgeModal.displayName = 'ShareBadgeModal';
