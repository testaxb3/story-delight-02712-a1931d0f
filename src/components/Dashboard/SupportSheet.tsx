import { motion } from 'framer-motion';
import { MessageCircle, Mail, X } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useHaptic } from '@/hooks/useHaptic';
import { cn } from '@/lib/utils';

interface SupportSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const WHATSAPP_NUMBER = '27617525578';
const WHATSAPP_MESSAGE = 'Hi! I need help with NEP System';
const SUPPORT_EMAIL = 'support@nepsystem.pro';

export function SupportSheet({ isOpen, onClose }: SupportSheetProps) {
  const { triggerHaptic } = useHaptic();

  const handleWhatsApp = () => {
    triggerHaptic('light');
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
    window.open(url, '_blank');
    onClose();
  };

  const handleEmail = () => {
    triggerHaptic('light');
    window.location.href = `mailto:${SUPPORT_EMAIL}`;
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="rounded-t-[24px] pb-safe">
        <SheetHeader className="text-left pb-4">
          <SheetTitle className="text-xl font-bold">Get Support</SheetTitle>
          <p className="text-sm text-muted-foreground">Choose how you'd like to reach us</p>
        </SheetHeader>

        <div className="space-y-3 pb-4">
          {/* WhatsApp Option */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleWhatsApp}
            className={cn(
              "w-full flex items-center gap-4 p-4 rounded-2xl border transition-all",
              "bg-green-500/10 border-green-500/20 hover:bg-green-500/15"
            )}
          >
            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-bold text-foreground">WhatsApp</p>
              <p className="text-sm text-muted-foreground">Chat with us instantly</p>
            </div>
          </motion.button>

          {/* Email Option */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleEmail}
            className={cn(
              "w-full flex items-center gap-4 p-4 rounded-2xl border transition-all",
              "bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/15"
            )}
          >
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-bold text-foreground">Email</p>
              <p className="text-sm text-muted-foreground">{SUPPORT_EMAIL}</p>
            </div>
          </motion.button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
