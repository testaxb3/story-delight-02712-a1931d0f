import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BookOpen, Video, Zap, User, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  isHome?: boolean;
  isAdd?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { icon: Home, path: '/', isHome: true },
  { icon: BookOpen, path: '/scripts' },
  { icon: Video, path: '/videos' },
  { icon: Zap, path: '/bonuses' },
  { icon: Plus, path: '/profile', isAdd: true },
];

export function BottomNavCalAI() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-6 left-6 right-6 z-50 md:hidden">
      <div className="bg-card/80 backdrop-blur-xl rounded-full px-4 py-3 shadow-2xl border border-white/5">
        <div className="flex justify-between items-center">
          {NAV_ITEMS.map(({ icon: Icon, path, isHome, isAdd }) => {
            const isActive = location.pathname === path;
            const shouldHighlight = isHome || isAdd;

            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={cn(
                  "flex items-center justify-center transition-all",
                  shouldHighlight 
                    ? "w-14 h-14 rounded-full bg-foreground text-background" 
                    : "w-12 h-12 text-muted-foreground hover:text-foreground",
                  isActive && !shouldHighlight && "text-foreground"
                )}
                aria-label={path}
              >
                <Icon className={cn(
                  shouldHighlight ? "w-6 h-6" : "w-6 h-6"
                )} />
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
