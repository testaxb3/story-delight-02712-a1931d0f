import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Home, BookOpen, Video, Users, User } from 'lucide-react';

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: BookOpen, label: 'Scripts', path: '/scripts' },
    { icon: Video, label: 'Videos', path: '/videos' },
    { icon: Users, label: 'Community', path: '/community' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <nav 
      className="fixed bottom-0 inset-x-0 bg-white dark:bg-black border-t border-border z-50 md:hidden safe-area-pb"
    >
      <div className="flex justify-around items-center h-20 px-4">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path;

          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 min-w-[60px] transition-colors touch-manipulation",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}
              aria-label={label}
            >
              <Icon 
                className={cn(
                  "w-6 h-6 transition-transform",
                  isActive && "scale-110"
                )} 
                strokeWidth={isActive ? 2.5 : 2} 
              />
              <span className={cn(
                "text-[10px] font-medium",
                isActive && "font-semibold"
              )}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
