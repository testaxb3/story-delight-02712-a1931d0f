import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Play, BookOpen, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type BonusRow = Database['public']['Tables']['bonuses']['Row'];

export default function BonusesCalAI() {
  const navigate = useNavigate();
  const [bonuses, setBonuses] = useState<BonusRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'video' | 'ebook'>('all');

  useEffect(() => {
    fetchBonuses();
  }, []);

  const fetchBonuses = async () => {
    try {
      const { data, error } = await supabase
        .from('bonuses')
        .select('*')
        .is('archived_at', null)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bonuses:', error);
        return;
      }

      if (data) {
        setBonuses(data);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get thumbnail URL from Supabase Storage or return as-is if already a URL
  const getThumbnailUrl = (bonus: BonusRow): string | null => {
    if (!bonus.thumbnail) return null;
    
    // If it's already a full URL, return it
    if (bonus.thumbnail.startsWith('http://') || bonus.thumbnail.startsWith('https://')) {
      return bonus.thumbnail;
    }
    
    // If it starts with /, remove it for Supabase Storage path
    const cleanPath = bonus.thumbnail.startsWith('/') 
      ? bonus.thumbnail.substring(1) 
      : bonus.thumbnail;
    
    // Build Supabase Storage public URL
    const { data } = supabase.storage
      .from('community-posts')
      .getPublicUrl(cleanPath);
    
    return data.publicUrl;
  };

  const handleBonusClick = (bonus: BonusRow) => {
    if (bonus.category === 'ebook' && bonus.view_url) {
      navigate(bonus.view_url);
    } else if (bonus.view_url) {
      window.open(bonus.view_url, '_blank');
    }
  };

  // Filter bonuses
  const filteredBonuses = bonuses.filter(bonus => {
    const matchesSearch = !searchQuery || 
      bonus.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (bonus.description && bonus.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || bonus.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const videos = filteredBonuses.filter(b => b.category === 'video');
  const ebooks = filteredBonuses.filter(b => b.category === 'ebook');

  return (
    <MainLayout>
      <div className="px-4 md:px-6 py-6 md:py-8 pb-24 md:pb-8">
        {/* Header */}
        <div className="mb-8 md:mb-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-3">Library</h1>
          <p className="text-base md:text-lg text-muted-foreground">
            Premium ebooks and video content
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-4 bg-card border border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
          />
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-foreground text-background'
                : 'bg-card text-foreground hover:bg-muted'
            }`}
          >
            All ({filteredBonuses.length})
          </button>
          <button
            onClick={() => setSelectedCategory('ebook')}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === 'ebook'
                ? 'bg-foreground text-background'
                : 'bg-card text-foreground hover:bg-muted'
            }`}
          >
            Ebooks ({ebooks.length})
          </button>
          <button
            onClick={() => setSelectedCategory('video')}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === 'video'
                ? 'bg-foreground text-background'
                : 'bg-card text-foreground hover:bg-muted'
            }`}
          >
            Videos ({videos.length})
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 rounded-2xl bg-muted/30 animate-pulse" />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredBonuses.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No content found</h3>
            <p className="text-muted-foreground">
              {searchQuery ? 'Try a different search term' : 'No content available yet'}
            </p>
          </div>
        )}

        {/* Content Display */}
        {!loading && filteredBonuses.length > 0 && (
          <>
            {/* Show Ebooks Section if category is 'all' or 'ebook' */}
            {(selectedCategory === 'all' || selectedCategory === 'ebook') && ebooks.length > 0 && (
              <section className="mb-12 md:mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold">Ebooks</h2>
                    <p className="text-sm text-muted-foreground">{ebooks.length} available</p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {ebooks.map(bonus => (
                    <button
                      key={bonus.id}
                      onClick={() => handleBonusClick(bonus)}
                      className="group text-left"
                    >
                      <div className="relative rounded-2xl overflow-hidden bg-card border border-border mb-3 aspect-[3/4] transition-all hover:scale-[1.02]">
                        {getThumbnailUrl(bonus) ? (
                          <img
                            src={getThumbnailUrl(bonus)!}
                            alt={bonus.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback to placeholder if image fails to load
                              const target = e.currentTarget;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                const placeholder = parent.querySelector('.fallback-placeholder');
                                if (placeholder) {
                                  (placeholder as HTMLElement).style.display = 'flex';
                                }
                              }
                            }}
                          />
                        ) : null}
                        <div 
                          className="fallback-placeholder w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center absolute inset-0"
                          style={{ display: bonus.thumbnail ? 'none' : 'flex' }}
                        >
                          <BookOpen className="w-16 h-16 text-muted-foreground/30" />
                        </div>
                      </div>
                      <h3 className="font-semibold text-sm md:text-base mb-1 line-clamp-2 group-hover:text-foreground/80 transition-colors">
                        {bonus.title}
                      </h3>
                      {bonus.description && (
                        <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                          {bonus.description}
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Show Videos Section if category is 'all' or 'video' */}
            {(selectedCategory === 'all' || selectedCategory === 'video') && videos.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center">
                    <Play className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold">Videos</h2>
                    <p className="text-sm text-muted-foreground">{videos.length} available</p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {videos.map(bonus => (
                    <button
                      key={bonus.id}
                      onClick={() => handleBonusClick(bonus)}
                      className="group text-left"
                    >
                      <div className="relative rounded-2xl overflow-hidden bg-card border border-border mb-3 aspect-video transition-all hover:scale-[1.02]">
                        {getThumbnailUrl(bonus) ? (
                          <>
                            <img
                              src={getThumbnailUrl(bonus)!}
                              alt={bonus.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.currentTarget;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  const fallback = parent.querySelector('.fallback-placeholder');
                                  if (fallback) {
                                    (fallback as HTMLElement).style.display = 'flex';
                                  }
                                }
                              }}
                            />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
                                <Play className="w-6 h-6 text-black ml-1" fill="currentColor" />
                              </div>
                            </div>
                          </>
                        ) : null}
                        <div 
                          className="fallback-placeholder w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center absolute inset-0"
                          style={{ display: bonus.thumbnail ? 'none' : 'flex' }}
                        >
                          <Play className="w-12 h-12 text-muted-foreground/30" />
                        </div>
                        {bonus.duration && (
                          <div className="absolute bottom-2 right-2 px-2 py-1 rounded-lg bg-black/80 text-white text-xs font-medium">
                            {bonus.duration}
                          </div>
                        )}
                      </div>
                      <h3 className="font-semibold text-sm md:text-base mb-1 line-clamp-2 group-hover:text-foreground/80 transition-colors">
                        {bonus.title}
                      </h3>
                      {bonus.description && (
                        <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                          {bonus.description}
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}
