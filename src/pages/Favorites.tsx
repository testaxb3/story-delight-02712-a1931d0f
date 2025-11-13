import { AnimatedPage } from "@/components/common/AnimatedPage";
import { ScriptCard } from "@/components/scripts/ScriptCard";
import { EmptyState } from "@/components/common/EmptyState";
import { Skeleton } from "@/components/common/Skeleton";
import { Star } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useChildProfiles } from "@/contexts/ChildProfilesContext";
import { useState, useMemo } from "react";
import { ScriptModal } from "@/components/scripts/ScriptModal";
import { useNavigate } from "react-router-dom";
import type { Database } from "@/integrations/supabase/types";
import { recordScriptUsage } from "@/lib/supabase/progress";
import { toast } from "sonner";

type Script = Database["public"]["Tables"]["scripts"]["Row"];
type ScriptUsage = Database["public"]["Tables"]["script_usage"]["Row"];

type FavoriteWithScript = {
  script_id: string;
  scripts: Script | null;
};

export default function Favorites() {
  const { user } = useAuth();
  const { activeChild } = useChildProfiles();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedScript, setSelectedScript] = useState<Script | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { data: favoriteScripts, isLoading } = useQuery({
    queryKey: ["favorite-scripts", user?.id],
    queryFn: async () => {
      if (!user) return [] as Script[];
      const { data, error } = await supabase
        .from("user_favorites")
        .select("script_id, scripts(*)")
        .eq("user_id", user.id);
      if (error) throw error;
      return (data as FavoriteWithScript[])
        .map((item) => item.scripts)
        .filter(Boolean) as Script[];
    },
    enabled: !!user,
  });

  const { data: usage } = useQuery({
    queryKey: ["script-usage", user?.id],
    queryFn: async () => {
      if (!user) return [] as ScriptUsage[];
      const { data, error } = await supabase
        .from("script_usage")
        .select("script_id, used_at")
        .eq("user_id", user.id)
        .order("used_at", { ascending: false })
        .limit(180);
      if (error) throw error;
      return data as ScriptUsage[];
    },
    enabled: !!user,
  });

  const favoritesSet = useMemo(() => new Set(favoriteScripts?.map((script) => script.id)), [favoriteScripts]);
  const usageCount = useMemo(() => {
    const counts = new Map<string, number>();
    usage?.forEach((item) => {
      counts.set(item.script_id, (counts.get(item.script_id) ?? 0) + 1);
    });
    return counts;
  }, [usage]);

  const toggleFavoriteMutation = useMutation({
    mutationFn: async (scriptId: string) => {
      if (!user) return;
      const isFavorite = favoritesSet.has(scriptId);
      if (isFavorite) {
        const { error } = await supabase
          .from("user_favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("script_id", scriptId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("user_favorites")
          .insert({ user_id: user.id, script_id: scriptId });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorite-scripts", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["favorites", user?.id] });
      toast.success("Favorites updated");
    },
    onError: () => {
      toast.error("Unable to update favorites right now.");
    },
  });

  const markUsedMutation = useMutation({
    mutationFn: async (script: Script) => {
      if (!user) return;

      await recordScriptUsage({
        userId: user.id,
        scriptId: script.id,
        fallbackChildProfile: activeChild?.brain_profile ?? null,
      });
    },
    onSuccess: () => {
      toast.success("Script marked as used! 🎉");
      setModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["user-progress", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["script-usage", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["tracker-days", user?.id] });
    },
    onError: () => {
      toast.error("Unable to record that usage. Please try again.");
    },
  });

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Favorite Scripts</h1>
          <p className="text-muted-foreground mb-8">
            Quick access to the phrases that transform your home the fastest.
          </p>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, index) => (
                <Skeleton key={index} className="h-40" />
              ))}
            </div>
          ) : favoriteScripts && favoriteScripts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteScripts.map((script) => (
                <ScriptCard
                  key={script.id}
                  script={script}
                  highlight={usageCount.get(script.id) ? "mostUsed" : null}
                  isFavorite={true}
                  usageCount={usageCount.get(script.id)}
                  onSelect={() => {
                    setSelectedScript(script);
                    setModalOpen(true);
                  }}
                  onToggleFavorite={() => toggleFavoriteMutation.mutate(script.id)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Star}
              title="No favorites yet"
              description="Save the scripts you love and they will live here for fast access."
              actionLabel="Browse Scripts"
              onAction={() => navigate("/scripts")}
            />
          )}
        </div>

        <ScriptModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          script={selectedScript}
          isFavorite={selectedScript ? favoritesSet.has(selectedScript.id) : false}
          onToggleFavorite={() => {
            if (!selectedScript) return;
            toggleFavoriteMutation.mutate(selectedScript.id);
          }}
          onMarkUsed={() => {
            if (!selectedScript) return;
            markUsedMutation.mutate(selectedScript);
          }}
        />
      </div>
    </AnimatedPage>
  );
}
