import { ReactNode } from 'react';
import { TopBar } from '@/components/Navigation/TopBar';
import { BottomNav } from '@/components/Navigation/BottomNav';

interface MainLayoutProps {
  children: ReactNode;
  hideTopBar?: boolean;
  noPaddingTop?: boolean;
  fullWidth?: boolean;
}

export function MainLayout({ children, hideTopBar = false, noPaddingTop = false, fullWidth = false }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background pb-16 pt-16">
      {!hideTopBar && <TopBar />}
      <main className={
        fullWidth
          ? ''
          : `container mx-auto px-4 ${noPaddingTop ? 'pb-6' : 'py-6'}`
      }>
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
