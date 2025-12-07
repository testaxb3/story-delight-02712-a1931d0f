import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CATEGORY_EMOJIS } from '@/lib/scriptUtils';

export interface CategoryStat {
  name: string;
  progress: number; // Percentage 0-100
  count: number;
  color: string;
  emoji: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  'tantrums': '#f43f5e', // Rose-500
  'meltdowns': '#e11d48', // Rose-600
  'sleep': '#3b82f6', // Blue-500
  'bedtime': '#60a5fa', // Blue-400
  'focus': '#f59e0b', // Amber-500
  'homework': '#d97706', // Amber-600
  'aggression': '#ef4444', // Red-500
  'defiance': '#f97316', // Orange-500
  'anxiety': '#8b5cf6', // Violet-500
  'social': '#10b981', // Emerald-500
  'routine': '#06b6d4', // Cyan-500
  'morning': '#0ea5e9', // Sky-500
};

const DEFAULT_COLOR = '#64748b'; // Slate-500

export function useCategoryStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['script-category-stats', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      if (import.meta.env.DEV) console.log('🔍 Fetching category stats for user:', user.id);

      // Fetch all script usage for the user, joining with script details
      // Note: 'script_usage' has 'script_id', we need to join 'scripts' to get 'category'
      const { data, error } = await supabase
        .from('script_usage')
        .select(`
          script_id,
          scripts:script_id (
            category
          )
        `)
        .eq('user_id', user.id);

      if (error) {
        if (import.meta.env.DEV) console.error('❌ Error fetching category stats:', error);
        throw error;
      }

      if (import.meta.env.DEV) console.log('📦 Raw script_usage data:', data);

      if (!data || data.length === 0) {
        if (import.meta.env.DEV) console.warn('⚠️ No script usage found for user.');
        return [];
      }

      // Process data to count categories
      const categoryCounts: Record<string, number> = {};
      let totalCount = 0;

      data.forEach((usage) => {
        // @ts-ignore - Supabase types might be slightly off for joined queries
        const category = usage.scripts?.category;
        
        if (category) {
          // Normalize category name
          const normalizedCat = category.trim();
          categoryCounts[normalizedCat] = (categoryCounts[normalizedCat] || 0) + 1;
          totalCount++;
        } else {
             if (import.meta.env.DEV) console.log('⚠️ Usage found with no category (script might be deleted or null):', usage);
        }
      });

      if (import.meta.env.DEV) console.log('📊 Processed category counts:', categoryCounts);

      if (totalCount === 0) return [];

      // Convert to array and calculate percentages
      const stats: CategoryStat[] = Object.entries(categoryCounts)
        .map(([name, count]) => {
          const normalizedKey = name.toLowerCase().replace(/\s+/g, '_');
          // Try to find color by exact key or partial match
          let color = CATEGORY_COLORS[normalizedKey];
          if (!color) {
             // Fallback: try to find a key that is contained in the name
             const matchingKey = Object.keys(CATEGORY_COLORS).find(k => normalizedKey.includes(k));
             color = matchingKey ? CATEGORY_COLORS[matchingKey] : DEFAULT_COLOR;
          }

          const emoji = CATEGORY_EMOJIS[normalizedKey] || '🧠';

          return {
            name: name, // Keep original casing for display
            progress: Math.round((count / totalCount) * 100),
            count,
            color,
            emoji,
          };
        })
        .sort((a, b) => b.count - a.count) // Sort by usage (highest first)
        .slice(0, 3); // Take top 3

      return stats;
    },
    enabled: !!user?.id,
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
  });
}
