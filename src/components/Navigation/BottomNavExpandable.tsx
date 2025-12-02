import { useNavigate, useLocation } from 'react-router-dom';
import { Home, FileText, Headphones, Gift, User } from 'lucide-react';
import { ExpandableTabs } from '@/components/ui/expandable-tabs';
import { useHaptic } from '@/hooks/useHaptic';
import { useMemo } from 'react';

const NAV_ITEMS = [
  { title: "Home", icon: Home, path: "/" },
  { title: "Scripts", icon: FileText, path: "/scripts" },
  { title: "Listen", icon: Headphones, path: "/listen" },
  { title: "Bonuses", icon: Gift, path: "/bonuses" },
  { title: "Profile", icon: User, path: "/profile" },
];

export function BottomNavExpandable() {
  const navigate = useNavigate();
  const location = useLocation();
  const { triggerHaptic } = useHaptic();

  const selectedIndex = useMemo(() => {
    const index = NAV_ITEMS.findIndex(item => item.path === location.pathname);
    return index >= 0 ? index : null;
  }, [location.pathname]);

  const tabs = NAV_ITEMS.map(item => ({
    title: item.title,
    icon: item.icon,
  }));

  const handleChange = (index: number | null) => {
    if (index !== null && index !== selectedIndex) {
      triggerHaptic('medium');
      navigate(NAV_ITEMS[index].path);
    }
  };

  return (
    <nav 
      className="fixed left-4 right-4 z-[100] md:hidden pointer-events-auto"
      style={{ bottom: `calc(env(safe-area-inset-bottom, 0px) + 0.5rem)` }}
    >
      <ExpandableTabs
        tabs={tabs}
        selected={selectedIndex}
        onChange={handleChange}
        className="bg-card/80 backdrop-blur-xl border-border shadow-2xl justify-center"
        activeColor="text-primary"
      />
    </nav>
  );
}
