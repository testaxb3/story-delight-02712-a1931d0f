import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Award } from "lucide-react";
import { AchievementsBadges } from "./AchievementsBadges";

export const AchievementsModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200 dark:border-emerald-700/50 hover:from-emerald-100 hover:to-teal-100 dark:hover:from-emerald-900/30 dark:hover:to-teal-900/30 hover:border-emerald-300 dark:hover:border-emerald-600 text-emerald-700 dark:text-emerald-300 hover:text-emerald-800 dark:hover:text-emerald-200 shadow-sm hover:shadow-md transition-all"
        >
          <Award className="w-4 h-4" />
          <span className="hidden md:inline font-medium">Achievements</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl font-display font-bold">
            Your Reading Journey
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <AchievementsBadges />
        </div>
      </DialogContent>
    </Dialog>
  );
};
