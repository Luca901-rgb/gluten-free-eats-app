
import { useState, useEffect, useCallback } from 'react';
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
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [regionStatus, setRegionStatus] = useState<RegionStatus>({
    checked: false,
    inRegion: false
  });

  // Verifica la regione dell'utente
  const verifyRegion = useCallback(async () => {
    try {
      const result = await checkUserRegion();
      setRegionStatus({
        checked: true,
        inRegion: result.inRegion || true, // Default a true per evitare blocchi
        regionName: result.regionName,
        error: result.error
      });

      if (result.inRegion) {
        if (result.regionName) {
          toast.success(`Servizio disponibile nella tua regione: ${result.regionName}`);
        }
        return true;
      } else if (result.error) {
        if (navigator.onLine) {
          toast.info(result.error);
        }
        return true; // Continuiamo comunque
      } else {
        toast.info("Il servizio è attualmente in fase pilota in Campania");
        return true; // Continuiamo comunque
      }
    } catch (error) {
      console.error("Errore durante la verifica della regione:", error);
      setRegionStatus({
        checked: true,
        inRegion: true, // Default a true per evitare blocchi
        error: "Si è verificato un errore durante la verifica della tua posizione."
      });
      return true; // Continuiamo comunque
    }
  }, []);

  useEffect(() => {
    // Monitor online/offline status
    const handleOnlineStatus = () => {
      const online = navigator.onLine;
      setIsOffline(!online);
      
      if (online) {
        // Se siamo tornati online, ricarica i dati
        fetchRestaurants();
      }
    };
    
    // Add event listeners
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    
    // Inizializzazione
    const initApp = async () => {
      // Verifica la regione dell'utente - continua comunque
      await verifyRegion();
      
      // Carica i ristoranti se online
      if (navigator.onLine) {
        await fetchRestaurants();
      } else {
        setIsLoading(false);
        toast.info("Sei offline. Alcune funzionalità potrebbero non essere disponibili.");
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
      // Prova a caricare dalla cache
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
      
      // Salva in cache
      localStorage.setItem('cachedRestaurants', JSON.stringify(restaurantsData));
      
      setRestaurants(restaurantsData);
    } catch (error) {
      console.error("Errore durante il recupero dei ristoranti:", error);
      
      // Prova a caricare dalla cache
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
      // Filtra dalla cache
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
        // Se la ricerca è vuota, recupera tutti
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
      
      // Client-side filtering
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
      // Ottieni l'elenco corrente dei preferiti
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
      
      // Toggle favorite status
      const isFavorite = userFavorites.includes(id);
      let updatedFavorites: string[];
      let message: string;
      
      if (isFavorite) {
        // Rimuovi dai preferiti
        updatedFavorites = userFavorites.filter(restaurantId => restaurantId !== id);
        message = "Ristorante rimosso dai preferiti";
      } else {
        // Aggiungi ai preferiti
        updatedFavorites = [...userFavorites, id];
        message = "Ristorante aggiunto ai preferiti";
      }
      
      // Aggiorna subito UI (optimistic update)
      setRestaurants(prevRestaurants => 
        prevRestaurants.map(restaurant => 
          restaurant.id === id 
            ? { ...restaurant, isFavorite: !isFavorite } 
            : restaurant
        )
      );
      
      // Salva nel localStorage per accesso offline
      try {
        localStorage.setItem(`favorites_${currentUser.uid}`, JSON.stringify(updatedFavorites));
      } catch (error) {
        console.error("Errore nel salvataggio locale dei preferiti:", error);
      }
      
      // Prova ad aggiornare Firestore se online
      if (navigator.onLine) {
        try {
          await setDoc(userFavoritesRef, { restaurantIds: updatedFavorites }, { merge: true });
          
          // Crea o aggiorna anche singolo documento nei preferiti utente
          const selectedRestaurant = restaurants.find(r => r.id === id);
          
          if (selectedRestaurant && !isFavorite) {
            // Aggiungi il documento dettagliato nei preferiti
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
            // Rimuovi il documento dai preferiti
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
