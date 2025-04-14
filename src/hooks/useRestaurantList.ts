import { useState, useEffect, useCallback } from 'react';
import { Restaurant } from '@/components/Restaurant/RestaurantCard';
import { toast } from 'sonner';
import { checkUserRegion } from '@/utils/geolocation';
import { collection, getDocs, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
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
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [regionStatus, setRegionStatus] = useState<RegionStatus>({
    checked: false,
    inRegion: false
  });

  const verifyRegion = useCallback(async () => {
    try {
      const result = await checkUserRegion();
      setRegionStatus({
        checked: true,
        inRegion: true,
        regionName: result.regionName,
        error: null
      });
      return true;
    } catch (error) {
      console.error("Errore durante la verifica della regione:", error);
      setRegionStatus({
        checked: true,
        inRegion: true,
        error: null
      });
      return true;
    }
  }, []);

  useEffect(() => {
    const handleOnlineStatus = () => {
      const online = navigator.onLine;
      setIsOffline(!online);
      
      if (online) {
        fetchRestaurants();
      }
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    const initApp = async () => {
      await verifyRegion();
      
      if (navigator.onLine) {
        await fetchRestaurants();
      } else {
        setIsLoading(false);
      }
    };

    initApp();

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, [verifyRegion]);

  const fetchRestaurants = async () => {
    if (isOffline) {
      const cachedRestaurants = localStorage.getItem('cachedRestaurants');
      if (cachedRestaurants) {
        try {
          setRestaurants(JSON.parse(cachedRestaurants));
        } catch (e) {
          console.error("Errore nel parsing dei ristoranti dalla cache:", e);
        }
      }
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      const restaurantsCollection = collection(db, "restaurants");
      const restaurantsSnapshot = await getDocs(restaurantsCollection);
      
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
          image: data.coverImage || '/placeholder.svg',
          rating: data.rating || 0,
          reviews: data.reviews || 0,
          cuisine: data.cuisine || 'Italiana',
          description: data.description || 'Nessuna descrizione disponibile',
          address: data.address || 'Indirizzo non disponibile',
          hasGlutenFreeOptions: data.hasGlutenFreeOptions || false,
          isFavorite: userFavorites.includes(doc.id)
        } as Restaurant;
      });
      
      localStorage.setItem('cachedRestaurants', JSON.stringify(restaurantsData));
      
      setRestaurants(restaurantsData);
    } catch (error) {
      console.error("Errore durante il recupero dei ristoranti:", error);
      
      const cachedRestaurants = localStorage.getItem('cachedRestaurants');
      if (cachedRestaurants) {
        try {
          setRestaurants(JSON.parse(cachedRestaurants));
          toast.info("Utilizzando dati ristoranti dalla cache");
        } catch (e) {
          console.error("Errore nel parsing dei ristoranti dalla cache:", e);
          toast.error("Impossibile caricare i ristoranti");
        }
      } else {
        toast.error("Si è verificato un errore nel caricamento dei ristoranti");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isOffline) {
      const cachedRestaurants = localStorage.getItem('cachedRestaurants');
      if (cachedRestaurants) {
        try {
          const restaurants = JSON.parse(cachedRestaurants);
          const normalizedSearchTerm = searchTerm.toLowerCase().trim();
          
          if (!normalizedSearchTerm) {
            setRestaurants(restaurants);
            return;
          }
          
          const filtered = restaurants.filter((restaurant: Restaurant) => 
            restaurant.name.toLowerCase().includes(normalizedSearchTerm) || 
            restaurant.description?.toLowerCase().includes(normalizedSearchTerm) ||
            restaurant.address?.toLowerCase().includes(normalizedSearchTerm)
          );
          
          setRestaurants(filtered);
        } catch (e) {
          console.error("Errore nel parsing dei ristoranti dalla cache:", e);
          toast.error("Impossibile cercare ristoranti mentre sei offline");
        }
      } else {
        toast.error("Non è possibile cercare ristoranti mentre sei offline");
      }
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (!searchTerm.trim()) {
        await fetchRestaurants();
        return;
      }
      
      const normalizedSearchTerm = searchTerm.toLowerCase().trim();
      const restaurantsCollection = collection(db, "restaurants");
      const restaurantsSnapshot = await getDocs(restaurantsCollection);
      
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
      
      const filteredRestaurants = restaurantsSnapshot.docs
        .map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || 'Ristorante senza nome',
            image: data.coverImage || '/placeholder.svg',
            rating: data.rating || 0,
            reviews: data.reviews || 0,
            cuisine: data.cuisine || 'Italiana',
            description: data.description || 'Nessuna descrizione disponibile',
            address: data.address || 'Indirizzo non disponibile',
            hasGlutenFreeOptions: data.hasGlutenFreeOptions || false,
            isFavorite: userFavorites.includes(doc.id)
          } as Restaurant;
        })
        .filter(restaurant => 
          restaurant.name.toLowerCase().includes(normalizedSearchTerm) || 
          restaurant.description?.toLowerCase().includes(normalizedSearchTerm) ||
          restaurant.address?.toLowerCase().includes(normalizedSearchTerm)
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
      let userFavorites: string[] = [];
      
      try {
        const userFavoritesDoc = await getDoc(userFavoritesRef);
        if (userFavoritesDoc.exists()) {
          userFavorites = userFavoritesDoc.data().restaurantIds || [];
        }
      } catch (error) {
        console.error("Errore nel recupero dei preferiti:", error);
      }
      
      const isFavorite = userFavorites.includes(id);
      let updatedFavorites: string[];
      let message: string;
      
      if (isFavorite) {
        updatedFavorites = userFavorites.filter(restaurantId => restaurantId !== id);
        message = "Ristorante rimosso dai preferiti";
      } else {
        updatedFavorites = [...userFavorites, id];
        message = "Ristorante aggiunto ai preferiti";
      }
      
      setRestaurants(prevRestaurants => 
        prevRestaurants.map(restaurant => 
          restaurant.id === id 
            ? { ...restaurant, isFavorite: !isFavorite } 
            : restaurant
        )
      );
      
      try {
        localStorage.setItem(`favorites_${currentUser.uid}`, JSON.stringify(updatedFavorites));
      } catch (error) {
        console.error("Errore nel salvataggio locale dei preferiti:", error);
      }
      
      if (navigator.onLine) {
        try {
          await setDoc(userFavoritesRef, { restaurantIds: updatedFavorites }, { merge: true });
          const selectedRestaurant = restaurants.find(r => r.id === id);
          
          if (selectedRestaurant && !isFavorite) {
            const userFavRef = doc(db, `users/${currentUser.uid}/favorites`, id);
            await setDoc(userFavRef, {
              name: selectedRestaurant.name,
              address: selectedRestaurant.address,
              image: selectedRestaurant.image,
              rating: selectedRestaurant.rating,
              description: selectedRestaurant.description,
              restaurantId: id
            });
          } else if (isFavorite) {
            try {
              await deleteDoc(doc(db, `users/${currentUser.uid}/favorites`, id));
            } catch (error) {
              console.error("Errore nella rimozione del documento preferito:", error);
            }
          }
          
          toast.success(message);
        } catch (error) {
          console.error("Errore nell'aggiornamento dei preferiti su Firestore:", error);
          toast.warning(message + " (solo in locale)");
        }
      } else {
        toast.info(message + " (in modalità offline)");
      }
    } catch (error) {
      console.error("Errore generale nei preferiti:", error);
      toast.error("Si è verificato un errore durante l'aggiornamento dei preferiti");
    }
  };

  return {
    restaurants,
    searchTerm,
    setSearchTerm,
    isLoading,
    isOffline,
    regionStatus,
    handleSearch,
    handleToggleFavorite,
    refreshRestaurants: fetchRestaurants,
    retryRegionCheck: verifyRegion
  };
};
