import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Plus, Moon, Sun } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useChildProfiles } from '@/contexts/ChildProfilesContext';
import { useTheme } from 'next-themes';

export function TopBar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { activeChild, childProfiles, setActiveChild, onboardingRequired } = useChildProfiles();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const profileInitials = useMemo(() => {
    if (user?.user_metadata?.full_name) {
      const names = user.user_metadata.full_name.trim().split(' ').filter(Boolean);
      if (names.length) {
        return names
          .map((name) => name[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);
      }
    }
    return user?.email?.slice(0, 2).toUpperCase() || 'TE';
  }, [user?.email, user?.user_metadata?.full_name]);

  const activeLabel = useMemo(() => {
    if (activeChild) {
      return `${activeChild.name} (${activeChild.brain_profile})`;
    }
    if (onboardingRequired) {
      return 'Add your child profile';
    }
    return 'Select a child';
  }, [activeChild, onboardingRequired]);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between bg-gradient-to-r from-primary via-primary to-primary/90 px-4 text-white shadow-2xl transition-all">
        {/* Logo */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 group hover:scale-105 transition-transform"
          aria-label="Go to home"
        >
          <div className="relative">
            <div className="text-4xl group-hover:animate-pulse">🧠</div>
            <div className="absolute inset-0 bg-white/20 rounded-full blur-xl group-hover:bg-white/30 transition-all"></div>
          </div>
          <span className="font-bold text-lg hidden sm:block group-hover:text-white/90 transition-colors">
            NEP System
          </span>
        </button>

        {/* Child selector */}
        <div className="flex-1 flex items-center justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 font-semibold text-white shadow-lg transition hover:bg-white/20"
                type="button"
              >
                <span className="truncate max-w-[14rem] text-center">{activeLabel}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="center" className="w-72">
              <DropdownMenuLabel className="text-center text-xs font-medium uppercase text-muted-foreground">
                Active child profile
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                {childProfiles.length > 0 ? (
                  childProfiles.map((child) => (
                    <DropdownMenuItem
                      key={child.id}
                      className="flex items-center justify-between gap-3"
                      onSelect={() => setActiveChild(child.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-muted">
                          <AvatarImage src={child.photo_url || undefined} alt={child.name} />
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {child.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">{child.name}</span>
                          <span className="text-xs text-muted-foreground">
                            Brain: {child.brain_profile}
                          </span>
                        </div>
                      </div>
                      {activeChild?.id === child.id && (
                        <Badge variant="outline" className="border-primary/30 text-primary">
                          Active
                        </Badge>
                      )}
                    </DropdownMenuItem>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    No child profiles yet. Add your first child to unlock personalized guidance.
                  </div>
                )}
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="flex items-center gap-2"
                onSelect={() => navigate('/quiz')}
              >
                <Plus className="h-4 w-4" />
                Add Child
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme toggle button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
            className="rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            {mounted && theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          <button
            onClick={() => navigate('/profile')}
            className="rounded-full focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Go to profile"
          >
            <Avatar className="h-10 w-10 border-2 border-white/20 cursor-pointer hover:border-white/50 transition-all">
              <AvatarImage src={user?.photo_url || undefined} alt="Profile" />
              <AvatarFallback className="bg-secondary font-bold text-white">
                {profileInitials}
              </AvatarFallback>
            </Avatar>
          </button>
        </div>
      </div>
    </>
  );
}
