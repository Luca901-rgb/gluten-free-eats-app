
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Home, Search, Heart, Calendar, CameraIcon, ChefHat, UserRound } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface LayoutProps {
  children: React.ReactNode;
  hideNavigation?: boolean;
}

// Aggiungiamo il profilo alla navigazione
const navigationItems = [
  { path: '/', icon: <Home size={24} />, label: 'Home' },
  { path: '/search', icon: <Search size={24} />, label: 'Ricerca' },
  { path: '/favorites', icon: <Heart size={24} />, label: 'Preferiti' },
  { path: '/bookings', icon: <Calendar size={24} />, label: 'Prenotazioni' },
  { path: '/profile', icon: <UserRound size={24} />, label: 'Profilo' },
];

const Layout: React.FC<LayoutProps> = ({ children, hideNavigation = false }) => {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 flex items-center justify-between bg-white border-b h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <CameraIcon size={24} className="text-primary" />
          <span className="font-poppins font-bold text-lg">GlutenFree App</span>
        </Link>
        
        <div className="flex gap-2">
          <Link to="/restaurant/1" className={buttonVariants({ variant: "outline", size: "sm" })}>
            Vista Cliente
          </Link>
          <Link to="/restaurant-dashboard" className={buttonVariants({ variant: "outline", size: "sm" })}>
            Ristoratore
          </Link>
          <Link to="/admin-dashboard" className={buttonVariants({ variant: "outline", size: "sm" })}>
            Admin
          </Link>
        </div>
      </header>
      
      <div className="flex-1 overflow-y-auto pb-16">
        {children}
      </div>
      
      {!hideNavigation && (
        <nav className="fixed bottom-0 w-full bg-white border-t h-16 flex justify-around items-center z-10">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center text-gray-500 p-1",
                location.pathname === item.path && "text-primary"
              )}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
};

export default Layout;
