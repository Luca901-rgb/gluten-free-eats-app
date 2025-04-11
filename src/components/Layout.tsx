
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
  { path: '/', icon: <Home size={24} strokeWidth={2.5} />, label: 'Home' },
  { path: '/search', icon: <Search size={24} strokeWidth={2.5} />, label: 'Ricerca' },
  { path: '/favorites', icon: <Heart size={24} strokeWidth={2.5} />, label: 'Preferiti' },
  { path: '/bookings', icon: <Calendar size={24} strokeWidth={2.5} />, label: 'Prenotazioni' },
  { path: '/profile', icon: <UserRound size={24} strokeWidth={2.5} />, label: 'Profilo' },
];

const Layout: React.FC<LayoutProps> = ({ children, hideNavigation = false }) => {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-green-white">
      <header className="sticky top-0 z-10 flex items-center justify-between bg-gradient-to-r from-green-dark/90 via-green/80 to-green-light/70 border-b h-16 px-4 backdrop-blur-sm">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center p-1.5 rounded-full bg-gradient-to-br from-green-dark via-green to-green-light shadow-md">
            <div className="relative">
              <Wheat size={16} className="text-white drop-shadow-[0_0_1px_rgba(0,0,0,0.8)]" strokeWidth={2.5} />
              <Utensils size={12} className="text-white drop-shadow-[0_0_1px_rgba(0,0,0,0.8)] absolute -bottom-1 -right-1" strokeWidth={2.5} />
            </div>
          </div>
          <span className="font-poppins font-bold text-lg text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
            GlutenFree Eats
          </span>
        </Link>
        
        <div className="flex gap-2">
          <Link to="/restaurant/1" className={buttonVariants({ 
            variant: "outline", 
            size: "sm", 
            className: "bg-white/80 border-green hover:bg-white text-primary font-medium drop-shadow-md" 
          })}>
            Vista Cliente
          </Link>
          <Link to="/restaurant-dashboard" className={buttonVariants({ 
            variant: "outline", 
            size: "sm", 
            className: "bg-white/80 border-green hover:bg-white text-primary font-medium drop-shadow-md" 
          })}>
            Ristoratore
          </Link>
          <Link to="/admin-dashboard" className={buttonVariants({ 
            variant: "outline", 
            size: "sm", 
            className: "bg-white/80 border-green hover:bg-white text-primary font-medium drop-shadow-md" 
          })}>
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
                "flex flex-col items-center justify-center p-1",
                location.pathname === item.path 
                  ? "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]" 
                  : "text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.7)]"
              )}
            >
              <div className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                {item.icon}
              </div>
              <span className="text-xs mt-1 font-bold text-white" style={{ 
                textShadow: '0px 1px 3px rgba(0,0,0,0.9), 0px 1px 2px rgba(0,0,0,0.8)',
                WebkitTextStroke: '0.5px rgba(0,0,0,0.8)'
              }}>
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
};

export default Layout;
