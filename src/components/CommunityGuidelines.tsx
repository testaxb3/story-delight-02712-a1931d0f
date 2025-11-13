import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Heart, Shield, MessageCircle, Users, CheckCircle } from 'lucide-react';

interface CommunityGuidelinesProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommunityGuidelines({ open, onOpenChange }: CommunityGuidelinesProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Heart className="w-6 h-6 text-primary" />
            Community Guidelines
          </DialogTitle>
          <DialogDescription>
            Help us build a supportive, respectful space for all parents
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Be Supportive */}
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Be Kind & Supportive</h3>
              <p className="text-sm text-muted-foreground">
                We're all navigating the challenges of parenting. Share encouragement, celebrate wins together, and offer constructive advice when asked.
              </p>
            </div>
          </div>

          {/* Respect Privacy */}
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Respect Privacy</h3>
              <p className="text-sm text-muted-foreground">
                Don't share personal information about yourself or others. Avoid posting photos of children or identifying details.
              </p>
            </div>
          </div>

          {/* Stay On Topic */}
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Stay On Topic</h3>
              <p className="text-sm text-muted-foreground">
                Keep discussions focused on parenting strategies, NEP scripts, and supporting each other through behavioral challenges.
              </p>
            </div>
          </div>

          {/* Be Inclusive */}
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Be Inclusive</h3>
              <p className="text-sm text-muted-foreground">
                Respect all parenting styles, family structures, and backgrounds. No judgment, discrimination, or hate speech.
              </p>
            </div>
          </div>

          {/* Report Issues */}
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Report Inappropriate Content</h3>
              <p className="text-sm text-muted-foreground">
                If you see content that violates these guidelines, please flag it. Our team reviews all reports promptly.
              </p>
            </div>
          </div>

          {/* What's Not Allowed */}
          <div className="mt-6 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
            <h3 className="font-semibold text-destructive mb-2">What's Not Allowed</h3>
            <ul className="text-sm text-destructive space-y-1 list-disc list-inside">
              <li>Harassment, bullying, or personal attacks</li>
              <li>Spam, advertising, or self-promotion</li>
              <li>Sharing dangerous or harmful advice</li>
              <li>Medical diagnoses or treatment recommendations</li>
              <li>Political or religious debates</li>
              <li>Explicit or inappropriate content</li>
            </ul>
          </div>

          <div className="text-center text-sm text-muted-foreground pt-4 border-t">
            Violating these guidelines may result in post removal or account suspension.
            <br />
            Thank you for helping us build a positive community! 💜
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
