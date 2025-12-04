import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Headphones, Check, ArrowLeft, Shield, Zap, Clock, 
  Sparkles, Music, Lock, ChevronRight, ExternalLink
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useMembershipBadges } from '@/hooks/useMembershipBadges';
import { cn } from '@/lib/utils';

interface AudioSeries {
  id: string;
  name: string;
  description: string | null;
  cover_image: string | null;
  track_count: number | null;
  total_duration: number | null;
  unlock_key: string | null;
  slug: string;
}

export default function ListenUpgrade() {
  const navigate = useNavigate();
  const { isNepListen, isLoading: badgesLoading } = useMembershipBadges();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch all audio series
  const { data: allSeries = [] } = useQuery({
    queryKey: ['audio-series-upgrade'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audio_series')
        .select('id, name, description, cover_image, track_count, total_duration, unlock_key, slug')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as AudioSeries[];
    },
  });

  const premiumSeries = allSeries.filter(s => s.unlock_key);
  const freeSeries = allSeries.filter(s => !s.unlock_key);
  
  const totalPremiumTracks = premiumSeries.reduce((sum, s) => sum + (s.track_count || 0), 0);
  const totalPremiumMinutes = Math.round(premiumSeries.reduce((sum, s) => sum + (s.total_duration || 0), 0) / 60);

  const handleUpgrade = () => {
    window.open('https://gtmsinop.mycartpanda.com/checkout/203914365:1', '_blank');
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '0 min';
    const mins = Math.round(seconds / 60);
    return `${mins} min`;
  };

  // Already subscribed - Thank You screen
  if (!badgesLoading && isNepListen) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-emerald-900 to-black">
        <div className="w-full h-[env(safe-area-inset-top)]" />
        
        {/* Header */}
        <div className="sticky top-0 z-50 px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/listen')}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="px-6 py-12 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center shadow-2xl shadow-emerald-500/30"
          >
            <Check className="w-12 h-12 text-white" />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-white mb-3"
          >
            You're All Set!
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-emerald-200/80 text-lg mb-8"
          >
            You have full access to all premium audio series
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30"
          >
            <Headphones className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-300 font-semibold">NEP Listen Active</span>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={() => navigate('/listen')}
            className="mt-8 w-full max-w-xs mx-auto h-14 rounded-full bg-white text-emerald-900 font-bold text-lg flex items-center justify-center gap-2"
          >
            Go to Audio Library
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    );
  }

  // Upsell page
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <div className="w-full h-[env(safe-area-inset-top)]" />
      
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-purple-600/20 via-pink-500/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-amber-500/10 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="sticky top-0 z-50 px-4 py-4 flex items-center gap-4 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
        <button
          onClick={() => navigate('/listen')}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
      </div>

      <div className="relative px-6 pb-32">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center py-8"
        >
          {/* Badge Icon */}
          <div className="relative w-28 h-28 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#D4A574] to-[#B8864A] animate-pulse opacity-50 blur-xl" />
            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-[#D4A574] to-[#B8864A] flex items-center justify-center shadow-2xl">
              <Headphones className="w-14 h-14 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center border-4 border-black">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
            NEP Listen
          </h1>
          <p className="text-lg text-white/70 max-w-sm mx-auto">
            Unlock all premium audio series and transform how you respond to parenting moments
          </p>
        </motion.div>

        {/* Stats Row */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-4 gap-3 mb-10"
        >
          {[
            { value: `${totalPremiumTracks}+`, label: 'Tracks' },
            { value: `${totalPremiumMinutes}`, label: 'Minutes' },
            { value: '∞', label: 'Access' },
            { value: 'New', label: 'Weekly' },
          ].map((stat, i) => (
            <div key={i} className="bg-white/5 rounded-2xl p-4 text-center border border-white/10">
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-white/50">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Benefits */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="mb-10"
        >
          <h2 className="text-lg font-semibold text-white mb-4">What You Get</h2>
          <div className="space-y-3">
            {[
              'Access all current premium series',
              'New series added regularly',
              'Science-backed calming techniques',
              'Listen offline anytime',
              'Earn the exclusive NEP Listen badge',
              'Lifetime access - pay once, listen forever',
            ].map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={mounted ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="flex items-center gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#D4A574] to-[#B8864A] flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-white/80">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Premium Series Preview */}
        {premiumSeries.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5 }}
            className="mb-10"
          >
            <h2 className="text-lg font-semibold text-white mb-4">Premium Series</h2>
            <div className="space-y-3">
              {premiumSeries.map((series) => (
                <div 
                  key={series.id}
                  className="relative bg-white/5 rounded-2xl p-4 border border-white/10 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#D4A574]/10 to-transparent" />
                  <div className="relative flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                      {series.cover_image ? (
                        <img src={series.cover_image} alt={series.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                          <Music className="w-8 h-8 text-white/50" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Lock className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate">{series.name}</h3>
                      <p className="text-sm text-white/50 truncate">{series.description}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-white/40">
                        <span>{series.track_count} tracks</span>
                        <span>•</span>
                        <span>{formatDuration(series.total_duration)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Free Series */}
        {freeSeries.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6 }}
            className="mb-10"
          >
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-semibold text-white">Already Free</h2>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-green-500/20 text-green-400 rounded-full">INCLUDED</span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
              {freeSeries.map((series) => (
                <div 
                  key={series.id}
                  className="flex-shrink-0 w-32"
                >
                  <div className="w-full aspect-square rounded-xl overflow-hidden mb-2">
                    {series.cover_image ? (
                      <img src={series.cover_image} alt={series.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                        <Music className="w-10 h-10 text-white/50" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-medium text-white/70 truncate">{series.name}</p>
                  <p className="text-xs text-white/40">{series.track_count} tracks</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Trust Badges */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7 }}
          className="flex items-center justify-center gap-6 mb-10 py-6 border-y border-white/10"
        >
          {[
            { icon: Shield, label: '30-Day Guarantee' },
            { icon: Zap, label: 'Instant Access' },
            { icon: Clock, label: 'Lifetime' },
          ].map((badge, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <badge.icon className="w-5 h-5 text-white/40" />
              <span className="text-[10px] text-white/40 font-medium">{badge.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Guarantee */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.75 }}
          className="bg-white/5 rounded-2xl p-5 mb-8 border border-white/10"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">30-Day Calm Parent Guarantee</h3>
              <p className="text-sm text-white/60">
                If you don't feel calmer in challenging moments within 30 days, we'll refund every penny. No questions asked.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/95 to-transparent pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          onClick={handleUpgrade}
          className={cn(
            "w-full h-14 rounded-full font-bold text-lg flex items-center justify-center gap-2",
            "bg-gradient-to-r from-[#D4A574] to-[#B8864A] text-white",
            "shadow-lg shadow-[#D4A574]/30",
            "active:scale-[0.98] transition-transform"
          )}
        >
          <span>Unlock NEP Listen</span>
          <ExternalLink className="w-5 h-5" />
        </motion.button>
        <p className="text-center text-xs text-white/40 mt-3">
          Secure checkout • One-time payment • Lifetime access
        </p>
      </div>
    </div>
  );
}
