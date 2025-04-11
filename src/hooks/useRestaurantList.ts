
import { useState, useEffect } from 'react';
import { Restaurant } from '@/components/Restaurant/RestaurantCard';
import { toast } from 'sonner';
import { checkUserRegion } from '@/utils/geolocation';

export interface RegionStatus {
  checked: boolean;
  inRegion: boolean;
  regionName?: string;
  error?: string;
}

export const useRestaurantList = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [regionStatus, setRegionStatus] = useState<RegionStatus>({
    checked: false,
    inRegion: false
  });

  useEffect(() => {
    // Welcome toast
    toast.info("Benvenuto nell'app Gluten Free Eats!");
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    // Check user region
    const verifyRegion = async () => {
      try {
        const result = await checkUserRegion();
        setRegionStatus({
          checked: true,
          inRegion: result.inRegion,
          regionName: result.regionName,
          error: result.error
        });

        if (result.inRegion) {
          toast.success(`Benvenuto! Il servizio è disponibile nella tua regione: ${result.regionName}`);
        } else if (result.error) {
          toast.error(result.error);
        } else {
          toast.warning("Il servizio è attualmente disponibile solo in Campania durante la fase pilota.");
        }
      } catch (error) {
        console.error("Errore durante la verifica della regione:", error);
        setRegionStatus({
          checked: true,
          inRegion: false,
          error: "Si è verificato un errore durante la verifica della tua posizione."
        });
        toast.error("Si è verificato un errore durante la verifica della tua posizione.");
      }
    };

    verifyRegion();

    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // With no sample data, we'd just call an API here
    // For now, just show empty results
    setRestaurants([]);
  };

  const handleToggleFavorite = (id: string) => {
    setRestaurants(restaurants.map(restaurant => 
      restaurant.id === id 
        ? { ...restaurant, isFavorite: !restaurant.isFavorite } 
        : restaurant
    ));
  };

  return {
    restaurants,
    searchTerm,
    setSearchTerm,
    isLoading,
    regionStatus,
    handleSearch,
    handleToggleFavorite
  };
};
