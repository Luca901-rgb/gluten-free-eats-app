
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Heart, Calendar, User } from 'lucide-react';
import { cn } from '../lib/utils';

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  
  // Funzione per decidere se un link è attivo
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // Pagine dove la navigazione NON deve essere mostrata
  const hideNavOn = ['/login', '/register', '/intro', '/onboarding'];
  
  // Verifica se la navigazione deve essere nascosta nella pagina attuale
  if (hideNavOn.some(path => location.pathname === path || location.pathname.startsWith(`${path}/`))) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50 h-16">
      <div className="flex justify-around items-center h-full max-w-md mx-auto">
        <Link 
          to="/" 
          className={cn(
            "flex flex-col items-center justify-center text-xs w-full h-full transition-colors",
            isActive('/') ? "text-primary" : "text-gray-500 dark:text-gray-400"
          )}
        >
          <Home className="h-5 w-5 mb-1" />
          <span>Home</span>
        </Link>
        
        <Link 
          to="/search" 
          className={cn(
            "flex flex-col items-center justify-center text-xs w-full h-full transition-colors",
            isActive('/search') ? "text-primary" : "text-gray-500 dark:text-gray-400"
          )}
        >
          <Search className="h-5 w-5 mb-1" />
          <span>Ricerca</span>
        </Link>
        
        <Link 
          to="/favorites" 
          className={cn(
            "flex flex-col items-center justify-center text-xs w-full h-full transition-colors",
            isActive('/favorites') ? "text-primary" : "text-gray-500 dark:text-gray-400"
          )}
        >
          <Heart className="h-5 w-5 mb-1" />
          <span>Preferiti</span>
        </Link>
        
        <Link 
          to="/bookings" 
          className={cn(
            "flex flex-col items-center justify-center text-xs w-full h-full transition-colors",
            isActive('/bookings') ? "text-primary" : "text-gray-500 dark:text-gray-400"
          )}
        >
          <Calendar className="h-5 w-5 mb-1" />
          <span>Prenotazioni</span>
        </Link>
        
        <Link 
          to="/profile" 
          className={cn(
            "flex flex-col items-center justify-center text-xs w-full h-full transition-colors",
            isActive('/profile') ? "text-primary" : "text-gray-500 dark:text-gray-400"
          )}
        >
          <User className="h-5 w-5 mb-1" />
          <span>Profilo</span>
        </Link>
      </div>
      <div className="h-safe-area-bottom bg-white dark:bg-gray-900"></div>
    </div>
  );
};

export default BottomNavigation;
