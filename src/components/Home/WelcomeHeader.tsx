
import React from 'react';
import { Wheat, Utensils } from 'lucide-react';

interface WelcomeHeaderProps {
  className?: string;
}

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ className }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center p-2 rounded-full bg-gradient-to-br from-green-dark via-green to-green-light shadow-md">
          <div className="relative">
            <Wheat size={20} className="text-white drop-shadow-[0_0_1px_rgba(0,0,0,0.8)]" strokeWidth={2.5} />
            <Utensils size={14} className="text-white drop-shadow-[0_0_1px_rgba(0,0,0,0.8)] absolute -bottom-1 -right-1" strokeWidth={2.5} />
          </div>
        </div>
        <h1 className="text-3xl font-poppins font-bold bg-gradient-to-r from-green-dark via-green to-green-light bg-clip-text text-transparent drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]" style={{
          WebkitTextStroke: '0.7px #000'
        }}>
          Gluten Free Eats
        </h1>
      </div>
      <p className="text-gray-700 font-medium drop-shadow-[0_0.5px_0.5px_rgba(255,255,255,0.8)]">Scopri i ristoranti gluten free vicino a te</p>
    </div>
  );
};

export default WelcomeHeader;
