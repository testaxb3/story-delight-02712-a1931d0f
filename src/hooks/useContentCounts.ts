import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ContentCounts {
    scripts: number;
    videos: number;
    ebooks: number;
}

/**
 * Hook to fetch total content counts from the database
 * Used for social proof on quiz results page
 */
export function useContentCounts(brainProfile?: string) {
    return useQuery<ContentCounts>({
        queryKey: ['content-counts', brainProfile],
        queryFn: async () => {
            // Fetch all counts in parallel
            const [scriptsResult, videosResult, ebooksResult] = await Promise.all([
                // Scripts count - filter by profile if provided, otherwise all
                brainProfile
                    ? supabase
                        .from('scripts')
                        .select('id', { count: 'exact', head: true })
                        .or(`profile.eq.${brainProfile},profile.eq.UNIVERSAL`)
                    : supabase
                        .from('scripts')
                        .select('id', { count: 'exact', head: true }),

                // Videos count - all videos
                supabase
                    .from('videos')
                    .select('id', { count: 'exact', head: true }),

                // Ebooks count - all ebooks (not deleted)
                supabase
                    .from('ebooks')
                    .select('id', { count: 'exact', head: true })
                    .is('deleted_at', null),
            ]);

            return {
                scripts: scriptsResult.count || 0,
                videos: videosResult.count || 0,
                ebooks: ebooksResult.count || 0,
            };
        },
        staleTime: 10 * 60 * 1000, // 10 minutes cache
    });
}
