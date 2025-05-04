
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Restaurant } from '@/components/Restaurant/RestaurantCard';
import RestaurantCard from '@/components/Restaurant/RestaurantCard';
import { RegionStatus } from '@/hooks/useRestaurantList';
import { Skeleton } from '@/components/ui/skeleton';

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

  if (restaurants.length === 0) {
    return (
      <div className="text-center p-8 border border-gray-200 rounded-lg">
        <X className="mx-auto h-12 w-12 text-gray-400 mb-3" />
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Nessun ristorante trovato</h3>
        <p className="text-gray-500 mb-4">Non ci sono ristoranti disponibili al momento.</p>
        <Button onClick={onRetry}>Riprova</Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
      {restaurants.map(restaurant => (
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
