import { motion } from 'framer-motion';
import { Check, ExternalLink, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import type { AudioSeries } from '@/stores/audioPlayerStore';

interface PremiumAudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  series: AudioSeries | null;
}

export function PremiumAudioModal({ isOpen, onClose, series }: PremiumAudioModalProps) {
  const navigate = useNavigate();
  
  if (!series) return null;

  const benefits = [
    '21+ premium audio tracks',
    'Science-backed techniques',
    'Listen anywhere, anytime',
    'Lifetime access',
  ];

  const handleUpgrade = () => {
    window.open('https://gtmsinop.mycartpanda.com/checkout/203914365:1', '_blank');
  };

  const handleLearnMore = () => {
    onClose();
    navigate('/listen/upgrade');
  };

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
                {series.name}
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

            {/* CTA Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleUpgrade}
                className="w-full h-12 rounded-full bg-gradient-to-r from-[#D4A574] to-[#B8864A] text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity active:scale-95"
              >
                <span>Upgrade Now</span>
                <ExternalLink className="w-4 h-4" />
              </button>
              <button
                onClick={handleLearnMore}
                className="w-full h-12 rounded-full bg-muted text-foreground font-medium hover:bg-muted/80 transition-colors active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Learn More</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
