import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { CartpandaBuyButton } from './CartpandaBuyButton';
import type { AudioSeries } from '@/stores/audioPlayerStore';

interface AudioPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  series: AudioSeries | null;
}

export function AudioPurchaseModal({ isOpen, onClose, series }: AudioPurchaseModalProps) {
  if (!series) return null;

  const benefits = [
    '11 calming audio tracks',
    'Science-backed techniques',
    'Listen anywhere, anytime',
    'Lifetime access',
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <div className="relative">
          {/* Blurred background */}
          {series.cover_image && (
            <div 
              className="absolute inset-0 bg-cover bg-center blur-2xl opacity-30"
              style={{ backgroundImage: `url(${series.cover_image})` }}
            />
          )}
          
          {/* Content */}
          <div className="relative p-6 space-y-6">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted/80 flex items-center justify-center hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Cover image */}
            {series.cover_image && (
              <div className="w-24 h-24 mx-auto rounded-2xl overflow-hidden shadow-lg">
                <img 
                  src={series.cover_image} 
                  alt={series.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Title */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#D4A574] to-[#B8864A]">
                <span className="text-lg">👑</span>
                <span className="text-sm font-semibold text-white">Premium Content</span>
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                Unlock All Episodes
              </h2>
              {series.description && (
                <p className="text-sm text-muted-foreground">
                  {series.description}
                </p>
              )}
            </div>

            {/* Benefits */}
            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-green-500" />
                  </div>
                  <span className="text-sm text-foreground">{benefit}</span>
                </motion.div>
              ))}
            </div>

            {/* Cartpanda Buy Button */}
            <div className="space-y-3">
              <CartpandaBuyButton 
                buttonId="e9c7b179-eefa-43c7-a13a-5f5d452bdf72"
                shopUrl="https://gtmsinop.mycartpanda.com/"
              />
              
              <button
                onClick={onClose}
                className="w-full h-12 rounded-full bg-muted text-foreground font-medium hover:bg-muted/80 transition-colors active:scale-95"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
