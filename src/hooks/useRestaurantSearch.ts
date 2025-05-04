
import { useState } from 'react';
import { Restaurant } from '@/types/restaurant';
import { toast } from 'sonner';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { sampleRestaurant } from '@/data/sampleRestaurant';

export const useRestaurantSearch = (
  ensureSampleRestaurantPresent: (restaurants: Restaurant[]) => Restaurant[],
  getOfflineRestaurants: () => Restaurant[],
  setRestaurants: (restaurants: Restaurant[]) => void,
  isOffline: boolean,
  setIsLoading: (isLoading: boolean) => void
) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isOffline) {
      const cachedRestaurants = getOfflineRestaurants();
      const normalizedSearchTerm = searchTerm.toLowerCase().trim();
      
      if (!normalizedSearchTerm) {
        setRestaurants(ensureSampleRestaurantPresent(cachedRestaurants));
        return;
      }
      
      let filtered = cachedRestaurants.filter((restaurant: Restaurant) => 
        restaurant.name.toLowerCase().includes(normalizedSearchTerm) || 
        restaurant.description?.toLowerCase().includes(normalizedSearchTerm) ||
        restaurant.address?.toLowerCase().includes(normalizedSearchTerm)
      );
      
      // If no results, still add the sample restaurant if it matches
      if (filtered.length === 0 || !filtered.some(r => r.id === sampleRestaurant.id)) {
        if (sampleRestaurant.name.toLowerCase().includes(normalizedSearchTerm) ||
            sampleRestaurant.description?.toLowerCase().includes(normalizedSearchTerm) ||
            sampleRestaurant.address?.toLowerCase().includes(normalizedSearchTerm)) {
          filtered = [sampleRestaurant, ...filtered];
        }
      } else {
        // Ensure sample restaurant is in first position
        filtered = ensureSampleRestaurantPresent(filtered);
      }
      
      setRestaurants(filtered);
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (!searchTerm.trim()) {
        // This is assuming fetchRestaurants exists in the parent component and can be called here
        await fetchRestaurants();
        return;
      }
      
      const normalizedSearchTerm = searchTerm.toLowerCase().trim();
      const restaurantsCollection = collection(db, "restaurants");
      const restaurantsSnapshot = await getDocs(restaurantsCollection);
      
      let filteredRestaurants = restaurantsSnapshot.docs
        .map(doc => {
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
            hasGlutenFreeOptions: data.hasGlutenFreeOptions || false
          } as Restaurant;
        })
        .filter(restaurant => 
          restaurant.name.toLowerCase().includes(normalizedSearchTerm) || 
          restaurant.description?.toLowerCase().includes(normalizedSearchTerm) ||
          restaurant.address?.toLowerCase().includes(normalizedSearchTerm)
        );
      
      // Add sample restaurant if it matches search
      if (sampleRestaurant.name.toLowerCase().includes(normalizedSearchTerm) ||
          sampleRestaurant.description?.toLowerCase().includes(normalizedSearchTerm) ||
          sampleRestaurant.address?.toLowerCase().includes(normalizedSearchTerm)) {
        filteredRestaurants = ensureSampleRestaurantPresent(filteredRestaurants);
      }
      
      setRestaurants(filteredRestaurants);
    } catch (error) {
      console.error("Error searching restaurants:", error);
      toast.error("An error occurred while searching");
      // In case of error, show at least the sample restaurant
      setRestaurants([sampleRestaurant]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    searchTerm, 
    setSearchTerm,
    handleSearch
  };
};
