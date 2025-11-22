import { useState, useEffect, useMemo } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Play, BookOpen, Sparkles, Clock, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type BonusRow = Database['public']['Tables']['bonuses']['Row'];

const CATEGORIES = [
  { id: 'all', label: 'All', icon: Sparkles },
  { id: 'video', label: 'Videos', icon: Play },
  { id: 'ebook', label: 'Ebooks', icon: BookOpen },
];

export default function BonusesCalAI() {
  const navigate = useNavigate();
  const [bonuses, setBonuses] = useState<BonusRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

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

  const filteredBonuses = useMemo(() => {
    return bonuses.filter(bonus => {
      const matchesSearch = !searchQuery || 
        bonus.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bonus.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || bonus.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [bonuses, searchQuery, selectedCategory]);

  const categoryCounts = useMemo(() => {
    return CATEGORIES.reduce((acc, cat) => {
      if (cat.id === 'all') {
        acc[cat.id] = bonuses.length;
      } else {
        acc[cat.id] = bonuses.filter(b => b.category === cat.id).length;
      }
      return acc;
    }, {} as Record<string, number>);
  }, [bonuses]);

  const handleBonusClick = (bonus: BonusRow) => {
    if (bonus.category === 'ebook' && bonus.view_url) {
      navigate(bonus.view_url);
    } else if (bonus.view_url) {
      window.open(bonus.view_url, '_blank');
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-6 pb-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Bonuses</h1>
          <p className="text-muted-foreground">Premium content and exclusive resources</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search bonuses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? "default" : "ghost"}
              onClick={() => setSelectedCategory(cat.id)}
              className="flex-shrink-0"
            >
              <cat.icon className="w-4 h-4 mr-2" />
              {cat.label}
              {categoryCounts[cat.id] > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {categoryCounts[cat.id]}
                </Badge>
              )}
            </Button>
          ))}
        </div>

        {/* Bonuses Grid */}
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} className="h-64 animate-pulse bg-card/50" />
            ))}
          </div>
        ) : filteredBonuses.length === 0 ? (
          <Card className="p-12 text-center bg-card">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No bonuses found</h3>
            <p className="text-muted-foreground">Try adjusting your filters</p>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBonuses.map(bonus => (
              <Card
                key={bonus.id}
                className="overflow-hidden hover:bg-muted/5 transition-colors cursor-pointer bg-card border-border"
                onClick={() => handleBonusClick(bonus)}
              >
                {/* Thumbnail */}
                {bonus.thumbnail && (
                  <div className="relative aspect-video bg-muted">
                    <img
                      src={bonus.thumbnail}
                      alt={bonus.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      {bonus.category === 'video' ? (
                        <Play className="w-12 h-12 text-white" />
                      ) : (
                        <Eye className="w-12 h-12 text-white" />
                      )}
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {bonus.category}
                    </Badge>
                    {bonus.duration && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {bonus.duration}
                      </div>
                    )}
                  </div>
                  
                  <h3 className="font-medium line-clamp-2 mb-2">
                    {bonus.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {bonus.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
