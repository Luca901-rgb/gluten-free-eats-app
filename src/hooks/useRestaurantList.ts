
import { useState, useEffect, useCallback } from 'react';
import { Restaurant, RegionStatus } from '@/types/restaurant';
import { toast } from 'sonner';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { sampleRestaurant } from '@/data/sampleRestaurant';
import { useGeolocationRestaurants } from './useGeolocationRestaurants';
import { useRegionVerification } from './useRegionVerification';
import { useOfflineRestaurants } from './useOfflineRestaurants';
import { sortRestaurantsByDistance } from '@/utils/distanceCalculator';

// Export the RegionStatus type properly with 'export type'
export type { RegionStatus };

export const useRestaurantList = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const { isOffline, getOfflineRestaurants, saveRestaurantsToCache } = useOfflineRestaurants();
  const { regionStatus, verifyRegion } = useRegionVerification();
  const { userLocation, getUserLocation, addDistanceToRestaurants } = useGeolocationRestaurants();

  // Carica automaticamente i ristoranti all'apertura dell'app
  useEffect(() => {
    console.log("Caricamento ristoranti all'avvio");
    
    // Carica immediatamente senza attendere l'interazione utente
    refreshRestaurants();
    
    // Imposta un refresh periodico dei dati ogni 3 minuti se l'utente rimane sulla pagina
    const refreshInterval = setInterval(() => {
      if (navigator.onLine) {
        console.log("Aggiornamento periodico dei dati");
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
        setRestaurants(offlineData);
        setIsLoading(false);
      }
    };

    initApp();
  }, [verifyRegion]);

  // Effetto per aggiornare le distanze quando cambia la posizione dell'utente
  useEffect(() => {
    if (userLocation && restaurants.length > 0) {
      const restaurantsWithDistance = addDistanceToRestaurants(restaurants);
      const sortedRestaurants = sortRestaurantsByDistance(restaurantsWithDistance, userLocation);
      setRestaurants(sortedRestaurants);
    }
  }, [userLocation, addDistanceToRestaurants]);

  const fetchRestaurants = async () => {
    console.log("Caricamento ristoranti iniziato");
    
    if (isOffline) {
      const offlineRestaurants = getOfflineRestaurants();
      setRestaurants(offlineRestaurants);
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      const restaurantsCollection = collection(db, "restaurants");
      
      console.log("Tentativo di caricamento ristoranti da Firebase...");
      const restaurantsSnapshot = await getDocs(restaurantsCollection);
      console.log("Numero di ristoranti trovati nel DB:", restaurantsSnapshot.docs.length);
      
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
          location: data.location || { lat: 40.8518, lng: 14.2681 },
          isFavorite: false
        } as Restaurant;
      });
      
      // Aggiungi sempre il ristorante di esempio all'inizio dell'array,
      // indipendentemente dai risultati del database
      restaurantsData = [sampleRestaurant, ...restaurantsData];
      console.log("Ristorante di esempio (Trattoria Keccabio) aggiunto in testa ai risultati");
      
      // Se l'utente ha condiviso la posizione, calcola le distanze
      if (userLocation) {
        restaurantsData = addDistanceToRestaurants(restaurantsData);
        restaurantsData = sortRestaurantsByDistance(restaurantsData, userLocation);
      }
      
      saveRestaurantsToCache(restaurantsData);
      
      setRestaurants(restaurantsData);
      console.log("Lista ristoranti aggiornata con", restaurantsData.length, "elementi");
    } catch (error) {
      console.error("Errore durante il recupero dei ristoranti:", error);
      
      // In caso di errore, assicuriamoci di includere il ristorante di esempio
      const offlineRestaurants = getOfflineRestaurants();
      // Verifica che Trattoria Keccabio sia presente
      const keccabioExists = offlineRestaurants.some(r => r.id === sampleRestaurant.id);
      if (!keccabioExists) {
        offlineRestaurants.unshift(sampleRestaurant);
      }
      setRestaurants(offlineRestaurants);
      
      if (navigator.onLine) {
        toast.error("Si è verificato un errore nel caricamento dei ristoranti");
      } else {
        toast.info("Utilizzando dati ristoranti dalla cache");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isOffline) {
      const cachedRestaurants = getOfflineRestaurants();
      const normalizedSearchTerm = searchTerm.toLowerCase().trim();
      
      if (!normalizedSearchTerm) {
        setRestaurants(cachedRestaurants);
        return;
      }
      
      const filtered = cachedRestaurants.filter((restaurant: Restaurant) => 
        restaurant.name.toLowerCase().includes(normalizedSearchTerm) || 
        restaurant.description?.toLowerCase().includes(normalizedSearchTerm) ||
        restaurant.address?.toLowerCase().includes(normalizedSearchTerm)
      );
      
      setRestaurants(filtered);
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
            hasGlutenFreeOptions: data.hasGlutenFreeOptions || false
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

  const refreshRestaurants = useCallback(fetchRestaurants, [
    isOffline, 
    userLocation, 
    getOfflineRestaurants, 
    addDistanceToRestaurants, 
    saveRestaurantsToCache
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
        return;
      }
      
      setRestaurants(prevRestaurants => 
        sortRestaurantsByDistance(prevRestaurants, userLocation)
      );
    }
  };
};
