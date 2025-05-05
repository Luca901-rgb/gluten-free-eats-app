
import React from 'react';
import { Home, Search, Calendar, Heart, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  hideNavigation?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, hideNavigation = false }) => {
  const location = useLocation();
  
  return (
    <div className="flex flex-col min-h-screen w-full bg-green-light overflow-hidden">
      <header className="sticky top-0 z-10 flex items-center bg-green-default header-bg h-14 px-4">
        <div className="flex items-center gap-2">
          <img src="/lovable-uploads/cb016c24-7700-4927-b5e2-40af08e4b219.png" alt="Logo" className="h-8 w-8" />
          <span className="font-poppins font-bold text-lg text-white">
            GlutenFree Eats
          </span>
        </div>
      </header>
      
      <div className="flex-1 overflow-y-auto pb-16 w-full">
        {children}
      </div>
      
      {!hideNavigation && (
        <nav className="fixed bottom-0 w-full bg-green-default border-t h-16 flex justify-around items-center z-10 bottom-nav">
          <Link
            to="/home"
            className={`nav-button ${location.pathname === '/home' ? 'font-bold' : ''}`}
          >
            <Home size={24} />
            <span>Home</span>
          </Link>
          <Link
            to="/search"
            className={`nav-button ${location.pathname === '/search' ? 'font-bold' : ''}`}
          >
            <Search size={24} />
            <span>Ricerca</span>
          </Link>
          <Link
            to="/favorites"
            className={`nav-button ${location.pathname === '/favorites' ? 'font-bold' : ''}`}
          >
            <Heart size={24} />
            <span>Preferiti</span>
          </Link>
          <Link
            to="/bookings"
            className={`nav-button ${location.pathname === '/bookings' ? 'font-bold' : ''}`}
          >
            <Calendar size={24} />
            <span>Prenotazioni</span>
          </Link>
          <Link
            to="/profile"
            className={`nav-button ${location.pathname === '/profile' ? 'font-bold' : ''}`}
          >
            <User size={24} />
            <span>Profilo</span>
          </Link>
        </nav>
      )}
    </div>
  );
};

export default Layout;
