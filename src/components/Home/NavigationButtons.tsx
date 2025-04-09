
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface NavigationButtonsProps {
  isRegionAvailable: boolean;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({ isRegionAvailable }) => {
  return (
    <div className="flex flex-wrap gap-4 mt-8">
      <Button size="lg" asChild className="bg-blue-500 hover:bg-blue-600" disabled={!isRegionAvailable}>
        <Link to="/search">Trova Ristoranti</Link>
      </Button>
      <Button size="lg" variant="outline" asChild>
        <Link to="/videos">Scopri Ricette</Link>
      </Button>
      <Button size="lg" variant="secondary" asChild>
        <Link to="/dashboard">Gestione Tavoli</Link>
      </Button>
    </div>
  );
};

export default NavigationButtons;
