import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Sparkles } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";

interface MarkCompleteButtonProps {
  bonusId: string;
  isCompleted: boolean;
  size?: "default" | "sm" | "lg" | "icon";
}

export const MarkCompleteButton = ({ 
  bonusId, 
  isCompleted,
  size = "default" 
}: MarkCompleteButtonProps) => {
  const queryClient = useQueryClient();

  const toggleComplete = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("user_bonuses")
        .upsert({
          user_id: user.id,
          bonus_id: bonusId,
          progress: isCompleted ? 0 : 100,
          completed_at: isCompleted ? null : new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bonuses"] });
      queryClient.invalidateQueries({ queryKey: ["user-bonuses"] });
      
      if (!isCompleted) {
        // Trigger confetti celebration
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

        function randomInRange(min: number, max: number) {
          return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
          const timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            return clearInterval(interval);
          }

          const particleCount = 50 * (timeLeft / duration);
          
          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
          });
          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
          });
        }, 250);
        
        toast.success("Bonus completed! 🎉", {
          description: "Congratulations on your achievement!",
        });
      } else {
        toast.success("Bonus marked as incomplete");
      }
    },
    onError: (error: Error) => {
      toast.error(`Failed to update: ${error.message}`);
    },
  });

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        variant={isCompleted ? "default" : "outline"}
        size={size}
        onClick={(e) => {
          e.stopPropagation();
          toggleComplete.mutate();
        }}
        disabled={toggleComplete.isPending}
        className={`
          gap-2 transition-all duration-300
          ${isCompleted 
            ? 'bg-gradient-to-r from-success to-emerald-600 text-white border-0 shadow-[0_0_20px_-5px_hsl(var(--success)/0.5)]' 
            : 'border-2 hover:border-success/50 hover:bg-success/10'
          }
        `}
      >
        {isCompleted ? (
          <>
            <CheckCircle2 className="h-4 w-4 animate-pulse" />
            Completed
          </>
        ) : (
          <>
            <Circle className="h-4 w-4" />
            <span className="hidden sm:inline">Mark Complete</span>
            <Sparkles className="h-3 w-3 sm:hidden" />
          </>
        )}
      </Button>
    </motion.div>
  );
};
