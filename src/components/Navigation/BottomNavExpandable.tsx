import { useNavigate, useLocation } from 'react-router-dom';
import { Home, FileText, Headphones, Gift } from 'lucide-react';
import { ExpandableTabs } from '@/components/ui/expandable-tabs';
import { useHaptic } from '@/hooks/useHaptic';
import { useMemo } from 'react';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { title: "Home", icon: Home, path: "/" },
  { title: "Scripts", icon: FileText, path: "/scripts" },
  { title: "Listen", icon: Headphones, path: "/listen" },
  { title: "Bonuses", icon: Gift, path: "/bonuses" },
];

export function BottomNavExpandable() {
  const navigate = useNavigate();
  const location = useLocation();
  const { triggerHaptic } = useHaptic();

  const selectedIndex = useMemo(() => {
    // Check for exact match first
    const exactIndex = NAV_ITEMS.findIndex(item => item.path === location.pathname);
    if (exactIndex >= 0) return exactIndex;

    // Check for sub-route matches (e.g. /listen/series should highlight Listen)
    const subRouteIndex = NAV_ITEMS.findIndex(item =>
      item.path !== '/' && location.pathname.startsWith(item.path)
    );
    return subRouteIndex >= 0 ? subRouteIndex : null;
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
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        delay: 0.1,
        type: 'spring',
        stiffness: 300,
        damping: 25
      }}
      className="fixed left-4 right-4 z-[100] pointer-events-auto md:hidden"
      style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 8px)' }}
    >
      {/* Glow effect behind nav */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#FF6631]/5 via-transparent to-[#FFA300]/5 rounded-full blur-xl" />

      <ExpandableTabs
        tabs={tabs}
        selected={selectedIndex}
        onChange={handleChange}
        className="justify-around"
      />
    </motion.nav>
  );
}
