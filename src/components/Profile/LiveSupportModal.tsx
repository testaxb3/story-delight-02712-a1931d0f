import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MessageCircle, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

interface LiveSupportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LiveSupportModal({ open, onOpenChange }: LiveSupportModalProps) {
  const handleWhatsApp = () => {
    window.open('https://wa.me/27617525578?text=Hi!%20I%20need%20help%20with%20NEP%20System', '_blank');
    onOpenChange(false);
  };

  const handleEmail = () => {
    window.location.href = 'mailto:support@nepsystem.pro';
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border rounded-[22px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            Live Support
          </DialogTitle>
          <p className="text-sm text-muted-foreground text-center mt-1">
            Choose how you'd like to contact us
          </p>
        </DialogHeader>
        
        <div className="flex flex-col gap-3 mt-4">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleWhatsApp}
            className="flex items-center gap-4 p-4 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded-xl transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-foreground">WhatsApp</p>
              <p className="text-sm text-muted-foreground">Faster response • Usually replies in minutes</p>
            </div>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleEmail}
            className="flex items-center gap-4 p-4 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-xl transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-foreground">Email</p>
              <p className="text-sm text-muted-foreground">support@nepsystem.pro • Replies within 24h</p>
            </div>
          </motion.button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
