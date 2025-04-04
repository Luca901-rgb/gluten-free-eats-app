
import React, { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Search, Calendar, Star, User, Image, Video, MessageCircle, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  hideNavigation?: boolean;
}

const Layout = ({ children, hideNavigation = false }: LayoutProps) => {
  const location = useLocation();
  
  // Automatically hide bottom navigation on restaurant dashboard
  const isRestaurantDashboard = location.pathname.startsWith('/restaurant-dashboard');
  const shouldHideNavigation = hideNavigation || isRestaurantDashboard;

  // Determine if we should show restaurant navigation instead
  const showRestaurantNavigation = isRestaurantDashboard;
  
  // Add body style for mobile app appearance
  useEffect(() => {
    // Set body styles for mobile app look and feel
    document.body.style.overscrollBehavior = 'none';
    // Use type assertion for webkit properties
    (document.body.style as any)['-webkit-overflow-scrolling'] = 'touch';
    document.body.style.touchAction = 'manipulation';
    
    // Set meta viewport for better mobile experience
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
      viewportMeta.setAttribute('content', 
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
    }
    
    // iOS specific
    document.documentElement.style.setProperty('--sat', '100%');
    
    return () => {
      document.body.style.overscrollBehavior = '';
      // Clean up webkit property with type assertion
      (document.body.style as any)['-webkit-overflow-scrolling'] = '';
      document.body.style.touchAction = '';
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white py-4 px-4 shadow-sm z-10 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center mr-3">
            <span className="text-white font-bold text-sm">GF</span>
          </div>
          <h1 className="text-xl font-poppins font-semibold text-primary">Gluten Free Eats</h1>
        </div>
      </header>

      {/* Main Content with safe area padding for notches and home indicators */}
      <main className="flex-1 overflow-auto pb-20 pt-safe px-safe">
        {children}
      </main>

      {/* Regular User Bottom Navigation */}
      {!shouldHideNavigation && !showRestaurantNavigation && (
        <nav className="fixed bottom-0 w-full bg-white shadow-[0_0_15px_rgba(0,0,0,0.1)] z-10 pb-safe">
          <div className="grid grid-cols-5 items-center py-2">
            <NavLink 
              to="/" 
              end
              className={({ isActive }) => 
                cn("flex flex-col items-center p-2", 
                   isActive ? "text-accent" : "text-gray-500 hover:text-primary")
              }
            >
              <Home size={20} />
              <span className="text-xs mt-1 font-medium">Home</span>
            </NavLink>
            <NavLink 
              to="/search" 
              className={({ isActive }) => 
                cn("flex flex-col items-center p-2", 
                   isActive ? "text-accent" : "text-gray-500 hover:text-primary")
              }
            >
              <Search size={20} />
              <span className="text-xs mt-1 font-medium">Cerca</span>
            </NavLink>
            <NavLink 
              to="/bookings" 
              className={({ isActive }) => 
                cn("flex flex-col items-center p-2", 
                   isActive ? "text-accent" : "text-gray-500 hover:text-primary")
              }
            >
              <Calendar size={20} />
              <span className="text-xs mt-1 font-medium">Prenota</span>
            </NavLink>
            <NavLink 
              to="/favorites" 
              className={({ isActive }) => 
                cn("flex flex-col items-center p-2", 
                   isActive ? "text-accent" : "text-gray-500 hover:text-primary")
              }
            >
              <Star size={20} />
              <span className="text-xs mt-1 font-medium">Preferiti</span>
            </NavLink>
            <NavLink 
              to="/profile" 
              className={({ isActive }) => 
                cn("flex flex-col items-center p-2", 
                   isActive ? "text-accent" : "text-gray-500 hover:text-primary")
              }
            >
              <User size={20} />
              <span className="text-xs mt-1 font-medium">Profilo</span>
            </NavLink>
          </div>
        </nav>
      )}

      {/* Restaurant Owner Bottom Navigation */}
      {showRestaurantNavigation && (
        <nav className="fixed bottom-0 w-full bg-white shadow-[0_0_15px_rgba(0,0,0,0.1)] z-10 pb-safe">
          <div className="flex justify-around items-center py-2">
            <NavLink 
              to="/restaurant-dashboard" 
              end
              className={({ isActive }) => 
                cn("flex flex-col items-center p-2", 
                   isActive ? "text-accent" : "text-gray-500 hover:text-primary")
              }
            >
              <Home size={20} />
              <span className="text-xs mt-1 font-medium">Home</span>
            </NavLink>
            <NavLink 
              to="/restaurant-dashboard/gallery" 
              className={({ isActive }) => 
                cn("flex flex-col items-center p-2", 
                   isActive ? "text-accent" : "text-gray-500 hover:text-primary")
              }
            >
              <Image size={20} />
              <span className="text-xs mt-1 font-medium">Galleria</span>
            </NavLink>
            <NavLink 
              to="/restaurant-dashboard/videos" 
              className={({ isActive }) => 
                cn("flex flex-col items-center p-2", 
                   isActive ? "text-accent" : "text-gray-500 hover:text-primary")
              }
            >
              <Video size={20} />
              <span className="text-xs mt-1 font-medium">Video</span>
            </NavLink>
            <NavLink 
              to="/restaurant-dashboard/bookings" 
              className={({ isActive }) => 
                cn("flex flex-col items-center p-2", 
                   isActive ? "text-accent" : "text-gray-500 hover:text-primary")
              }
            >
              <Calendar size={20} />
              <span className="text-xs mt-1 font-medium">Prenotazioni</span>
            </NavLink>
            <NavLink 
              to="/restaurant-dashboard/reviews" 
              className={({ isActive }) => 
                cn("flex flex-col items-center p-2", 
                   isActive ? "text-accent" : "text-gray-500 hover:text-primary")
              }
            >
              <MessageCircle size={20} />
              <span className="text-xs mt-1 font-medium">Recensioni</span>
            </NavLink>
            <NavLink 
              to="/restaurant-dashboard/profile" 
              className={({ isActive }) => 
                cn("flex flex-col items-center p-2", 
                   isActive ? "text-accent" : "text-gray-500 hover:text-primary")
              }
            >
              <User size={20} />
              <span className="text-xs mt-1 font-medium">Profilo</span>
            </NavLink>
          </div>
        </nav>
      )}
    </div>
  );
};

export default Layout;
