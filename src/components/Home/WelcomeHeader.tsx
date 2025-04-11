
import React from 'react';
import { Wheat, Utensils } from 'lucide-react';

interface WelcomeHeaderProps {
  className?: string;
}

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ className }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center p-2 rounded-full bg-gradient-to-br from-green-dark via-green to-green-light shadow-sm">
          <div className="relative">
            <Wheat size={20} className="text-white" />
            <Utensils size={14} className="text-white absolute -bottom-1 -right-1" />
          </div>
        </div>
        <h1 className="text-3xl font-poppins font-bold bg-gradient-to-r from-green-dark via-green to-green-light bg-clip-text text-transparent">
          Gluten Free Eats
        </h1>
      </div>
      <p className="text-gray-600">Scopri i ristoranti gluten free vicino a te</p>
    </div>
  );
};

export default WelcomeHeader;
