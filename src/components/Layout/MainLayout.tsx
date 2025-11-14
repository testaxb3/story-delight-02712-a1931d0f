import { ReactNode } from 'react';
import { TopBar } from '@/components/Navigation/TopBar';
import { BottomNav } from '@/components/Navigation/BottomNav';

interface MainLayoutProps {
  children: ReactNode;
  hideTopBar?: boolean;
  noPaddingTop?: boolean;
  fullWidth?: boolean;
  hideBottomNav?: boolean;
}

export function MainLayout({ children, hideTopBar = false, noPaddingTop = false, fullWidth = false, hideBottomNav = false }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background pb-20 pt-16 transition-colors duration-300">
      {!hideTopBar && <TopBar />}
      <main className={
        fullWidth
          ? ''
          : `container mx-auto px-4 sm:px-6 ${noPaddingTop ? 'pb-8' : 'py-8'} space-y-6`
      }>
        {children}
      </main>
      {!hideBottomNav && <BottomNav />}
    </div>
  );
}
