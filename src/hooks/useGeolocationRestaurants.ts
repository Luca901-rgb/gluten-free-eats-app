
import { useState, useCallback } from 'react';
import { Restaurant } from '@/types/restaurant';
import { toast } from 'sonner';
import { calculateDistance, formatDistance } from '@/utils/distanceCalculator';

export const useGeolocationRestaurants = () => {
  const [userLocation, setUserLocation] = useState<GeolocationCoordinates | null>(null);
  
  // Funzione per ottenere la posizione dell'utente
  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error("Il tuo browser non supporta la geolocalizzazione");
      return;
    }

    toast.info("Ricerca posizione in corso...");
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation(position.coords);
        toast.success("Posizione trovata! Ordinamento ristoranti per distanza");
      },
      (error) => {
        console.error("Errore nella geolocalizzazione:", error);
        
        if (error.code === 1) { // Permission denied
          toast.error("Accesso alla posizione negato");
        } else if (error.code === 2) { // Position unavailable
          toast.error("Impossibile determinare la posizione");
        } else if (error.code === 3) { // Timeout
          toast.error("Richiesta posizione scaduta");
        } else {
          toast.error("Errore nella geolocalizzazione");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  // Funzione per aggiungere distanza ai ristoranti
  const addDistanceToRestaurants = useCallback((restaurants: Restaurant[]): Restaurant[] => {
    if (!userLocation) return restaurants;
    
    return restaurants.map(restaurant => {
      if (restaurant.location && userLocation) {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          restaurant.location.lat,
          restaurant.location.lng
        );
        
        return {
          ...restaurant,
          distance: formatDistance(distance),
          distanceValue: distance
        };
      }
      return restaurant;
    });
  }, [userLocation]);
  
  return {
    userLocation,
    getUserLocation,
    addDistanceToRestaurants
  };
};
