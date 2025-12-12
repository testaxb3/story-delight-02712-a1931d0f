import { ReactNode } from 'react';
import { BottomNavExpandable } from '@/components/Navigation/BottomNavExpandable';

interface MainLayoutProps {
  children: ReactNode;
  hideTopBar?: boolean;
  noPaddingTop?: boolean;
  fullWidth?: boolean;
  hideBottomNav?: boolean;
}

export function MainLayout({ children, hideTopBar = false, noPaddingTop = false, fullWidth = false, hideBottomNav = false }: MainLayoutProps) {
  return (
    <div className="min-h-screen w-full m-0 p-0">
      <main className="w-full min-h-screen">
        {children}
      </main>
      {!hideBottomNav && <BottomNavExpandable />}
    </div>
  );
}
