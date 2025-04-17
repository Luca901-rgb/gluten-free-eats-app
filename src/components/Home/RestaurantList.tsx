
import React, { useEffect, useState } from 'react';
import { Restaurant } from '@/components/Restaurant/RestaurantCard';
import RestaurantCard from '@/components/Restaurant/RestaurantCard';
import { MapPin, WifiOff, RefreshCcw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRestaurantData } from '@/hooks/useRestaurantData';

interface RestaurantListProps {
  restaurants: Restaurant[];
  isLoading: boolean;
  isOffline?: boolean;
  loadingError?: string | null;
  regionStatus: {
    checked: boolean;
    inRegion: boolean;
  };
  onToggleFavorite: (id: string) => void;
  onRetry?: () => void;
}

const RestaurantList: React.FC<RestaurantListProps> = ({ 
  restaurants, 
  isLoading, 
  isOffline,
  loadingError,
  regionStatus,
  onToggleFavorite,
  onRetry
}) => {
  // Aggiungi stato locale per gestire i ristoranti visualizzati
  const [displayedRestaurants, setDisplayedRestaurants] = useState<Restaurant[]>(restaurants);
  const { restaurantData: sampleRestaurant } = useRestaurantData();
  
  // Assicurati di avere sempre almeno il ristorante di esempio
  useEffect(() => {
    // Se non ci sono ristoranti o se stiamo caricando, aggiungi il ristorante di esempio
    if ((restaurants.length === 0 || isLoading) && sampleRestaurant) {
      // Se il ristorante di esempio non è già presente nei ristoranti visualizzati
      const sampleExists = displayedRestaurants.some(r => r.id === sampleRestaurant.id);
      
      if (!sampleExists) {
        const sampleAsRestaurant: Restaurant = {
          id: sampleRestaurant.id || '1',
          name: sampleRestaurant.name,
          image: sampleRestaurant.coverImage,
          rating: sampleRestaurant.rating,
          reviews: sampleRestaurant.totalReviews,
          cuisine: sampleRestaurant.cuisine || 'Campana Gluten Free',
          description: sampleRestaurant.description,
          address: sampleRestaurant.address,
          hasGlutenFreeOptions: true,
          isFavorite: false,
          location: sampleRestaurant.location
        };
        
        setDisplayedRestaurants([sampleAsRestaurant]);
      }
    } else {
      // Altrimenti, usa i ristoranti forniti
      setDisplayedRestaurants(restaurants);
    }
  }, [restaurants, isLoading, sampleRestaurant]);
  
  console.log("RestaurantList render state:", { 
    isLoading, 
    isOffline, 
    loadingError, 
    restaurants: restaurants.length,
    displayedRestaurants: displayedRestaurants.length
  });
  
  // Mostra sempre i ristoranti, anche se stiamo caricando (usa skeleton loader per il resto)
  if (isLoading && displayedRestaurants.length === 0) {
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

  if (loadingError && !isOffline && displayedRestaurants.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
        <AlertCircle className="mx-auto h-12 w-12 text-orange-500 mb-3" />
        <h3 className="text-lg font-medium text-gray-800 mb-1">Errore di caricamento</h3>
        <p className="text-gray-600 max-w-md mx-auto mb-4">
          {loadingError || "Si è verificato un errore durante il caricamento dei ristoranti."}
        </p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" className="flex items-center gap-2">
            <RefreshCcw size={16} />
            Riprova
          </Button>
        )}
      </div>
    );
  }

  if (isOffline && displayedRestaurants.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
        <WifiOff className="mx-auto h-12 w-12 text-gray-400 mb-3" />
        <h3 className="text-lg font-medium text-gray-800 mb-1">Sei offline</h3>
        <p className="text-gray-600 max-w-md mx-auto mb-4">
          Non è possibile caricare i ristoranti mentre sei offline.
          Controlla la tua connessione e riprova.
        </p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" className="flex items-center gap-2">
            <RefreshCcw size={16} />
            Riprova
          </Button>
        )}
      </div>
    );
  }

  if (!regionStatus.inRegion && regionStatus.checked && displayedRestaurants.length === 0) {
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

  // Mostra i ristoranti, anche se è vuoto (che non dovrebbe mai accadere grazie all'useEffect)
  return (
    <div className="grid grid-cols-1 gap-4">
      {displayedRestaurants.map(restaurant => (
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
