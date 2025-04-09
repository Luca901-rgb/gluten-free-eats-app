
import React from 'react';
import { Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const RestaurateurAccess: React.FC = () => {
  return (
    <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold flex items-center">
          <Store className="mr-2 h-4 w-4" />
          Accesso Ristoratori
        </h3>
        <Button variant="outline" size="sm" asChild>
          <Link to="/restaurant/1">
            Accedi al ristorante demo
          </Link>
        </Button>
      </div>
      <p className="text-sm text-gray-600">
        Visualizza tutte le funzionalità di gestione disponibili per i ristoranti
      </p>
    </div>
  );
};

export default RestaurateurAccess;
