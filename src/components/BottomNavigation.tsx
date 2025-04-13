import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Heart, Calendar, User } from 'lucide-react';
import { cn } from "@/lib/utils";

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  
  // Funzione per decidere se la barra è attiva
  const isActive = (path: string) => {
    // Risolve il problema con la pagina dei preferiti nascondendo la barra
    if (location.pathname.startsWith(path)) {
      return true;
    }
    return false;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16">
        <Link 
          to="/" 
          className={cn(
            "flex flex-col items-center justify-center text-sm flex-1 h-full", 
            isActive('/') ? "text-primary" : "text-gray-500"
          )}
        >
          <Home className="h-6 w-6 mb-1" />
          <span>Home</span>
        </Link>
        
        <Link 
          to="/search" 
          className={cn(
            "flex flex-col items-center justify-center text-sm flex-1 h-full", 
            isActive('/search') ? "text-primary" : "text-gray-500"
          )}
        >
          <Search className="h-6 w-6 mb-1" />
          <span>Ricerca</span>
        </Link>
        
        <Link 
          to="/favorites" 
          className={cn(
            "flex flex-col items-center justify-center text-sm flex-1 h-full", 
            isActive('/favorites') ? "text-primary" : "text-gray-500"
          )}
        >
          <Heart className="h-6 w-6 mb-1" />
          <span>Preferiti</span>
        </Link>
        
        <Link 
          to="/bookings" 
          className={cn(
            "flex flex-col items-center justify-center text-sm flex-1 h-full", 
            isActive('/bookings') ? "text-primary" : "text-gray-500"
          )}
        >
          <Calendar className="h-6 w-6 mb-1" />
          <span>Prenotazioni</span>
        </Link>
        
        <Link 
          to="/profile" 
          className={cn(
            "flex flex-col items-center justify-center text-sm flex-1 h-full", 
            isActive('/profile') ? "text-primary" : "text-gray-500"
          )}
        >
          <User className="h-6 w-6 mb-1" />
          <span>Profilo</span>
        </Link>
      </div>
    </div>
  );
};

export default BottomNavigation;