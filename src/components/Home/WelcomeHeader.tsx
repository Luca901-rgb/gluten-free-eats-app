
import React from 'react';
import { Wheat, Utensils } from 'lucide-react';

interface WelcomeHeaderProps {
  className?: string;
}

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ className }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-primary/10 rounded-full">
          <Wheat size={20} className="text-primary" />
        </div>
        <h1 className="text-3xl font-poppins font-bold text-primary">Gluten Free Eats</h1>
      </div>
      <p className="text-gray-600">Scopri i ristoranti gluten free vicino a te</p>
    </div>
  );
};

export default WelcomeHeader;
