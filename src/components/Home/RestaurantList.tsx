
import React from 'react';
import { Restaurant } from '@/components/Restaurant/RestaurantCard';
import RestaurantCard from '@/components/Restaurant/RestaurantCard';
import { MapPin } from 'lucide-react';

interface RestaurantListProps {
  restaurants: Restaurant[];
  isLoading: boolean;
  regionStatus: {
    checked: boolean;
    inRegion: boolean;
  };
  onToggleFavorite: (id: string) => void;
}

const RestaurantList: React.FC<RestaurantListProps> = ({ 
  restaurants, 
  isLoading, 
  regionStatus,
  onToggleFavorite 
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div 
            key={i} 
            className="h-48 bg-gray-200 animate-pulse rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (!regionStatus.inRegion) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
        <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-3" />
        <h3 className="text-lg font-medium text-gray-800 mb-1">Servizio disponibile solo in Campania</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Durante la fase pilota, il nostro servizio è disponibile esclusivamente nella regione Campania.
          Stiamo lavorando per espandere il servizio ad altre regioni presto.
        </p>
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nessun ristorante trovato</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {restaurants.map(restaurant => (
        <RestaurantCard 
          key={restaurant.id} 
          restaurant={restaurant} 
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
};

export default RestaurantList;
