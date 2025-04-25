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

  const sampleRestaurant: Restaurant = {
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
    location: {
      lat: 40.8388, 
      lng: 14.2488
    }
  };

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
        setRestaurants([sampleRestaurant]);
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
    console.log("Caricamento ristoranti iniziato");
    
    if (isOffline) {
      const cachedRestaurants = localStorage.getItem('cachedRestaurants');
      if (cachedRestaurants) {
        try {
          let parsedRestaurants = JSON.parse(cachedRestaurants);
          
          const hasSampleRestaurant = parsedRestaurants.some((r: Restaurant) => r.id === sampleRestaurant.id);
          if (!hasSampleRestaurant) {
            parsedRestaurants = [sampleRestaurant, ...parsedRestaurants];
          }
          
          setRestaurants(parsedRestaurants);
          console.log("Caricati", parsedRestaurants.length, "ristoranti dalla cache (incluso esempio)");
        } catch (e) {
          console.error("Errore nel parsing dei ristoranti dalla cache:", e);
          setRestaurants([sampleRestaurant]);
          console.log("Caricato solo il ristorante di esempio");
        }
      } else {
        setRestaurants([sampleRestaurant]);
        console.log("Nessuna cache disponibile, caricato solo il ristorante di esempio");
      }
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      const restaurantsCollection = collection(db, "restaurants");
      
      console.log("Tentativo di caricamento ristoranti da Firebase...");
      const restaurantsSnapshot = await getDocs(restaurantsCollection);
      console.log("Numero di ristoranti trovati nel DB:", restaurantsSnapshot.docs.length);
      
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
      
      let restaurantsData: Restaurant[] = restaurantsSnapshot.docs.map(doc => {
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
          isFavorite: userFavorites.includes(doc.id),
          location: data.location || { lat: 40.8518, lng: 14.2681 }
        } as Restaurant;
      });
      
      if (restaurantsData.length === 0) {
        restaurantsData = [sampleRestaurant];
        console.log("DB vuoto, aggiunto ristorante di esempio");
      } else {
        const hasSampleRestaurant = restaurantsData.some(r => r.id === sampleRestaurant.id || r.name === sampleRestaurant.name);
        if (!hasSampleRestaurant) {
          restaurantsData.unshift(sampleRestaurant);
          console.log("Aggiunto ristorante di esempio ai risultati del DB");
        }
      }
      
      try {
        localStorage.setItem('cachedRestaurants', JSON.stringify(restaurantsData));
        console.log("Salvati", restaurantsData.length, "ristoranti in cache");
      } catch (e) {
        console.error("Errore nel salvataggio dei ristoranti in cache:", e);
      }
      
      setRestaurants(restaurantsData);
      console.log("Lista ristoranti aggiornata con", restaurantsData.length, "elementi");
    } catch (error) {
      console.error("Errore durante il recupero dei ristoranti:", error);
      
      const cachedRestaurants = localStorage.getItem('cachedRestaurants');
      if (cachedRestaurants) {
        try {
          let parsedRestaurants = JSON.parse(cachedRestaurants);
          
          const hasSampleRestaurant = parsedRestaurants.some((r: Restaurant) => r.id === sampleRestaurant.id);
          if (!hasSampleRestaurant) {
            parsedRestaurants = [sampleRestaurant, ...parsedRestaurants];
          }
          
          setRestaurants(parsedRestaurants);
          toast.info("Utilizzando dati ristoranti dalla cache");
        } catch (e) {
          console.error("Errore nel parsing dei ristoranti dalla cache:", e);
          setRestaurants([sampleRestaurant]);
          toast.error("Impossibile caricare i ristoranti");
        }
      } else {
        setRestaurants([sampleRestaurant]);
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
