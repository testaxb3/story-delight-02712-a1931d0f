import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
      toast.success(
        isCompleted 
          ? "Bonus marked as incomplete" 
          : "Bonus marked as complete! 🎉"
      );
    },
    onError: (error: Error) => {
      toast.error(`Failed to update: ${error.message}`);
    },
  });

  return (
    <Button
      variant={isCompleted ? "default" : "outline"}
      size={size}
      onClick={(e) => {
        e.stopPropagation();
        toggleComplete.mutate();
      }}
      disabled={toggleComplete.isPending}
      className="gap-2"
    >
      {isCompleted ? (
        <>
          <CheckCircle2 className="h-4 w-4" />
          Completed
        </>
      ) : (
        <>
          <Circle className="h-4 w-4" />
          Mark Complete
        </>
      )}
    </Button>
  );
};
