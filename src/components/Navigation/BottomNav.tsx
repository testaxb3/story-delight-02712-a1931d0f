import { Home, BookOpen, Video, Target, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: BookOpen, label: 'Scripts', path: '/scripts' },
    { icon: Video, label: 'Videos', path: '/videos' },
    { icon: Target, label: 'My Plan', path: '/tracker' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-lg border-t border-border shadow-2xl transition-all safe-area-bottom"
      style={{
        paddingBottom: 'calc(env(safe-area-inset-bottom) + 8px)',
      }}
    >
      <div
        className="flex items-center justify-around px-2"
        style={{ height: '68px', paddingTop: '8px' }}
      >
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1 transition-all duration-300 ease-in-out rounded-2xl touch-target",
                "min-w-[52px] min-h-[52px] px-4 py-2",
                isActive
                  ? "text-primary scale-110"
                  : "text-muted-foreground hover:text-foreground hover:scale-105 active:scale-95"
              )}
              aria-label={label}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute inset-0 bg-primary/10 rounded-2xl animate-in fade-in zoom-in duration-200" />
              )}
              <Icon className={cn("w-6 h-6 relative z-10 transition-transform", isActive && "scale-110")} />
              <span className={cn("text-[10px] font-semibold relative z-10", isActive && "font-bold")}>
                {label}
              </span>
              {/* Active dot indicator */}
              {isActive && (
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
