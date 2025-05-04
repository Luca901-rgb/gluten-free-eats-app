
import React from 'react';
import { Search, Calendar, MapPin, UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NavigationButtonsProps {
  isRegionAvailable: boolean;
}

const NavigationButtons = ({ isRegionAvailable }: NavigationButtonsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Link to="/search">
        <button className="w-full py-4 px-3 bg-white shadow-md rounded-lg flex flex-col items-center justify-center hover:bg-gray-50 transition-colors">
          <Search className="h-6 w-6 text-primary mb-2" />
          <span className="text-sm font-medium text-gray-700">Cerca</span>
        </button>
      </Link>
      
      <Link to="/bookings">
        <button className="w-full py-4 px-3 bg-white shadow-md rounded-lg flex flex-col items-center justify-center hover:bg-gray-50 transition-colors">
          <Calendar className="h-6 w-6 text-primary mb-2" />
          <span className="text-sm font-medium text-gray-700">Prenotazioni</span>
        </button>
      </Link>
      
      {isRegionAvailable && (
        <Link to="/search">
          <button className="w-full py-4 px-3 bg-white shadow-md rounded-lg flex flex-col items-center justify-center hover:bg-gray-50 transition-colors">
            <MapPin className="h-6 w-6 text-primary mb-2" />
            <span className="text-sm font-medium text-gray-700">Vicino a te</span>
          </button>
        </Link>
      )}
      
      <Link to="/profile">
        <button className="w-full py-4 px-3 bg-white shadow-md rounded-lg flex flex-col items-center justify-center hover:bg-gray-50 transition-colors">
          <UserCircle className="h-6 w-6 text-primary mb-2" />
          <span className="text-sm font-medium text-gray-700">Profilo</span>
        </button>
      </Link>
    </div>
  );
};

export default NavigationButtons;
