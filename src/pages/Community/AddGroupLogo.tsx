import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useHaptic } from '@/hooks/useHaptic';
import { cn } from '@/lib/utils';

// Curated selection of premium emojis for communities
const EMOJI_CATEGORIES = [
  {
    label: 'Vibe',
    items: [
      { emoji: '⚡', color: 'from-yellow-400 to-orange-500' },
      { emoji: '🔥', color: 'from-orange-500 to-red-600' },
      { emoji: '✨', color: 'from-cyan-400 to-blue-500' },
      { emoji: '🌱', color: 'from-green-400 to-emerald-600' },
      { emoji: '🧠', color: 'from-purple-500 to-indigo-600' },
      { emoji: '💪', color: 'from-slate-500 to-slate-700' },
    ]
  },
  {
    label: 'Family',
    items: [
      { emoji: '🏠', color: 'from-rose-400 to-pink-600' },
      { emoji: '👨‍👩‍👧‍👦', color: 'from-blue-400 to-indigo-600' },
      { emoji: '🧸', color: 'from-amber-400 to-orange-500' },
      { emoji: '❤️', color: 'from-red-500 to-rose-600' },
      { emoji: '🍼', color: 'from-sky-400 to-blue-500' },
      { emoji: '🎨', color: 'from-fuchsia-400 to-purple-600' },
    ]
  },
  {
    label: 'Animals',
    items: [
      { emoji: '🦁', color: 'from-amber-500 to-yellow-600' },
      { emoji: '🦅', color: 'from-yellow-600 to-orange-700' },
      { emoji: '🦊', color: 'from-orange-500 to-red-600' },
      { emoji: '🐼', color: 'from-orange-800 to-orange-900' },
      { emoji: '🐨', color: 'from-slate-600 to-slate-800' },
      { emoji: '🦄', color: 'from-pink-400 to-purple-600' },
    ]
  }
];

export default function AddGroupLogo() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const groupName = location.state?.groupName || 'Your Tribe';
  const { triggerHaptic } = useHaptic();
  
  const [selectedEmoji, setSelectedEmoji] = useState(EMOJI_CATEGORIES[0].items[0]);
  const [creating, setCreating] = useState(false);

  const handleContinue = async () => {
    setCreating(true);
    triggerHaptic('medium');

    try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      if (authError || !authUser) {
        console.error('Auth error:', authError);
        toast.error('Authentication error');
        setCreating(false);
        return;
      }

      // Create community with emoji logo
      const { data: community, error: communityError } = await supabase
        .from('communities')
        .insert({
          name: groupName,
          logo_emoji: selectedEmoji.emoji,
          created_by: authUser.id,
        })
        .select()
        .single();

      if (communityError) {
        throw communityError;
      }

      // Add creator as leader
      const { error: memberError } = await supabase
        .from('community_members')
        .insert({
          community_id: community.id,
          user_id: authUser.id,
          role: 'leader',
        });

      if (memberError) throw memberError;

      toast.success('Tribe created successfully!');
      navigate('/community/feed', { state: { communityId: community.id } });
    } catch (error: any) {
      console.error('Error creating community:', error);
      toast.error('Failed to create tribe: ' + error.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      {/* Animated Background that changes with selection */}
      <motion.div 
        animate={{ opacity: 1 }}
        className={`fixed inset-0 bg-gradient-to-br ${selectedEmoji.color} opacity-10 blur-[100px] transition-all duration-1000 pointer-events-none`}
      />

      {/* Header */}
      <header className="px-6 pt-[calc(env(safe-area-inset-top)+20px)] flex items-center justify-between relative z-10">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center hover:bg-secondary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Step 2 of 2</div>
        <div className="w-10" />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center pt-8 px-6 relative z-10">
        
        {/* Live Preview Card */}
        <div className="mb-12 relative">
          <motion.div 
            layoutId="preview-card"
            className={`w-64 h-80 rounded-[32px] bg-gradient-to-br ${selectedEmoji.color} p-1 shadow-2xl relative overflow-hidden`}
          >
            {/* Glass Overlay */}
            <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />
            
            <div className="absolute inset-1 bg-card/90 backdrop-blur-xl rounded-[28px] flex flex-col items-center justify-center p-6 text-center">
              <motion.div
                key={selectedEmoji.emoji}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="text-[80px] mb-6 drop-shadow-md leading-none"
              >
                {selectedEmoji.emoji}
              </motion.div>
              
              <h2 className="text-2xl font-bold tracking-tight mb-2 line-clamp-2">
                {groupName}
              </h2>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">
                Private Community
              </p>
            </div>
          </motion.div>
          
          {/* Reflection/Glow under card */}
          <div className={`absolute -bottom-8 left-10 right-10 h-12 bg-gradient-to-br ${selectedEmoji.color} blur-2xl opacity-40 -z-10 transition-all duration-500`} />
        </div>

        {/* Selection Grid */}
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold">Choose an Emblem</h3>
            <p className="text-muted-foreground text-sm">Pick a symbol that represents your vibe.</p>
          </div>

          <div className="space-y-6 pb-32">
            {EMOJI_CATEGORIES.map((category) => (
              <div key={category.label}>
                <h4 className="text-xs font-semibold text-muted-foreground mb-3 ml-1">{category.label}</h4>
                <div className="grid grid-cols-6 gap-2">
                  {category.items.map((item) => {
                    const isSelected = selectedEmoji.emoji === item.emoji;
                    return (
                      <motion.button
                        key={item.emoji}
                        whileTap={{ scale: 0.8 }}
                        onClick={() => {
                          triggerHaptic('light');
                          setSelectedEmoji(item);
                        }}
                        className={cn(
                          "aspect-square rounded-2xl flex items-center justify-center text-2xl transition-all relative",
                          isSelected 
                            ? `bg-gradient-to-br ${item.color} shadow-lg scale-110 ring-2 ring-background` 
                            : "bg-secondary/50 hover:bg-secondary"
                        )}
                      >
                        {item.emoji}
                        {isSelected && (
                          <motion.div 
                            layoutId="check"
                            className="absolute -top-1 -right-1 w-4 h-4 bg-white text-black rounded-full flex items-center justify-center shadow-sm"
                          >
                            <Check className="w-2.5 h-2.5 stroke-[4]" />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-0 left-0 right-0 p-6 pb-[calc(env(safe-area-inset-bottom)+20px)] bg-gradient-to-t from-background via-background/95 to-transparent z-20"
      >
        <Button
          onClick={handleContinue}
          disabled={creating}
          className="w-full h-14 rounded-full text-lg font-semibold shadow-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
        >
          {creating ? 'Creating Tribe...' : 'Create Tribe'}
        </Button>
      </motion.div>
    </div>
  );
}