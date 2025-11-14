import { Home, BookOpen, Video, Target, User, Gift } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: BookOpen, label: 'Scripts', path: '/scripts' },
    { icon: Gift, label: 'Bônus', path: '/bonuses' },
    { icon: Video, label: 'Vídeos', path: '/videos' },
    { icon: User, label: 'Perfil', path: '/profile' },
  ];

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/98 backdrop-blur-xl border-t border-border/50 shadow-lg transition-all safe-area-bottom"
      style={{
        paddingBottom: 'calc(env(safe-area-inset-bottom) + 4px)',
      }}
    >
      <div
        className="flex items-center justify-around px-1"
        style={{ height: '72px', paddingTop: '6px' }}
      >
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="relative flex flex-col items-center justify-center gap-1 transition-all duration-200 touch-target min-w-[64px]"
              aria-label={label}
            >
              {/* Telegram-style active background */}
              <div className={cn(
                "relative flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-200",
                isActive 
                  ? "bg-primary/10 scale-100" 
                  : "scale-95 hover:scale-100 active:scale-90"
              )}>
                <Icon className={cn(
                  "w-7 h-7 transition-all duration-200",
                  isActive 
                    ? "text-primary stroke-[2.5]" 
                    : "text-muted-foreground stroke-[2]"
                )} />
              </div>
              
              {/* Label */}
              <span className={cn(
                "text-[11px] transition-all duration-200 font-medium",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground"
              )}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
