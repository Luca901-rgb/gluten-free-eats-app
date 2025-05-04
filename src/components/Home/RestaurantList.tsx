
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Restaurant } from '@/types/restaurant';
import RestaurantCard from '@/components/Restaurant/RestaurantCard';
import { RegionStatus } from '@/hooks/useRestaurantList';
import { Skeleton } from '@/components/ui/skeleton';
import { sampleRestaurant } from '@/data/sampleRestaurant';

interface RestaurantListProps {
  restaurants: Restaurant[];
  isLoading: boolean;
  regionStatus: RegionStatus;
  onRetry: () => void;
}

const RestaurantList: React.FC<RestaurantListProps> = ({
  restaurants,
  isLoading,
  regionStatus,
  onRetry
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-48 w-full rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Se l'array è vuoto o undefined, mostra almeno il ristorante d'esempio
  const displayRestaurants = (restaurants?.length > 0) 
    ? restaurants 
    : [sampleRestaurant];

  // Verifica se il ristorante d'esempio è presente, se no aggiungilo
  if (!displayRestaurants.some(r => r.id === sampleRestaurant.id)) {
    displayRestaurants.unshift(sampleRestaurant);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
      {displayRestaurants.map(restaurant => (
        <RestaurantCard
          key={restaurant.id}
          restaurant={restaurant}
          onClick={() => window.location.href = `/restaurant/${restaurant.id}`}
        />
      ))}
    </div>
  );
};

export default RestaurantList;
