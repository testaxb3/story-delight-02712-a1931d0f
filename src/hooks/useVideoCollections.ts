import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BonusData, BonusCategory } from "@/types/bonus";

export interface VideoCollection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon_name: string;
  display_order: number;
}

export interface CollectionWithBonuses extends VideoCollection {
  bonuses: BonusData[];
}

// Transform database row to BonusData
function transformBonusRow(row: any): BonusData {
  const validCategory = (row.category && 
    Object.values(BonusCategory).includes(row.category as BonusCategory))
    ? row.category as BonusCategory
    : BonusCategory.EBOOK;
  
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: validCategory,
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
    videoUrl: row.view_url || undefined,
  };
}

// Fetch all collections
export function useVideoCollections() {
  return useQuery<VideoCollection[]>({
    queryKey: ["video-collections"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("video_collections")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Fetch bonuses organized by collection
export function useBonusesByCollection() {
  return useQuery<{
    collections: CollectionWithBonuses[];
    uncategorized: BonusData[];
    ebooks: BonusData[];
    featured: BonusData | null;
  }>({
    queryKey: ["bonuses-by-collection"],
    queryFn: async () => {
      // Fetch collections and bonuses in parallel
      const [collectionsRes, bonusesRes] = await Promise.all([
        supabase
          .from("video_collections")
          .select("*")
          .order("display_order", { ascending: true }),
        supabase
          .from("bonuses")
          .select(`
            *,
            ebook:ebooks!bonus_id(id, thumbnail_url, slug)
          `)
          .order("created_at", { ascending: false }),
      ]);

      if (collectionsRes.error) throw collectionsRes.error;
      if (bonusesRes.error) throw bonusesRes.error;

      const collections = collectionsRes.data || [];
      const allBonuses = (bonusesRes.data || []).map(row => {
        const ebookData = Array.isArray(row.ebook) ? row.ebook[0] : row.ebook;
        return {
          ...transformBonusRow(row),
          thumbnail: ebookData?.thumbnail_url || row.thumbnail,
        };
      });

      // Find featured item (hero tag or newest)
      const featured = allBonuses.find(b => b.tags?.includes('hero')) 
        || allBonuses.find(b => b.isNew && b.category === 'video')
        || allBonuses.find(b => b.category === 'video')
        || null;

      // Separate videos and ebooks
      const videos = allBonuses.filter(b => b.category === 'video');
      const ebooks = allBonuses.filter(b => b.category === 'ebook');

      // Group videos by collection
      const collectionsWithBonuses: CollectionWithBonuses[] = collections.map(col => ({
        ...col,
        bonuses: videos.filter((b: any) => {
          // For now, auto-categorize by duration until collection_id is set
          const durationMin = parseDuration(b.duration);
          switch (col.slug) {
            case 'quick-bites':
              return durationMin !== null && durationMin < 5;
            case 'understanding-development':
              return b.tags?.some((t: string) => 
                ['brain', 'development', 'growth', 'stages'].includes(t.toLowerCase())
              );
            case 'parenting-foundations':
              return b.tags?.some((t: string) => 
                ['parenting', 'styles', 'techniques', 'discipline'].includes(t.toLowerCase())
              );
            case 'managing-emotions':
              return b.tags?.some((t: string) => 
                ['emotions', 'tantrums', 'meltdowns', 'anger', 'anxiety'].includes(t.toLowerCase())
              );
            case 'activities-play':
              return b.tags?.some((t: string) => 
                ['activities', 'play', 'sensory', 'games'].includes(t.toLowerCase())
              );
            default:
              return false;
          }
        }),
      }));

      // Find videos that don't belong to any collection
      const categorizedIds = new Set(
        collectionsWithBonuses.flatMap(c => c.bonuses.map(b => b.id))
      );
      const uncategorized = videos.filter(b => !categorizedIds.has(b.id));

      return {
        collections: collectionsWithBonuses.filter(c => c.bonuses.length > 0),
        uncategorized,
        ebooks,
        featured,
      };
    },
    staleTime: 30000,
  });
}

// Helper: parse duration string to minutes
function parseDuration(duration?: string): number | null {
  if (!duration) return null;
  
  // Match patterns like "5:30", "1h 30m", "10 min", "90 sec"
  const minMatch = duration.match(/(\d+)\s*(?:min|m)/i);
  if (minMatch) return parseInt(minMatch[1], 10);
  
  const hourMatch = duration.match(/(\d+)\s*(?:hour|h)/i);
  const secMatch = duration.match(/(\d+)\s*(?:sec|s)/i);
  
  if (hourMatch) {
    const hours = parseInt(hourMatch[1], 10);
    const mins = minMatch ? parseInt(minMatch[1], 10) : 0;
    return hours * 60 + mins;
  }
  
  if (secMatch) return Math.ceil(parseInt(secMatch[1], 10) / 60);
  
  // Try HH:MM:SS or MM:SS format
  const timeMatch = duration.match(/(\d+):(\d+)(?::(\d+))?/);
  if (timeMatch) {
    if (timeMatch[3]) {
      // HH:MM:SS
      return parseInt(timeMatch[1], 10) * 60 + parseInt(timeMatch[2], 10);
    } else {
      // MM:SS
      return parseInt(timeMatch[1], 10);
    }
  }
  
  return null;
}
