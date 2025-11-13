import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useChildProfiles } from '@/contexts/ChildProfilesContext';

const crisisOptions = [
  { label: 'Tantrum / Meltdown', crisis: 'tantrum' },
  { label: 'Hitting / Biting / Kicking', crisis: 'aggression' },
  { label: "Total Refusal (Won't leave / get in car)", crisis: 'refusal' },
  { label: 'Sibling Fights', crisis: 'siblings' },
  { label: 'Screaming / Unstoppable Crying', crisis: 'crying' },
];

interface SOSModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SOSModal({ open, onOpenChange }: SOSModalProps) {
  const navigate = useNavigate();
  const { activeChild } = useChildProfiles();

  const handleSelect = (crisis: string) => {
    onOpenChange(false);
    navigate('/scripts', {
      state: {
        crisis,
        autoFocus: true,
        child: activeChild ? { id: activeChild.id, brain_profile: activeChild.brain_profile, name: activeChild.name } : null,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-[95vw] max-h-[85vh] overflow-hidden flex flex-col bg-gradient-to-br from-red-50 via-orange-50 to-red-50 border-2 border-red-300 shadow-2xl p-4 sm:p-6">
        <DialogHeader className="text-center space-y-2 pb-2 shrink-0">
          {/* Animated Fire Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="text-5xl animate-bounce">🔥</div>
              <div className="absolute inset-0 bg-red-500/20 rounded-full blur-2xl animate-pulse"></div>
            </div>
          </div>

          {/* Title with gradient */}
          <DialogTitle className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-red-600 via-orange-600 to-red-600 bg-clip-text text-transparent leading-tight">
            WHAT'S HAPPENING NOW?
          </DialogTitle>

          <DialogDescription className="text-gray-700 text-sm sm:text-base max-w-xl mx-auto font-medium">
            Tap the crisis and get{' '}
            {activeChild ? (
              <span className="font-bold text-red-600">{activeChild.name}'s script</span>
            ) : (
              <span className="font-bold text-red-600">your script</span>
            )}
          </DialogDescription>
        </DialogHeader>

        {/* Crisis Options Grid - Scrollable */}
        <div className="grid gap-2 py-2 overflow-y-auto flex-1 min-h-0">
          {crisisOptions.map((option, index) => (
            <Button
              key={option.crisis}
              className="group relative h-auto min-h-[56px] text-base sm:text-lg font-bold justify-between px-4 py-3 bg-gradient-to-r from-white to-red-50 text-red-700 hover:from-red-500 hover:to-red-600 hover:text-white border-2 border-red-200 hover:border-red-400 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              onClick={() => handleSelect(option.crisis)}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-2 flex-1 text-left">
                <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-red-100 text-red-600 font-black text-lg group-hover:bg-white/20 group-hover:text-white transition-colors shrink-0">
                  {index + 1}
                </div>
                <span className="leading-tight">{option.label}</span>
              </div>
              <span aria-hidden className="text-2xl group-hover:translate-x-1 transition-transform shrink-0">→</span>
            </Button>
          ))}
        </div>

        {/* Footer Tip */}
        <div className="mt-2 p-2.5 bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-300 rounded-lg shrink-0">
          <p className="text-xs text-amber-900 text-center font-medium">
            💡 Add to home screen for instant access!
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
