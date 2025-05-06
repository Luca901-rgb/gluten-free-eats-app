
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin, Store, Calendar, Star } from 'lucide-react';

const RestaurantNavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { 
      id: 'nearby', 
      label: 'Nelle vicinanze', 
      icon: <MapPin className="w-5 h-5" />, 
      path: '/restaurant-home'
    },
    { 
      id: 'restaurant', 
      label: 'Il mio ristorante', 
      icon: <Store className="w-5 h-5" />, 
      path: '/restaurant-dashboard'
    },
    { 
      id: 'bookings', 
      label: 'Prenotazioni', 
      icon: <Calendar className="w-5 h-5" />, 
      path: '/restaurant-dashboard?tab=bookings'
    },
    { 
      id: 'reviews', 
      label: 'Recensioni', 
      icon: <Star className="w-5 h-5" />, 
      path: '/restaurant-dashboard?tab=reviews'
    }
  ];

  const isActive = (path) => {
    if (path.includes('?')) {
      const basePath = path.split('?')[0];
      const param = path.split('?')[1];
      return location.pathname === basePath && location.search.includes(param);
    }
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 w-full bg-green-500 h-14 flex justify-around items-center z-10 shadow-lg">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => navigate(item.path)}
          className={`flex flex-col items-center text-white px-3 ${
            isActive(item.path) ? 'opacity-100' : 'opacity-80'
          }`}
        >
          {item.icon}
          <span className="text-[10px] mt-0.5">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default RestaurantNavBar;
