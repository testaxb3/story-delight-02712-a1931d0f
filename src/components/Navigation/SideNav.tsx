import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Home, FileText, Headphones, Gift, User, LucideIcon } from 'lucide-react';

interface NavItem {
  icon: LucideIcon;
  label: string;
  path: string;
}

const NAV_ITEMS: NavItem[] = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: FileText, label: 'Scripts', path: '/scripts' },
  { icon: Headphones, label: 'Listen', path: '/listen' },
  { icon: Gift, label: 'Bonuses', path: '/bonuses' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export function SideNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="hidden md:flex fixed left-0 top-0 bottom-0 z-40 w-20 lg:w-24 flex-col items-center py-8 bg-background border-r border-border">
      {/* Logo */}
      <div className="mb-8 text-2xl font-bold text-foreground">
        NEP
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 flex flex-col items-center gap-2 w-full px-2">
        {NAV_ITEMS.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path;

          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                "relative flex flex-col items-center justify-center gap-2 w-full py-4 rounded-2xl transition-all duration-200",
                isActive
                  ? "bg-muted"
                  : "hover:bg-muted/50"
              )}
              aria-label={label}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-foreground" />
              )}

              {/* Icon */}
              <div className={cn(
                "w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center transition-transform",
                isActive && "scale-110"
              )}>
                <Icon 
                  className={cn(
                    "w-6 h-6 lg:w-7 lg:h-7 transition-colors",
                    isActive ? "text-foreground" : "text-muted-foreground"
                  )} 
                />
              </div>

              {/* Label */}
              <span className={cn(
                "text-[10px] lg:text-[11px] font-medium tracking-tight transition-all duration-200 hidden lg:block",
                isActive
                  ? "text-foreground font-semibold"
                  : "text-muted-foreground"
              )}>
                {label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Bottom decoration */}
      <div className="mt-auto pt-4 border-t border-border w-full">
        <div className="text-center text-xs text-muted-foreground">
          v1.0
        </div>
      </div>
    </div>
  );
}
