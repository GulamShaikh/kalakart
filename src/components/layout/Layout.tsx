import { ReactNode } from "react";
import { Header } from "./Header";
import { BottomNav } from "./BottomNav";
import { Footer } from "./Footer";

interface LayoutProps {
  children: ReactNode;
  hideNav?: boolean;
}

export function Layout({ children, hideNav }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background pattern-rangoli flex flex-col">
      <Header />
      <main className="flex-1 pb-safe md:pb-0">{children}</main>
      <Footer />
      {!hideNav && <BottomNav />}
    </div>
  );
}
