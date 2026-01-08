import { ReactNode } from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';

interface LayoutProps {
  children: ReactNode;
  hideNav?: boolean;
}

export function Layout({ children, hideNav }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background pattern-rangoli">
      <Header />
      <main className="pb-safe md:pb-0">
        {children}
      </main>
      {!hideNav && <BottomNav />}
    </div>
  );
}
