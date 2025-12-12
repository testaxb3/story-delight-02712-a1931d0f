import { ReactNode } from 'react';
import { TopBar } from '@/components/Navigation/TopBar';
import { BottomNavExpandable } from '@/components/Navigation/BottomNavExpandable';
import { SideNav } from '@/components/Navigation/SideNav';
import { cn } from '@/lib/utils';

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
      <main className={cn(
        "w-full min-h-screen",
        !hideSideNav && "md:ml-20 lg:ml-24"
      )}>
        {children}
      </main>
      {!hideBottomNav && <BottomNavExpandable />}
    </div>
  );
}
