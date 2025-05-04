
import { useState, useCallback, useEffect } from 'react';
import { Restaurant } from '@/types/restaurant';
import { toast } from 'sonner';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { sampleRestaurant } from '@/data/sampleRestaurant';
import { useOfflineRestaurants } from './useOfflineRestaurants';

export const useRestaurantData = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([sampleRestaurant]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { isOffline, getOfflineRestaurants, saveRestaurantsToCache } = useOfflineRestaurants();

  // Ensure sample restaurant is always present
  const ensureSampleRestaurantPresent = useCallback((restaurantsList: Restaurant[]): Restaurant[] => {
    // Check if sample restaurant is present
    const hasSampleRestaurant = restaurantsList.some(r => r.id === sampleRestaurant.id);
    
    if (!hasSampleRestaurant) {
      // If not present, add it at the beginning
      console.log("Adding missing sample restaurant");
      return [sampleRestaurant, ...restaurantsList];
    }
    
    // If present but not in the first position, move it to the beginning
    const sampleIndex = restaurantsList.findIndex(r => r.id === sampleRestaurant.id);
    if (sampleIndex > 0) {
      console.log("Moving sample restaurant to first position");
      const sample = restaurantsList.splice(sampleIndex, 1)[0];
      return [sample, ...restaurantsList];
    }
    
    // Already in first position, no modification needed
    return restaurantsList;
  }, []);

  // Immediate effect to force sample restaurant update
  useEffect(() => {
    console.log("Checking for sample restaurant presence");
    setRestaurants(prev => ensureSampleRestaurantPresent(prev));
  }, [ensureSampleRestaurantPresent]);

  const fetchRestaurants = async () => {
    console.log("Restaurant loading started");
    
    // Make sure sample restaurant is always visible during loading
    setRestaurants(prev => ensureSampleRestaurantPresent(prev));
    
    if (isOffline) {
      const offlineRestaurants = getOfflineRestaurants();
      setRestaurants(ensureSampleRestaurantPresent(offlineRestaurants));
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      const restaurantsCollection = collection(db, "restaurants");
      
      console.log("Attempting to load restaurants from Firebase...");
      const restaurantsSnapshot = await getDocs(restaurantsCollection);
      console.log("Number of restaurants found in DB:", restaurantsSnapshot.docs.length);
      
      let restaurantsData: Restaurant[] = restaurantsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || 'Restaurant without name',
          image: data.coverImage || '/placeholder.svg',
          rating: data.rating || 0,
          reviews: data.reviews || 0,
          cuisine: data.cuisine || 'Italian',
          description: data.description || 'No description available',
          address: data.address || 'Address not available',
          hasGlutenFreeOptions: data.hasGlutenFreeOptions || false,
          location: data.location || { lat: 40.8518, lng: 14.2681 },
          isFavorite: false
        } as Restaurant;
      });
      
      // Always add sample restaurant and ensure it's at the beginning
      restaurantsData = ensureSampleRestaurantPresent(restaurantsData);
      console.log("Sample restaurant (Trattoria Keccabio) added to the top of results");
      
      saveRestaurantsToCache(restaurantsData);
      
      setRestaurants(restaurantsData);
      console.log("Restaurant list updated with", restaurantsData.length, "items");
    } catch (error) {
      console.error("Error retrieving restaurants:", error);
      
      // In case of error, make sure to include the sample restaurant
      setRestaurants([sampleRestaurant]);
      toast.info("Only using sample restaurant");
      
      if (navigator.onLine) {
        toast.error("There was an error loading restaurants");
      } else {
        toast.info("Using restaurant data from cache");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    restaurants,
    setRestaurants,
    isLoading,
    setIsLoading, // Explicitly return setIsLoading
    isOffline,
    fetchRestaurants,
    ensureSampleRestaurantPresent,
    getOfflineRestaurants,
    saveRestaurantsToCache
  };
};
