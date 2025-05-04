
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
    setIsLoading = useState(true)[1], 
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
    setIsLoading
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
    }
  }, [userLocation, addDistanceToRestaurants, ensureSampleRestaurantPresent]);

  const refreshRestaurants = useCallback(fetchRestaurants, [
    isOffline, 
    userLocation, 
    getOfflineRestaurants, 
    addDistanceToRestaurants, 
    saveRestaurantsToCache,
    ensureSampleRestaurantPresent
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
        toast.error("User location not available");
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
