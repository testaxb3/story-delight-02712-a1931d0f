import { Home, BookOpen, Video, User, Gift } from 'lucide-react';
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
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden transition-all px-3"
      style={{
        paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)',
      }}
    >
      {/* Telegram-style floating nav */}
      <div className="relative bg-background/95 backdrop-blur-2xl rounded-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-border/40 overflow-hidden">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent pointer-events-none" />
        
        <div className="relative flex items-center justify-around h-[62px] px-2">
          {navItems.map(({ icon: Icon, label, path }) => {
            const isActive = location.pathname === path;
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className="relative flex flex-col items-center justify-center gap-0.5 min-w-[62px] py-1.5 group"
                aria-label={label}
              >
                {/* Active background - Telegram style */}
                <div className={cn(
                  "absolute inset-0 -inset-x-1 rounded-[14px] transition-all duration-300 ease-out",
                  isActive 
                    ? "bg-primary/15 scale-100 opacity-100" 
                    : "bg-transparent scale-95 opacity-0 group-hover:opacity-50 group-hover:scale-100 group-active:scale-95"
                )}>
                  {/* Inner glow for active state */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-[14px] bg-gradient-to-b from-primary/10 to-transparent" />
                  )}
                </div>

                {/* Icon container */}
                <div className={cn(
                  "relative flex items-center justify-center w-[26px] h-[26px] transition-all duration-300 ease-out",
                  isActive ? "scale-100" : "scale-95 group-hover:scale-100 group-active:scale-90"
                )}>
                  <Icon className={cn(
                    "transition-all duration-300 ease-out",
                    isActive 
                      ? "w-[26px] h-[26px] text-primary stroke-[2.5]" 
                      : "w-[24px] h-[24px] text-muted-foreground stroke-[2] group-hover:text-foreground"
                  )} />
                </div>
                
                {/* Label */}
                <span className={cn(
                  "relative text-[10.5px] font-medium tracking-tight transition-all duration-300 ease-out",
                  isActive 
                    ? "text-primary font-semibold" 
                    : "text-muted-foreground group-hover:text-foreground"
                )}>
                  {label}
                </span>

                {/* Active indicator dot */}
                {isActive && (
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary animate-in fade-in zoom-in duration-300" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
