
import { useState, useEffect, useCallback } from 'react';
import { Restaurant } from '@/components/Restaurant/RestaurantCard';
import { toast } from 'sonner';
import { checkUserRegion } from '@/utils/geolocation';
import { collection, getDocs, getDoc } from 'firebase/firestore';
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
  const [userLocation, setUserLocation] = useState<GeolocationCoordinates | null>(null);

  // Ristorante di esempio per la modalità offline o fallback
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

  // Funzione per ottenere la posizione dell'utente
  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error("Il tuo browser non supporta la geolocalizzazione");
      return;
    }

    toast.info("Ricerca posizione in corso...");
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation(position.coords);
        toast.success("Posizione trovata! Ordinamento ristoranti per distanza");
        
        // Calcola la distanza per tutti i ristoranti
        setRestaurants(prevRestaurants => {
          return prevRestaurants.map(restaurant => {
            if (restaurant.location && position.coords) {
              const distance = calculateDistance(
                position.coords.latitude,
                position.coords.longitude,
                restaurant.location.lat,
                restaurant.location.lng
              );
              
              return {
                ...restaurant,
                distance: formatDistance(distance),
                distanceValue: distance
              };
            }
            return restaurant;
          });
        });
      },
      (error) => {
        console.error("Errore nella geolocalizzazione:", error);
        
        if (error.code === 1) { // Permission denied
          toast.error("Accesso alla posizione negato");
        } else if (error.code === 2) { // Position unavailable
          toast.error("Impossibile determinare la posizione");
        } else if (error.code === 3) { // Timeout
          toast.error("Richiesta posizione scaduta");
        } else {
          toast.error("Errore nella geolocalizzazione");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);
  
  // Funzione per calcolare la distanza tra due punti geografici (formula dell'emisenoverso)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Raggio della Terra in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; // Distanza in km
    return distance;
  };
  
  const deg2rad = (deg: number): number => {
    return deg * (Math.PI/180);
  };
  
  const formatDistance = (distance: number): string => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)} m`;
    } else {
      return `${distance.toFixed(1)} km`;
    }
  };
  
  // Funzione per ordinare i ristoranti per distanza
  const sortRestaurantsByDistance = () => {
    if (!userLocation) {
      toast.error("Posizione utente non disponibile");
      return;
    }
    
    setRestaurants(prevRestaurants => 
      [...prevRestaurants].sort((a, b) => {
        if (!a.distanceValue && !b.distanceValue) return 0;
        if (!a.distanceValue) return 1;
        if (!b.distanceValue) return -1;
        return a.distanceValue - b.distanceValue;
      })
    );
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
      
      // Se l'utente ha condiviso la posizione, calcola le distanze
      if (userLocation) {
        restaurantsData = restaurantsData.map(restaurant => {
          if (restaurant.location) {
            const distance = calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              restaurant.location.lat,
              restaurant.location.lng
            );
            
            return {
              ...restaurant,
              distance: formatDistance(distance),
              distanceValue: distance
            };
          }
          return restaurant;
        });
        
        // Ordina per distanza
        restaurantsData.sort((a, b) => {
          if (!a.distanceValue && !b.distanceValue) return 0;
          if (!a.distanceValue) return 1;
          if (!b.distanceValue) return -1;
          return a.distanceValue - b.distanceValue;
        });
      }
      
      try {
        localStorage.setItem('cachedRestaurants', JSON.stringify(restaurantsData));
        console.log("Salvati", restaurantsData.length, "ristoranti in cache");
      } catch (e) {
        console.error("Errore nel salvataggio dei ristoranti in cache:", e);
      }
      
      setRestaurants(restaurantsData);
      console.log("Lista ristoranti aggiornata con", restaurantsData.length, "elementi");
      console.log("RestaurantList - Valore restaurant:", restaurantsData);
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
          console.log("Aggiornamento lista con", parsedRestaurants.length, "ristoranti dal backend");
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

  return {
    restaurants,
    searchTerm,
    setSearchTerm,
    isLoading,
    isOffline,
    regionStatus,
    userLocation,
    handleSearch,
    refreshRestaurants: fetchRestaurants,
    retryRegionCheck: verifyRegion,
    getUserLocation,
    sortRestaurantsByDistance
  };
};
