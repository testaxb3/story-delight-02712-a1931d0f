import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Play, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type BonusRow = Database['public']['Tables']['bonuses']['Row'];

export default function BonusesCalAI() {
  const navigate = useNavigate();
  const [bonuses, setBonuses] = useState<BonusRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBonuses();
  }, []);

  const fetchBonuses = async () => {
    const { data, error } = await supabase
      .from('bonuses')
      .select('*')
      .is('archived_at', null)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setBonuses(data);
    }
    setLoading(false);
  };

  const handleBonusClick = (bonus: BonusRow) => {
    if (bonus.category === 'ebook' && bonus.view_url) {
      navigate(bonus.view_url);
    } else if (bonus.view_url) {
      window.open(bonus.view_url, '_blank');
    }
  };

  const videos = bonuses.filter(b => b.category === 'video');
  const ebooks = bonuses.filter(b => b.category === 'ebook');

  return (
    <MainLayout>
      <div className="px-4 md:px-6 py-6 md:py-8 pb-24 md:pb-8">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-3">Library</h1>
          <p className="text-base md:text-lg text-muted-foreground">
            Premium ebooks and video content
          </p>
        </div>

        {/* Ebooks Section */}
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

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-48 rounded-2xl bg-muted/30 animate-pulse" />
              ))}
            </div>
          ) : ebooks.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No ebooks available yet
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ebooks.map(bonus => (
                <button
                  key={bonus.id}
                  onClick={() => handleBonusClick(bonus)}
                  className="group text-left"
                >
                  <div className="relative rounded-2xl overflow-hidden bg-card border border-border mb-3 aspect-[3/4] transition-all hover:scale-[1.02]">
                    {bonus.thumbnail ? (
                      <img
                        src={bonus.thumbnail}
                        alt={bonus.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-sm md:text-base mb-1 line-clamp-2 group-hover:text-foreground/80 transition-colors">
                    {bonus.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                    {bonus.description}
                  </p>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Videos Section */}
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

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-48 rounded-2xl bg-muted/30 animate-pulse" />
              ))}
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No videos available yet
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {videos.map(bonus => (
                <button
                  key={bonus.id}
                  onClick={() => handleBonusClick(bonus)}
                  className="group text-left"
                >
                  <div className="relative rounded-2xl overflow-hidden bg-card border border-border mb-3 aspect-video transition-all hover:scale-[1.02]">
                    {bonus.thumbnail ? (
                      <>
                        <img
                          src={bonus.thumbnail}
                          alt={bonus.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
                            <Play className="w-6 h-6 text-black ml-1" fill="currentColor" />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Play className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                    {bonus.duration && (
                      <div className="absolute bottom-2 right-2 px-2 py-1 rounded-lg bg-black/80 text-white text-xs font-medium">
                        {bonus.duration}
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-sm md:text-base mb-1 line-clamp-2 group-hover:text-foreground/80 transition-colors">
                    {bonus.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                    {bonus.description}
                  </p>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </MainLayout>
  );
}
