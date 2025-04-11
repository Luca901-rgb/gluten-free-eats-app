
import { useState, useEffect } from 'react';
import { Restaurant } from '@/components/Restaurant/RestaurantCard';
import { toast } from 'sonner';
import { checkUserRegion } from '@/utils/geolocation';
import { collection, getDocs, query, where, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';

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
          fetchRestaurants(); // Fetch restaurants only if in supported region
        } else if (result.error) {
          toast.error(result.error);
          setIsLoading(false);
        } else {
          toast.warning("Il servizio è attualmente disponibile solo in Campania durante la fase pilota.");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Errore durante la verifica della regione:", error);
        setRegionStatus({
          checked: true,
          inRegion: false,
          error: "Si è verificato un errore durante la verifica della tua posizione."
        });
        toast.error("Si è verificato un errore durante la verifica della tua posizione.");
        setIsLoading(false);
      }
    };

    verifyRegion();

    return () => {
      // Cleanup if needed
    };
  }, []);

  const fetchRestaurants = async () => {
    try {
      const restaurantsCollection = collection(db, "restaurants");
      const restaurantsSnapshot = await getDocs(restaurantsCollection);
      
      // Get user favorites to mark restaurants
      let userFavorites: string[] = [];
      const currentUser = auth.currentUser;
      
      if (currentUser) {
        try {
          const userFavoritesDoc = await getDoc(doc(db, "userFavorites", currentUser.uid));
          if (userFavoritesDoc.exists()) {
            userFavorites = userFavoritesDoc.data().restaurantIds || [];
          }
        } catch (error) {
          console.error("Error fetching user favorites:", error);
        }
      }
      
      const restaurantsData = restaurantsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || 'Ristorante senza nome',
          description: data.description || 'Nessuna descrizione disponibile',
          address: data.address || 'Indirizzo non disponibile',
          image: data.coverImage || '/placeholder.svg',
          rating: data.rating || 0,
          reviews: data.reviews || 0,
          hasGlutenFreeOptions: data.hasGlutenFreeOptions || false,
          isFavorite: userFavorites.includes(doc.id),
          cuisine: data.cuisine || 'Italiana' // Adding cuisine with default value
        } as Restaurant;
      });
      
      setRestaurants(restaurantsData);
    } catch (error) {
      console.error("Errore durante il recupero dei ristoranti:", error);
      toast.error("Si è verificato un errore nel caricamento dei ristoranti");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (!searchTerm.trim()) {
        // If search term is empty, fetch all restaurants
        await fetchRestaurants();
        return;
      }
      
      const normalizedSearchTerm = searchTerm.toLowerCase().trim();
      const restaurantsCollection = collection(db, "restaurants");
      const restaurantsSnapshot = await getDocs(restaurantsCollection);
      
      // Get user favorites to mark restaurants
      let userFavorites: string[] = [];
      const currentUser = auth.currentUser;
      
      if (currentUser) {
        try {
          const userFavoritesDoc = await getDoc(doc(db, "userFavorites", currentUser.uid));
          if (userFavoritesDoc.exists()) {
            userFavorites = userFavoritesDoc.data().restaurantIds || [];
          }
        } catch (error) {
          console.error("Error fetching user favorites:", error);
        }
      }
      
      // Client-side filtering (in a real app, this would be a Firestore query)
      const filteredRestaurants = restaurantsSnapshot.docs
        .map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || 'Ristorante senza nome',
            description: data.description || 'Nessuna descrizione disponibile',
            address: data.address || 'Indirizzo non disponibile',
            image: data.coverImage || '/placeholder.svg',
            rating: data.rating || 0,
            reviews: data.reviews || 0,
            hasGlutenFreeOptions: data.hasGlutenFreeOptions || false,
            isFavorite: userFavorites.includes(doc.id),
            cuisine: data.cuisine || 'Italiana' // Adding cuisine with default value
          } as Restaurant;
        })
        .filter(restaurant => 
          restaurant.name.toLowerCase().includes(normalizedSearchTerm) || 
          (restaurant.description && restaurant.description.toLowerCase().includes(normalizedSearchTerm)) ||
          (restaurant.address && restaurant.address.toLowerCase().includes(normalizedSearchTerm))
        );
      
      setRestaurants(filteredRestaurants);
    } catch (error) {
      console.error("Error searching restaurants:", error);
      toast.error("Si è verificato un errore durante la ricerca");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFavorite = async (id: string) => {
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      toast.error("Devi effettuare l'accesso per aggiungere ristoranti ai preferiti");
      return;
    }
    
    try {
      const userFavoritesRef = doc(db, "userFavorites", currentUser.uid);
      const userFavoritesDoc = await getDoc(userFavoritesRef);
      
      let userFavorites: string[] = [];
      if (userFavoritesDoc.exists()) {
        userFavorites = userFavoritesDoc.data().restaurantIds || [];
      }
      
      // Toggle favorite status
      const isFavorite = userFavorites.includes(id);
      let updatedFavorites: string[];
      
      if (isFavorite) {
        updatedFavorites = userFavorites.filter(restaurantId => restaurantId !== id);
        toast.success("Ristorante rimosso dai preferiti");
      } else {
        updatedFavorites = [...userFavorites, id];
        toast.success("Ristorante aggiunto ai preferiti");
      }
      
      // Update Firestore
      await setDoc(userFavoritesRef, { restaurantIds: updatedFavorites }, { merge: true });
      
      // Update local state
      setRestaurants(prevRestaurants => 
        prevRestaurants.map(restaurant => 
          restaurant.id === id 
            ? { ...restaurant, isFavorite: !isFavorite } 
            : restaurant
        )
      );
    } catch (error) {
      console.error("Errore durante l'aggiornamento dei preferiti:", error);
      toast.error("Si è verificato un errore durante l'aggiornamento dei preferiti");
    }
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
