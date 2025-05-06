
import React from 'react';
import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NavigationButtonsProps {
  isRegionAvailable: boolean;
}

const NavigationButtons = ({ isRegionAvailable }: NavigationButtonsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {isRegionAvailable && (
        <Link to="/search">
          <button className="w-full py-4 px-3 bg-white shadow-md rounded-lg flex flex-col items-center justify-center hover:bg-gray-50 transition-colors">
            <img src="/lovable-uploads/c40a4cd3-13d0-4541-bf02-9f35cda8a4ce.png" alt="App Logo" className="h-6 w-6 mb-2" />
            <span className="text-sm font-medium text-gray-700">Vicino a te</span>
          </button>
        </Link>
      )}
    </div>
  );
};

export default NavigationButtons;
