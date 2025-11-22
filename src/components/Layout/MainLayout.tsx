import { ReactNode } from 'react';
import { TopBar } from '@/components/Navigation/TopBar';
import { BottomNav } from '@/components/Navigation/BottomNav';
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
    <div className={`min-h-screen transition-colors duration-300 m-0 p-0 ${!hideSideNav ? 'pb-20 md:pb-0 md:pl-20 lg:pl-24' : ''}`}>
      {!hideSideNav && <SideNav />}
      <main className="w-full m-0 p-0">
        {children}
      </main>
      {!hideBottomNav && <BottomNav />}
    </div>
  );
}
