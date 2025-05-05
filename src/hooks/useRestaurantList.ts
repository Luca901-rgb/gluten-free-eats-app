
import { useState, useEffect, useCallback } from 'react';
import { Restaurant } from '@/types/restaurant';
import { toast } from 'sonner';
import { sampleRestaurant } from '@/data/sampleRestaurant';
import { useGeolocationRestaurants } from './useGeolocationRestaurants';
import { useRegionVerification } from './useRegionVerification';
import { useRestaurantData } from './useRestaurantData';
import { useRestaurantSearch } from './useRestaurantSearch';
import { sortRestaurantsByDistance } from '@/utils/distanceCalculator';

// Export the RegionStatus type properly
export type { RegionStatus } from '@/types/restaurant';

export const useRestaurantList = () => {
  const { 
    restaurants, 
    setRestaurants, 
    isLoading, 
    setIsLoading,
    isOffline, 
    fetchRestaurants, 
    ensureSampleRestaurantPresent,
    getOfflineRestaurants,
    saveRestaurantsToCache
  } = useRestaurantData();
  
  const { regionStatus, verifyRegion } = useRegionVerification();
  const { userLocation, getUserLocation, addDistanceToRestaurants } = useGeolocationRestaurants();
  
  const { 
    searchTerm, 
    setSearchTerm, 
    handleSearch 
  } = useRestaurantSearch(
    ensureSampleRestaurantPresent,
    getOfflineRestaurants,
    setRestaurants,
    isOffline,
    setIsLoading,
    fetchRestaurants
  );

  // Load restaurants on app launch
  useEffect(() => {
    console.log("Loading restaurants at startup");
    
    // Load immediately without waiting for user interaction
    refreshRestaurants();
    
    // Set up periodic data refresh every 3 minutes if user stays on page
    const refreshInterval = setInterval(() => {
      if (navigator.onLine) {
        console.log("Periodic data update");
        refreshRestaurants();
      }
    }, 3 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, []);

  useEffect(() => {
    const initApp = async () => {
      await verifyRegion();
      
      if (navigator.onLine) {
        await fetchRestaurants();
      } else {
        const offlineData = getOfflineRestaurants();
        setRestaurants(offlineData.length > 0 ? ensureSampleRestaurantPresent(offlineData) : [sampleRestaurant]);
        setIsLoading(false);
      }
    };

    initApp();
  }, [verifyRegion, ensureSampleRestaurantPresent]);

  // Update distances when user location changes
  useEffect(() => {
    if (userLocation && restaurants.length > 0) {
      const restaurantsToUpdate = ensureSampleRestaurantPresent([...restaurants]);
      const restaurantsWithDistance = addDistanceToRestaurants(restaurantsToUpdate);
      const sortedRestaurants = sortRestaurantsByDistance(restaurantsWithDistance, userLocation);
      
      // Ensure sample restaurant is always in first position
      setRestaurants(ensureSampleRestaurantPresent(sortedRestaurants));
      
      // Salvare i ristoranti in cache con le distanze aggiornate
      if (navigator.onLine) {
        saveRestaurantsToCache(sortedRestaurants);
      }
    }
  }, [userLocation, addDistanceToRestaurants, ensureSampleRestaurantPresent]);

  const refreshRestaurants = useCallback(async () => {
    if (isOffline) {
      const offlineData = getOfflineRestaurants();
      setRestaurants(ensureSampleRestaurantPresent(offlineData));
      return;
    }
    
    try {
      setIsLoading(true);
      await fetchRestaurants();
      
      // Se abbiamo la posizione dell'utente, aggiorniamo le distanze
      if (userLocation) {
        const updatedWithLocation = addDistanceToRestaurants(restaurants);
        const sorted = sortRestaurantsByDistance(updatedWithLocation, userLocation);
        setRestaurants(ensureSampleRestaurantPresent(sorted));
      }
      
      // Save to cache after fetching
      saveRestaurantsToCache(restaurants);
    } catch (error) {
      console.error("Error refreshing restaurants:", error);
      toast.error("Errore nell'aggiornamento dei ristoranti");
    } finally {
      setIsLoading(false);
    }
  }, [
    isOffline, 
    userLocation, 
    restaurants,
    getOfflineRestaurants, 
    addDistanceToRestaurants, 
    saveRestaurantsToCache,
    ensureSampleRestaurantPresent,
    fetchRestaurants,
    setIsLoading
  ]);

  return {
    restaurants,
    searchTerm,
    setSearchTerm,
    isLoading,
    isOffline,
    regionStatus,
    userLocation,
    handleSearch,
    refreshRestaurants,
    retryRegionCheck: verifyRegion,
    getUserLocation,
    sortRestaurantsByDistance: () => {
      if (!userLocation) {
        toast.error("Posizione utente non disponibile");
        getUserLocation(); // Tenta di ottenere la posizione se non disponibile
        return;
      }
      
      setRestaurants(prevRestaurants => {
        const sorted = sortRestaurantsByDistance(prevRestaurants, userLocation);
        // Ensure sample restaurant is always in first position
        return ensureSampleRestaurantPresent(sorted);
      });
    }
  };
};
