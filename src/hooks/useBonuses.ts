import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BonusData } from "@/components/bonuses/BonusCard";
import { toast } from "sonner";

// Query keys
export const bonusesKeys = {
  all: ["bonuses"] as const,
  lists: () => [...bonusesKeys.all, "list"] as const,
  list: (filters?: { category?: string; search?: string }) =>
    [...bonusesKeys.lists(), filters] as const,
  details: () => [...bonusesKeys.all, "detail"] as const,
  detail: (id: string) => [...bonusesKeys.details(), id] as const,
};

// Transform database row to BonusData
function transformBonusRow(row: any): BonusData {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    thumbnail: row.thumbnail || undefined,
    duration: row.duration || undefined,
    size: row.file_size || undefined,
    locked: row.locked,
    completed: row.completed || false,
    progress: row.progress || 0,
    isNew: row.is_new || false,
    tags: row.tags || [],
    viewUrl: row.view_url || undefined,
    downloadUrl: row.download_url || undefined,
    requirement: row.unlock_requirement || undefined,
  };
}

// Transform BonusData to database insert/update format
function transformBonusToDb(bonus: Omit<BonusData, "id"> | BonusData) {
  return {
    title: bonus.title,
    description: bonus.description,
    category: bonus.category,
    thumbnail: bonus.thumbnail || null,
    duration: bonus.duration || null,
    file_size: bonus.size || null,
    locked: bonus.locked,
    completed: bonus.completed || false,
    progress: bonus.progress || 0,
    is_new: bonus.isNew || false,
    tags: bonus.tags || null,
    view_url: bonus.viewUrl || null,
    download_url: bonus.downloadUrl || null,
    unlock_requirement: bonus.requirement || null,
  };
}

// Hook to get all bonuses
export function useBonuses(filters?: { category?: string; search?: string }) {
  return useQuery({
    queryKey: bonusesKeys.list(filters),
    queryFn: async () => {
      let query = supabase
        .from("bonuses")
        .select("*")
        .order("created_at", { ascending: false });

      // Apply category filter
      if (filters?.category && filters.category !== "all") {
        query = query.eq("category", filters.category);
      }

      // Apply search filter
      if (filters?.search && filters.search.trim()) {
        const searchTerm = `%${filters.search.toLowerCase()}%`;
        query = query.or(
          `title.ilike.${searchTerm},description.ilike.${searchTerm}`
        );
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching bonuses:", error);
        throw error;
      }

      return data?.map(transformBonusRow) || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook to get a single bonus
export function useBonus(id: string) {
  return useQuery({
    queryKey: bonusesKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bonuses")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching bonus:", error);
        throw error;
      }

      return transformBonusRow(data);
    },
    enabled: !!id,
  });
}

// Hook to create a bonus
export function useCreateBonus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bonus: Omit<BonusData, "id">) => {
      const { data, error } = await supabase
        .from("bonuses")
        .insert([transformBonusToDb(bonus)])
        .select()
        .single();

      if (error) {
        console.error("Error creating bonus:", error);
        throw error;
      }

      return transformBonusRow(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bonusesKeys.lists() });
      toast.success("Bonus created successfully!");
    },
    onError: (error) => {
      console.error("Failed to create bonus:", error);
      toast.error("Failed to create bonus");
    },
  });
}

// Hook to update a bonus
export function useUpdateBonus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<BonusData>;
    }) => {
      const { data, error } = await supabase
        .from("bonuses")
        .update(transformBonusToDb(updates as any))
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating bonus:", error);
        throw error;
      }

      return transformBonusRow(data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: bonusesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: bonusesKeys.detail(data.id) });
      toast.success("Bonus updated successfully!");
    },
    onError: (error) => {
      console.error("Failed to update bonus:", error);
      toast.error("Failed to update bonus");
    },
  });
}

// Hook to delete a bonus
export function useDeleteBonus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("bonuses").delete().eq("id", id);

      if (error) {
        console.error("Error deleting bonus:", error);
        throw error;
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bonusesKeys.lists() });
      toast.success("Bonus deleted successfully!");
    },
    onError: (error) => {
      console.error("Failed to delete bonus:", error);
      toast.error("Failed to delete bonus");
    },
  });
}

// Hook to delete multiple bonuses
export function useDeleteBonuses() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase.from("bonuses").delete().in("id", ids);

      if (error) {
        console.error("Error deleting bonuses:", error);
        throw error;
      }

      return ids.length;
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: bonusesKeys.lists() });
      toast.success(`Deleted ${count} bonus${count === 1 ? "" : "es"}`);
    },
    onError: (error) => {
      console.error("Failed to delete bonuses:", error);
      toast.error("Failed to delete bonuses");
    },
  });
}

// Hook to toggle bonus lock status
export function useToggleBonusLock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // First get current lock status
      const { data: current, error: fetchError } = await supabase
        .from("bonuses")
        .select("locked")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      // Then toggle it
      const { data, error } = await supabase
        .from("bonuses")
        .update({ locked: !current.locked })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error toggling bonus lock:", error);
        throw error;
      }

      return transformBonusRow(data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: bonusesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: bonusesKeys.detail(data.id) });
      toast.success(data.locked ? "Bonus locked" : "Bonus unlocked");
    },
    onError: (error) => {
      console.error("Failed to toggle bonus lock:", error);
      toast.error("Failed to toggle bonus lock");
    },
  });
}

// Hook to duplicate a bonus
export function useDuplicateBonus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // First get the bonus to duplicate
      const { data: original, error: fetchError } = await supabase
        .from("bonuses")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      // Create duplicate with modified title
      const duplicate = {
        ...transformBonusToDb(transformBonusRow(original)),
        title: `${original.title} (Copy)`,
        is_new: true,
      };

      const { data, error } = await supabase
        .from("bonuses")
        .insert([duplicate])
        .select()
        .single();

      if (error) {
        console.error("Error duplicating bonus:", error);
        throw error;
      }

      return transformBonusRow(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bonusesKeys.lists() });
      toast.success("Bonus duplicated successfully!");
    },
    onError: (error) => {
      console.error("Failed to duplicate bonus:", error);
      toast.error("Failed to duplicate bonus");
    },
  });
}

// Hook to get bonus statistics
export function useBonusStats() {
  return useQuery({
    queryKey: [...bonusesKeys.all, "stats"],
    queryFn: async () => {
      const { data, error } = await supabase.from("bonuses").select("*");

      if (error) {
        console.error("Error fetching bonus stats:", error);
        throw error;
      }

      const bonuses = data || [];

      return {
        total: bonuses.length,
        locked: bonuses.filter((b) => b.locked).length,
        unlocked: bonuses.filter((b) => !b.locked).length,
        new: bonuses.filter((b) => b.is_new).length,
        completed: bonuses.filter((b) => b.completed).length,
        byCategory: {
          video: bonuses.filter((b) => b.category === "video").length,
          ebook: bonuses.filter((b) => b.category === "ebook").length,
          pdf: bonuses.filter((b) => b.category === "pdf").length,
          tool: bonuses.filter((b) => b.category === "tool").length,
          template: bonuses.filter((b) => b.category === "template").length,
          session: bonuses.filter((b) => b.category === "session").length,
        },
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
