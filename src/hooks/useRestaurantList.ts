
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
  const [restaurants, setRestaurants] = useState<Restaurant[]>([sampleRestaurant]); // Initialize with sampleRestaurant
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
        setRestaurants(offlineData.length > 0 ? offlineData : [sampleRestaurant]); // Fallback to sampleRestaurant
        setIsLoading(false);
      }
    };

    initApp();
  }, [verifyRegion]);

  // Effetto per aggiornare le distanze quando cambia la posizione dell'utente
  useEffect(() => {
    if (userLocation && restaurants.length > 0) {
      // Assicuriamoci che il ristorante di esempio sia presente
      let restaurantsToUpdate = [...restaurants];
      if (!restaurantsToUpdate.some(r => r.id === sampleRestaurant.id)) {
        restaurantsToUpdate = [sampleRestaurant, ...restaurantsToUpdate];
      }
      
      const restaurantsWithDistance = addDistanceToRestaurants(restaurantsToUpdate);
      const sortedRestaurants = sortRestaurantsByDistance(restaurantsWithDistance, userLocation);
      
      // Assicuriamoci che il sample restaurant sia sempre in prima posizione
      const keccabioIndex = sortedRestaurants.findIndex(r => r.id === sampleRestaurant.id);
      if (keccabioIndex > 0) {
        const keccabio = sortedRestaurants.splice(keccabioIndex, 1)[0];
        sortedRestaurants.unshift(keccabio);
      } else if (keccabioIndex === -1) {
        // Se non c'è, lo aggiungiamo
        sortedRestaurants.unshift(sampleRestaurant);
      }
      
      setRestaurants(sortedRestaurants);
    }
  }, [userLocation, addDistanceToRestaurants]);

  const fetchRestaurants = async () => {
    console.log("Caricamento ristoranti iniziato");
    
    // Assicuriamoci che il ristorante di esempio sia sempre visibile anche durante il caricamento
    setRestaurants(prev => {
      if (prev.length === 0 || !prev.some(r => r.id === sampleRestaurant.id)) {
        return [sampleRestaurant];
      }
      return prev;
    });
    
    if (isOffline) {
      const offlineRestaurants = getOfflineRestaurants();
      // Assicuriamoci che Trattoria Keccabio sia presente nei risultati offline
      if (offlineRestaurants.length === 0 || !offlineRestaurants.some(r => r.id === sampleRestaurant.id)) {
        setRestaurants([sampleRestaurant]);
      } else {
        setRestaurants(offlineRestaurants);
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
        
        // Assicuriamoci che il sample restaurant sia sempre in prima posizione
        const keccabioIndex = restaurantsData.findIndex(r => r.id === sampleRestaurant.id);
        if (keccabioIndex > 0) {
          const keccabio = restaurantsData.splice(keccabioIndex, 1)[0];
          restaurantsData.unshift(keccabio);
        }
      }
      
      saveRestaurantsToCache(restaurantsData);
      
      setRestaurants(restaurantsData);
      console.log("Lista ristoranti aggiornata con", restaurantsData.length, "elementi");
    } catch (error) {
      console.error("Errore durante il recupero dei ristoranti:", error);
      
      // In caso di errore, assicuriamoci di includere il ristorante di esempio
      setRestaurants([sampleRestaurant]);
      toast.info("Utilizzando solo il ristorante di esempio");
      
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
      
      setRestaurants(prevRestaurants => {
        const sorted = sortRestaurantsByDistance(prevRestaurants, userLocation);
        
        // Assicuriamoci che il sample restaurant sia sempre in prima posizione
        const keccabioIndex = sorted.findIndex(r => r.id === sampleRestaurant.id);
        if (keccabioIndex > 0) {
          const keccabio = sorted.splice(keccabioIndex, 1)[0];
          sorted.unshift(keccabio);
        } else if (keccabioIndex === -1) {
          // Se non c'è, lo aggiungiamo
          sorted.unshift(sampleRestaurant);
        }
        
        return sorted;
      });
    }
  };
};
