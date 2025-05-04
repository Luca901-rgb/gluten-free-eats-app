
import { useState, useEffect } from 'react';
import { Restaurant } from '@/types/restaurant';
import { sampleRestaurant } from '@/data/sampleRestaurant';
import safeStorage from '@/lib/safeStorage';

export const useOfflineRestaurants = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOffline(!navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  const getOfflineRestaurants = (): Restaurant[] => {
    const cachedRestaurants = safeStorage.getItem('cachedRestaurants');
    if (cachedRestaurants) {
      try {
        let parsedRestaurants = JSON.parse(cachedRestaurants);
        
        const hasSampleRestaurant = parsedRestaurants.some((r: Restaurant) => r.id === sampleRestaurant.id);
        if (!hasSampleRestaurant) {
          parsedRestaurants = [sampleRestaurant, ...parsedRestaurants];
        }
        
        console.log("Caricati", parsedRestaurants.length, "ristoranti dalla cache (incluso esempio)");
        return parsedRestaurants;
      } catch (e) {
        console.error("Errore nel parsing dei ristoranti dalla cache:", e);
        console.log("Caricato solo il ristorante di esempio");
        return [sampleRestaurant];
      }
    } else {
      console.log("Nessuna cache disponibile, caricato solo il ristorante di esempio");
      return [sampleRestaurant];
    }
  };

  const saveRestaurantsToCache = (restaurants: Restaurant[]): void => {
    try {
      safeStorage.setItem('cachedRestaurants', JSON.stringify(restaurants));
      console.log("Salvati", restaurants.length, "ristoranti in cache");
    } catch (e) {
      console.error("Errore nel salvataggio dei ristoranti in cache:", e);
    }
  };

  return {
    isOffline,
    getOfflineRestaurants,
    saveRestaurantsToCache
  };
};
