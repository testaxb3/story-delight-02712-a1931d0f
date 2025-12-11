import { useNavigate, useLocation } from 'react-router-dom';
import { Home, FileText, Headphones, Gift, GraduationCap } from 'lucide-react';
import { ExpandableTabs } from '@/components/ui/expandable-tabs';
import { useHaptic } from '@/hooks/useHaptic';
import { useMemo } from 'react';

const NAV_ITEMS = [
  { title: "Home", icon: Home, path: "/" },
  { title: "Scripts", icon: FileText, path: "/scripts" },
  { title: "Listen", icon: Headphones, path: "/listen" },
  { title: "Bonuses", icon: Gift, path: "/bonuses" },
  { title: "Lessons", icon: GraduationCap, path: "/lessons" },
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
      className="fixed left-3 right-3 z-[100] lg:hidden pointer-events-auto"
      style={{ bottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <ExpandableTabs
        tabs={tabs}
        selected={selectedIndex}
        onChange={handleChange}
        className="justify-around"
        activeColor="text-primary"
      />
    </nav>
  );
}
