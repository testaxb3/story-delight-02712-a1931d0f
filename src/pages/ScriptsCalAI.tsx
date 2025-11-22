import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Sparkles, Clock, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useChildProfiles } from '@/contexts/ChildProfilesContext';
import { ScriptModal } from '@/components/scripts/ScriptModal';
import { useFavoriteScripts } from '@/hooks/useFavoriteScripts';
import { recordScriptUsage } from '@/lib/supabase/progress';
import type { Database } from '@/integrations/supabase/types';

type ScriptRow = Database['public']['Tables']['scripts']['Row'];

const CATEGORIES = [
  { id: 'all', label: 'All', emoji: '✨' },
  { id: 'Bedtime', label: 'Bedtime', emoji: '🌙' },
  { id: 'Mealtime', label: 'Mealtime', emoji: '🍽️' },
  { id: 'Tantrums', label: 'Tantrums', emoji: '😤' },
  { id: 'Social', label: 'Social', emoji: '👥' },
  { id: 'Transitions', label: 'Transitions', emoji: '🔄' },
];

export default function ScriptsCalAI() {
  const { user } = useAuth();
  const { activeChild } = useChildProfiles();
  const [scripts, setScripts] = useState<ScriptRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedScript, setSelectedScript] = useState<ScriptRow | null>(null);
  
  const { favorites, toggleFavorite } = useFavoriteScripts();

  useEffect(() => {
    if (activeChild) {
      fetchScripts();
    }
  }, [activeChild]);

  const fetchScripts = async () => {
    setLoading(true);
    let query = supabase
      .from('scripts')
      .select('*')
      .order('created_at', { ascending: false });

    if (activeChild?.brain_profile) {
      query = query.or(`profile.eq.${activeChild.brain_profile},profile.eq.UNIVERSAL`);
    }

    const { data, error } = await query;
    if (!error && data) {
      setScripts(data);
    }
    setLoading(false);
  };

  const filteredScripts = scripts.filter(script => {
    const matchesSearch = !searchQuery || 
      script.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      script.the_situation?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || script.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categoryCounts = CATEGORIES.reduce((acc, cat) => {
    if (cat.id === 'all') {
      acc[cat.id] = scripts.length;
    } else {
      acc[cat.id] = scripts.filter(s => s.category === cat.id).length;
    }
    return acc;
  }, {} as Record<string, number>);

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-6 pb-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Scripts</h1>
          <p className="text-muted-foreground">Practical strategies for everyday situations</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search scripts..."
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
              <span className="mr-2">{cat.emoji}</span>
              {cat.label}
              {categoryCounts[cat.id] > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {categoryCounts[cat.id]}
                </Badge>
              )}
            </Button>
          ))}
        </div>

        {/* Scripts Grid */}
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} className="h-48 animate-pulse bg-card/50" />
            ))}
          </div>
        ) : filteredScripts.length === 0 ? (
          <Card className="p-12 text-center bg-card">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No scripts found</h3>
            <p className="text-muted-foreground">Try adjusting your filters</p>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredScripts.map(script => (
              <Card
                key={script.id}
                className="p-6 hover:bg-muted/5 transition-colors cursor-pointer bg-card border-border"
                onClick={() => setSelectedScript(script)}
              >
                <div className="flex items-start justify-between mb-3">
                  <Badge variant="secondary" className="text-xs">
                    {script.category}
                  </Badge>
                  {script.emergency_suitable && (
                    <Badge variant="destructive" className="text-xs">
                      SOS
                    </Badge>
                  )}
                </div>
                
                <h3 className="font-medium mb-2 line-clamp-2">
                  {script.title}
                </h3>
                
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {script.the_situation}
                </p>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {script.duration_minutes}min
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    {script.difficulty}/5
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Script Modal */}
      <ScriptModal
        open={!!selectedScript}
        onOpenChange={(open) => {
          if (!open) setSelectedScript(null);
        }}
        script={selectedScript}
        isFavorite={selectedScript ? favorites.includes(selectedScript.id) : false}
        onToggleFavorite={async () => {
          if (selectedScript) {
            await toggleFavorite(selectedScript.id);
          }
        }}
        onMarkUsed={async () => {
          if (selectedScript && user) {
            await recordScriptUsage({
              userId: user.id,
              scriptId: selectedScript.id,
              fallbackChildProfile: activeChild?.brain_profile
            });
          }
        }}
      />
    </MainLayout>
  );
}
