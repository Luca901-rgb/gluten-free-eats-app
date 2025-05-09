
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Calendar, User } from 'lucide-react';

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
        <nav className="fixed bottom-0 w-full bg-green-500 h-14 flex justify-around items-center z-10 shadow-lg">
          <Link
            to="/home"
            className={`flex flex-col items-center text-white px-3 ${location.pathname === '/' || location.pathname === '/home' ? 'opacity-100' : 'opacity-80'}`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Home</span>
          </Link>
          <Link
            to="/search"
            className={`flex flex-col items-center text-white px-3 ${location.pathname === '/search' ? 'opacity-100' : 'opacity-80'}`}
          >
            <Search className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Ricerca</span>
          </Link>
          <Link
            to="/bookings"
            className={`flex flex-col items-center text-white px-3 ${location.pathname === '/bookings' ? 'opacity-100' : 'opacity-80'}`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Prenotazioni</span>
          </Link>
          <Link
            to="/profile"
            className={`flex flex-col items-center text-white px-3 ${location.pathname === '/profile' ? 'opacity-100' : 'opacity-80'}`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Profilo</span>
          </Link>
        </nav>
      )}
    </div>
  );
};

export default Layout;
