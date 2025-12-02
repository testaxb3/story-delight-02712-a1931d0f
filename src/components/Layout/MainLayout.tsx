import { ReactNode } from 'react';
import { TopBar } from '@/components/Navigation/TopBar';
import { BottomNavExpandable } from '@/components/Navigation/BottomNavExpandable';
import { SideNav } from '@/components/Navigation/SideNav';

interface MainLayoutProps {
  children: ReactNode;
  hideTopBar?: boolean;
  noPaddingTop?: boolean;
  fullWidth?: boolean;
  hideBottomNav?: boolean;
  hideSideNav?: boolean;
}

export function MainLayout({ children, hideTopBar = false, noPaddingTop = false, fullWidth = false, hideBottomNav = false, hideSideNav = false }: MainLayoutProps) {
  return (
    <div className="min-h-screen w-full m-0 p-0">
      {!hideSideNav && <SideNav />}
      <main className="w-full h-full m-0 p-0">
        {children}
      </main>
      {!hideBottomNav && <BottomNavExpandable />}
    </div>
  );
}
