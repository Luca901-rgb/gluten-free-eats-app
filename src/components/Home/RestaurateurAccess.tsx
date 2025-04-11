
import React from 'react';
import { Store, ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const RestaurateurAccess: React.FC = () => {
  return (
    <div className="bg-accent/10 p-4 rounded-lg border border-accent/20 shadow-md">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold flex items-center text-primary drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">
          <Store className="mr-2 h-5 w-5 text-primary drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]" strokeWidth={2.5} />
          Area Ristoratori
        </h3>
        <Button variant="outline" size="sm" asChild className="border-accent/30 bg-white/80 text-primary font-medium drop-shadow-md">
          <Link to="/restaurant-login">
            <ChefHat className="w-4 h-4 mr-1.5" />
            Accedi
          </Link>
        </Button>
      </div>
      <p className="text-sm text-gray-600 drop-shadow-[0_0.5px_0.5px_rgba(255,255,255,0.7)]">
        Gestisci il tuo ristorante: prenotazioni, menu, tavoli, recensioni e molto altro
      </p>
    </div>
  );
};

export default RestaurateurAccess;
