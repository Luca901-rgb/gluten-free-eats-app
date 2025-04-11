
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Home, Search, Heart, Calendar, Wheat, Utensils, UserRound } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface LayoutProps {
  children: React.ReactNode;
  hideNavigation?: boolean;
}

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
    <div className="flex flex-col min-h-screen bg-green-white">
      <header className="sticky top-0 z-10 flex items-center justify-between bg-gradient-to-r from-green-dark/90 via-green/80 to-green-light/70 border-b h-16 px-4 backdrop-blur-sm">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center p-1.5 rounded-full bg-gradient-to-br from-green-dark via-green to-green-light shadow-sm">
            <div className="relative">
              <Wheat size={16} className="text-white" />
              <Utensils size={12} className="text-white absolute -bottom-1 -right-1" />
            </div>
          </div>
          <span className="font-poppins font-bold text-lg text-white">
            GlutenFree Eats
          </span>
        </Link>
        
        <div className="flex gap-2">
          <Link to="/restaurant/1" className={buttonVariants({ variant: "outline", size: "sm", className: "bg-white/80 border-green hover:bg-white" })}>
            Vista Cliente
          </Link>
          <Link to="/restaurant-dashboard" className={buttonVariants({ variant: "outline", size: "sm", className: "bg-white/80 border-green hover:bg-white" })}>
            Ristoratore
          </Link>
          <Link to="/admin-dashboard" className={buttonVariants({ variant: "outline", size: "sm", className: "bg-white/80 border-green hover:bg-white" })}>
            Admin
          </Link>
        </div>
      </header>
      
      <div className="flex-1 overflow-y-auto pb-16">
        {children}
      </div>
      
      {!hideNavigation && (
        <nav className="fixed bottom-0 w-full bg-gradient-to-r from-green-dark/90 via-green/80 to-green-light/70 border-t h-16 flex justify-around items-center z-10 backdrop-blur-sm">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center text-white/80 p-1",
                location.pathname === item.path && "text-white"
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
