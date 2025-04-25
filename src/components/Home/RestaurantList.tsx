
import React, { useEffect, useState } from 'react';
import { Restaurant } from '@/components/Restaurant/RestaurantCard';
import RestaurantCard from '@/components/Restaurant/RestaurantCard';
import { MapPin, WifiOff, RefreshCcw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRestaurantData } from '@/hooks/useRestaurantData';
import { Skeleton } from '@/components/ui/skeleton';

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
  const [displayedRestaurants, setDisplayedRestaurants] = useState<Restaurant[]>([]);
  const [showSkeletons, setShowSkeletons] = useState(true);
  const { restaurantData: sampleRestaurant } = useRestaurantData();
  
  useEffect(() => {
    console.log("RestaurantList - Valore restaurant:", restaurants);
  }, [restaurants]);
  
  // Effetto per gestire lo stato di caricamento iniziale
  useEffect(() => {
    // Prima fase: recuperiamo ristoranti dalla cache locale per visualizzazione immediata
    try {
      const cachedData = localStorage.getItem('cachedRestaurants');
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        if (parsedData && Array.isArray(parsedData) && parsedData.length > 0) {
          console.log("Caricamento iniziale dai dati in cache", parsedData.length, "ristoranti");
          setDisplayedRestaurants(parsedData);
          setShowSkeletons(false);
        }
      }
    } catch (e) {
      console.error("Errore nel caricamento dati dalla cache:", e);
    }
    
    // Imposta un timeout per mostrare almeno gli skeleton per un tempo minimo
    const minLoadingTimeout = setTimeout(() => {
      setShowSkeletons(false);
    }, 500);
    
    return () => clearTimeout(minLoadingTimeout);
  }, []);
  
  // Aggiorna i ristoranti visualizzati quando cambiano i dati dai props
  useEffect(() => {
    if (restaurants && restaurants.length > 0) {
      console.log("Aggiornamento lista con", restaurants.length, "ristoranti dal backend");
      setDisplayedRestaurants(restaurants);
      setShowSkeletons(false);
    } else if (!isLoading && displayedRestaurants.length === 0) {
      // Se non ci sono ristoranti dai props e non stiamo caricando, usa il ristorante esempio
      if (sampleRestaurant) {
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
        
        console.log("Nessun ristorante dal backend, uso ristorante di esempio");
        setDisplayedRestaurants([sampleAsRestaurant]);
      }
    }
  }, [restaurants, isLoading, sampleRestaurant]);

  // Renderizza skeleton loaders durante il caricamento iniziale
  if ((isLoading && displayedRestaurants.length === 0) || showSkeletons) {
    return (
      <div className="space-y-4 animate-in fade-in duration-300">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-lg overflow-hidden border border-gray-200 bg-white">
            <div className="h-48 bg-gray-200 animate-pulse"></div>
            <div className="p-4 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>
          </div>
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

  if (displayedRestaurants && displayedRestaurants.length === 0) {
    // Aggiungiamo un ristorante di fallback se non ci sono ristoranti da mostrare
    const fallbackRestaurant: Restaurant = {
      id: '1',
      name: 'Trattoria Keccabio',
      image: '/placeholder.svg',
      rating: 4.7,
      reviews: 128,
      cuisine: 'Campana Gluten Free',
      description: 'Ristorante 100% gluten free specializzato in cucina campana tradizionale.',
      address: 'Via Toledo 42, Napoli, 80132',
      hasGlutenFreeOptions: true,
      isFavorite: false,
      location: { lat: 40.8388, lng: 14.2488 }
    };
    
    return (
      <div className="grid grid-cols-1 gap-4 animate-in fade-in duration-300">
        <RestaurantCard 
          key={fallbackRestaurant.id} 
          restaurant={fallbackRestaurant} 
          onToggleFavorite={onToggleFavorite}
        />
      </div>
    );
  }

  // Mostra sempre i ristoranti, anche durante il caricamento (abbiamo già i dati dalla cache)
  return (
    <div className="grid grid-cols-1 gap-4 animate-in fade-in duration-300">
      {displayedRestaurants.map(restaurant => (
        <RestaurantCard 
          key={restaurant.id} 
          restaurant={restaurant} 
          onToggleFavorite={onToggleFavorite}
        />
      ))}
      
      {isLoading && displayedRestaurants.length > 0 && (
        <div className="p-3 text-center text-sm text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
          Caricamento altri ristoranti...
        </div>
      )}
    </div>
  );
};

export default RestaurantList;
