import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useHaptic } from '@/hooks/useHaptic';

export default function CreateGroupName() {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState('');
  const { triggerHaptic } = useHaptic();

  const handleContinue = () => {
    if (groupName.trim()) {
      triggerHaptic('medium');
      navigate('/community/add-logo', { state: { groupName: groupName.trim() } });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Clean Header */}
      <header className="px-6 pt-[calc(env(safe-area-inset-top)+20px)] flex items-center justify-between relative z-10">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center hover:bg-secondary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Step 1 of 2</div>
        <div className="w-10" />
      </header>

      {/* Main Content - Centered Focus */}
      <main className="flex-1 flex flex-col justify-center px-6 relative">
        {/* Ambient Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[50%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-md mx-auto"
        >
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-primary/20"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Name your Tribe</h1>
            <p className="text-muted-foreground">Give your community a unique identity.</p>
          </div>

          <div className="relative group">
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="E.g., Calm Parenting"
              maxLength={30}
              autoFocus
              className="w-full text-center text-3xl font-bold bg-transparent border-b-2 border-border focus:border-primary py-4 placeholder:text-muted-foreground/30 focus:outline-none transition-colors"
            />
            {groupName.length > 0 && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute right-0 bottom-4 text-xs text-muted-foreground font-mono"
              >
                {groupName.length}/30
              </motion.span>
            )}
          </div>

          {/* Suggestions */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12"
          >
            <p className="text-xs text-center text-muted-foreground uppercase tracking-widest mb-4">Inspirations</p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                'Mindful Mamas',
                'Super Dads',
                'Chaos Coordinators',
                'Zen Zone',
              ].map((suggestion, i) => (
                <motion.button
                  key={suggestion}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + (i * 0.1) }}
                  onClick={() => {
                    triggerHaptic('light');
                    setGroupName(suggestion);
                  }}
                  className="px-4 py-2 bg-secondary/50 border border-border hover:border-primary/30 rounded-full text-sm font-medium transition-all hover:scale-105 active:scale-95"
                >
                  {suggestion}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </main>

      {/* Floating Action Button */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 pb-[calc(env(safe-area-inset-bottom)+20px)] sticky bottom-0"
      >
        <Button
          onClick={handleContinue}
          disabled={!groupName.trim()}
          className="w-full h-14 rounded-full text-lg font-semibold shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 transition-all disabled:opacity-50 disabled:shadow-none"
        >
          Continue <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </motion.div>
    </div>
  );
}