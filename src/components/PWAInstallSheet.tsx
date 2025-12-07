import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { X, Share, MoreVertical, Plus, Download } from 'lucide-react';
import { isIOSDevice } from '@/utils/platform';

interface PWAInstallSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
}

export const PWAInstallSheet = ({ open, onOpenChange, onComplete }: PWAInstallSheetProps) => {
  const isIOS = isIOSDevice();

  const iosSteps = [
    {
      text: 'Tap the',
      icon: <Share className="inline w-5 h-5 mx-1 text-blue-500" />,
      suffix: 'share button in your browser'
    },
    {
      text: 'Scroll and tap',
      badge: (
        <span className="inline-flex items-center gap-1 mx-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-md text-sm font-medium">
          <Plus className="w-4 h-4" />
          Add to Home Screen
        </span>
      ),
      suffix: ''
    },
    {
      text: 'Find the',
      icon: <img src="/icon-192.png" alt="NEP" className="inline w-5 h-5 mx-1 rounded" />,
      suffix: 'icon on your home screen'
    }
  ];

  const androidSteps = [
    {
      text: 'Tap the',
      icon: <MoreVertical className="inline w-5 h-5 mx-1 text-gray-600 dark:text-gray-400" />,
      suffix: 'menu in the top right'
    },
    {
      text: 'Select',
      badge: (
        <span className="inline-flex items-center gap-1 mx-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-md text-sm font-medium">
          <Download className="w-4 h-4" />
          Install app
        </span>
      ),
      suffix: ''
    },
    {
      text: 'Find the',
      icon: <img src="/icon-192.png" alt="NEP" className="inline w-5 h-5 mx-1 rounded" />,
      suffix: 'icon on your home screen'
    }
  ];

  const steps = isIOS ? iosSteps : androidSteps;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="bottom" 
        className="rounded-t-3xl bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-6 pb-8"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Install the app
          </h2>
          <button 
            onClick={() => onOpenChange(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* App Card */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl mb-6">
          <img 
            src="/icon-192.png" 
            alt="NEP System" 
            className="w-16 h-16 rounded-2xl shadow-md"
          />
          <div>
            <p className="font-semibold text-gray-900 dark:text-white text-lg">
              NEP System
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              nepsystem.vercel.app
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4 mb-8">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="flex items-start gap-4"
            >
              <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                {index + 1}
              </div>
              <p className="text-gray-700 dark:text-gray-300 pt-1 leading-relaxed">
                {step.text}
                {step.icon}
                {step.badge}
                {step.suffix}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Button
          onClick={onComplete}
          size="lg"
          className="w-full h-14 text-base font-semibold bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg"
        >
          I've Installed It ✓
        </Button>
      </SheetContent>
    </Sheet>
  );
};
