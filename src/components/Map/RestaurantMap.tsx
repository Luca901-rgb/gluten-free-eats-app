
import React from 'react';
import { MapPin } from 'lucide-react';

// Define interfaces
interface Restaurant {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  address: string;
  distance: string;
}

interface RestaurantMapProps {
  userLocation: { lat: number; lng: number } | null;
  restaurants: Restaurant[];
}

export const RestaurantMap: React.FC<RestaurantMapProps> = ({ 
  userLocation, 
  restaurants 
}) => {
  // Mostriamo semplicemente una lista dei ristoranti invece della mappa
  return (
    <div className="h-full w-full bg-gray-100 flex flex-col p-4 rounded-lg overflow-auto">
      <h3 className="text-lg font-medium text-gray-900 mb-3">Ristoranti nelle vicinanze</h3>
      
      <div className="w-full space-y-3">
        {restaurants.map(restaurant => (
          <div key={restaurant.id} className="bg-white p-3 rounded-lg shadow-sm flex items-start gap-2">
            <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h5 className="font-medium">{restaurant.name}</h5>
              <p className="text-sm text-gray-600">{restaurant.address}</p>
              <p className="text-sm font-medium text-primary">{restaurant.distance}</p>
            </div>
          </div>
        ))}
      </div>
      
      {userLocation && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
          <p className="text-sm text-blue-700">
            <span className="font-medium">La tua posizione attuale:</span> 
            {' '}Lat: {userLocation.lat.toFixed(4)}, Lng: {userLocation.lng.toFixed(4)}
          </p>
        </div>
      )}
    </div>
  );
};
