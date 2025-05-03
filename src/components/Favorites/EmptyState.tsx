
import React from 'react';
import { Heart, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EmptyState: React.FC = () => {
  return (
    <div className="text-center py-10 text-gray-500">
      <Heart size={48} className="mx-auto opacity-20 mb-4" />
      <p className="text-lg">Non hai ancora aggiunto ristoranti ai preferiti</p>
      <p className="text-sm mt-2">Esplora i ristoranti e aggiungi quelli che ti piacciono ai preferiti</p>
      <Button 
        className="mt-6" 
        variant="outline"
        onClick={() => window.location.href = '/search'}
      >
        <Search size={16} className="mr-2" />
        Cerca ristoranti
      </Button>
    </div>
  );
};

export default EmptyState;
