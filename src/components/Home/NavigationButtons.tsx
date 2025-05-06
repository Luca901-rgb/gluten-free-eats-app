
import React from 'react';
import { MapPin, UtensilsCrossed, Wheat, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NavigationButtonsProps {
  isRegionAvailable: boolean;
}

const NavigationButtons = ({ isRegionAvailable }: NavigationButtonsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {isRegionAvailable && (
        <Link to="/search">
          <button className="w-full py-4 px-3 bg-white shadow-md rounded-lg flex flex-col items-center justify-center hover:bg-gray-50 transition-colors">
            <MapPin className="h-5 w-5 mb-1 text-green-600" />
            <span className="text-xs font-medium text-gray-700">Vicino a te</span>
          </button>
        </Link>
      )}
      
      <Link to="/restaurant/1">
        <button className="w-full py-4 px-3 bg-white shadow-md rounded-lg flex flex-col items-center justify-center hover:bg-gray-50 transition-colors">
          <Wheat className="h-5 w-5 mb-1 text-green-600" />
          <span className="text-xs font-medium text-gray-700">Keccabio</span>
        </button>
      </Link>
      
      <Link to="/search">
        <button className="w-full py-4 px-3 bg-white shadow-md rounded-lg flex flex-col items-center justify-center hover:bg-gray-50 transition-colors">
          <UtensilsCrossed className="h-5 w-5 mb-1 text-green-600" />
          <span className="text-xs font-medium text-gray-700">Tutte le categorie</span>
        </button>
      </Link>
      
      <Link to="/search">
        <button className="w-full py-4 px-3 bg-white shadow-md rounded-lg flex flex-col items-center justify-center hover:bg-gray-50 transition-colors">
          <Star className="h-5 w-5 mb-1 text-green-600" />
          <span className="text-xs font-medium text-gray-700">Più votati</span>
        </button>
      </Link>
    </div>
  );
};

export default NavigationButtons;
