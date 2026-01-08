import { Home, Search, ShoppingBag, Upload, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const location = useLocation();
  const { user } = useAuth();
  const { itemCount } = useCart();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/explore', icon: Search, label: 'Explore' },
    { path: '/orders', icon: ShoppingBag, label: 'Orders', badge: itemCount > 0 && user ? itemCount : undefined },
    ...(user?.role === 'artist' ? [{ path: '/artist/upload', icon: Upload, label: 'Upload' }] : []),
    { path: user ? '/profile' : '/login', icon: User, label: user ? 'Profile' : 'Login' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-elevated md:hidden">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map(({ path, icon: Icon, label, badge }) => (
          <Link
            key={path}
            to={path}
            className={cn(
              "flex flex-col items-center justify-center flex-1 py-2 px-1 relative transition-all duration-200",
              isActive(path) 
                ? "text-primary" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <div className="relative">
              <Icon className={cn(
                "w-5 h-5 transition-transform",
                isActive(path) && "scale-110"
              )} />
              {badge && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                  {badge > 9 ? '9+' : badge}
                </span>
              )}
            </div>
            <span className={cn(
              "text-[10px] mt-1 font-medium",
              isActive(path) && "font-semibold"
            )}>
              {label}
            </span>
            {isActive(path) && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
}
