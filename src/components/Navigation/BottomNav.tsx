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
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background border-t border-border shadow-lg transition-colors"
      style={{
        paddingBottom: 'calc(env(safe-area-inset-bottom) + 12px)',
      }}
    >
      <div
        className="flex items-center justify-around"
        style={{ height: '65px', paddingTop: '8px' }}
      >
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-all duration-300 ease-in-out rounded-full",
                "min-w-[44px] min-h-[44px] px-3 py-2",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
              aria-label={label}
            >
              <Icon className="w-[22px] h-[22px]" />
              <span className="text-[10px] font-medium">
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
