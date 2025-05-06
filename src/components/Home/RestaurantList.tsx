
import React from 'react';
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
  // We always show the sample restaurant, even during loading
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* The sample restaurant is always visible, even during loading */}
        <div className="animate-fade-in">
          <RestaurantCard
            restaurant={sampleRestaurant}
            onClick={() => window.location.href = `/restaurant/${sampleRestaurant.id}`}
            isHighlighted={true}
          />
        </div>
        
        {/* Loading skeletons for other restaurants */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {[...Array(3)].map((_, i) => (
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
      </div>
    );
  }

  // Always make sure Keccabio is the first restaurant
  let displayRestaurants = [sampleRestaurant];
  
  // Add other restaurants if they exist, excluding duplicates of the sample restaurant
  if (restaurants && restaurants.length > 0) {
    const otherRestaurants = restaurants.filter(r => r.id !== sampleRestaurant.id);
    displayRestaurants = [sampleRestaurant, ...otherRestaurants];
  }
  
  console.log("Display restaurants:", displayRestaurants);
  console.log("Restaurants length:", displayRestaurants.length);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* First show the highlighted sample restaurant */}
      <div className="mb-6">
        <RestaurantCard
          key={sampleRestaurant.id}
          restaurant={sampleRestaurant}
          onClick={() => window.location.href = `/restaurant/${sampleRestaurant.id}`}
          isHighlighted={true}
        />
      </div>
      
      {/* Then show the rest of the restaurants in a grid */}
      {displayRestaurants.length > 1 && (
        <>
          <h3 className="text-lg font-semibold text-gray-700">Altri ristoranti</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayRestaurants.slice(1).map(restaurant => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onClick={() => window.location.href = `/restaurant/${restaurant.id}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RestaurantList;
