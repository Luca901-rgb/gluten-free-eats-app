
import React from 'react';

interface WelcomeHeaderProps {
  className?: string;
}

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ className }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <h1 className="text-3xl font-poppins font-bold text-primary">Gluten Free Eats</h1>
      <p className="text-gray-600">Scopri i ristoranti gluten free vicino a te</p>
    </div>
  );
};

export default WelcomeHeader;
