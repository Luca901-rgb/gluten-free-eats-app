
import React from 'react';
import { Home, Search, Calendar, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  hideNavigation?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, hideNavigation = false }) => {
  const location = useLocation();
  
  return (
    <div className="flex flex-col min-h-screen w-full bg-[#a3e0a8] overflow-hidden">
      <div className="flex-1 overflow-y-auto pb-16 w-full">
        {children}
      </div>
      
      {!hideNavigation && (
        <nav className="fixed bottom-0 w-full bg-green-500 h-16 flex justify-around items-center z-10">
          <Link
            to="/home"
            className="flex flex-col items-center text-white px-4"
          >
            <Home className="w-5 h-5 mb-1" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link
            to="/search"
            className="flex flex-col items-center text-white px-4"
          >
            <Search className="w-5 h-5 mb-1" />
            <span className="text-xs mt-1">Ricerca</span>
          </Link>
          <Link
            to="/bookings"
            className="flex flex-col items-center text-white px-4"
          >
            <Calendar className="w-5 h-5 mb-1" />
            <span className="text-xs mt-1">Prenotazioni</span>
          </Link>
          <Link
            to="/profile"
            className="flex flex-col items-center text-white px-4"
          >
            <User className="w-5 h-5 mb-1" />
            <span className="text-xs mt-1">Profilo</span>
          </Link>
        </nav>
      )}
    </div>
  );
};

export default Layout;
