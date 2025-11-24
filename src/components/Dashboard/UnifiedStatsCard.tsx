import { Flame, Calendar, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useChildProfiles } from '@/contexts/ChildProfilesContext';

interface UnifiedStatsCardProps {
  scriptsUsed: number;
  scriptsTotal: number;
  className?: string;
}

export function UnifiedStatsCard({ scriptsUsed, scriptsTotal, className }: UnifiedStatsCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { activeChild } = useChildProfiles();
  const [isLoggedToday, setIsLoggedToday] = useState(false);
  const [checking, setChecking] = useState(true);

  const percentage = scriptsTotal > 0 ? (scriptsUsed / scriptsTotal) * 100 : 0;
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Check if today is already logged
  useEffect(() => {
    const checkTodayLog = async () => {
      if (!user?.id || !activeChild?.id) {
        setChecking(false);
        return;
      }

      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('tracker_days')
        .select('id, completed')
        .eq('user_id', user.id)
        .eq('child_profile_id', activeChild.id)
        .eq('date', today)
        .eq('completed', true)
        .single();

      setIsLoggedToday(!!data && !error);
      setChecking(false);
    };

    checkTodayLog();
  }, [user?.id, activeChild?.id]);

  return (
    <div className={cn(
      "bg-white dark:bg-card rounded-[32px] p-6 flex flex-col h-[280px]",
      "border border-[#E5E7EB] dark:border-transparent",
      "shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:shadow-none",
      className
    )}>
      {/* Top section - Stats and Progress Ring */}
      <div className="flex items-center justify-between mb-4 flex-1">
        {/* Left side - Big number */}
        <div>
          <p className="text-6xl font-bold mb-2 text-[#1A1A1A] dark:text-white">{scriptsUsed}</p>
          <p className="text-sm text-[#6B7280] dark:text-muted-foreground font-medium">Scripts Used</p>
          <p className="text-xs text-[#9CA3AF] dark:text-muted-foreground mt-1">of {scriptsTotal} total</p>
        </div>

        {/* Right side - Progress Ring with Fire Icon */}
        <div className="relative w-24 h-24 flex-shrink-0">
          {/* Background circle */}
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="45"
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              className="text-[#F3F4F6] dark:text-muted/20"
            />
            {/* Progress circle */}
            <circle
              cx="48"
              cy="48"
              r="45"
              stroke="hsl(var(--accent))"
              strokeWidth="6"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
              <Flame className="w-6 h-6 text-accent" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section - Log Button */}
      <button
        onClick={() => !isLoggedToday && navigate('/progress')}
        disabled={isLoggedToday || checking}
        className={cn(
          "w-full h-12 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-all",
          isLoggedToday
            ? "bg-accent/10 text-accent cursor-not-allowed"
            : "bg-[#F3F4F6] dark:bg-muted hover:bg-[#E5E7EB] dark:hover:bg-muted/80 text-[#1A1A1A] dark:text-foreground cursor-pointer",
          checking && "opacity-50 cursor-wait"
        )}
      >
        {isLoggedToday ? (
          <>
            <Check className="w-4 h-4" />
            Already Logged
          </>
        ) : (
          <>
            <Calendar className="w-4 h-4" />
            Log Today
          </>
        )}
      </button>
    </div>
  );
}
