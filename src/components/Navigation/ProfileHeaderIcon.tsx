import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { cn } from '@/lib/utils';

interface ProfileHeaderIconProps {
  className?: string;
  size?: 'sm' | 'md';
}

export function ProfileHeaderIcon({ className, size = 'md' }: ProfileHeaderIconProps) {
  const { user } = useAuth();
  const { data: profile } = useUserProfile(user?.id, user?.email);
  const navigate = useNavigate();

  const profileInitials = useMemo(() => {
    const name = profile?.user_metadata?.full_name || user?.user_metadata?.full_name;
    if (name) {
      const names = String(name).trim().split(' ').filter(Boolean);
      if (names.length) {
        return names
          .map((n: string) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);
      }
    }
    return user?.email?.slice(0, 2).toUpperCase() || 'U';
  }, [profile?.user_metadata?.full_name, user?.email, user?.user_metadata?.full_name]);

  const sizeClasses = size === 'sm' 
    ? 'h-8 w-8' 
    : 'h-10 w-10';

  const avatarUrl = profile?.photo_url || (user?.user_metadata as any)?.avatar_url;

  return (
    <button
      onClick={() => navigate('/profile')}
      className={cn(
        "rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 transition-transform hover:scale-105 active:scale-95",
        className
      )}
      aria-label="Go to profile"
    >
      <Avatar className={cn(
        sizeClasses,
        "border-2 border-border/50 hover:border-primary/50 transition-colors"
      )}>
        <AvatarImage 
          src={avatarUrl} 
          alt="Profile" 
        />
        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
          {profileInitials}
        </AvatarFallback>
      </Avatar>
    </button>
  );
}
