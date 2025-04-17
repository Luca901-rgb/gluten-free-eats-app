
import React, { useState, useEffect, useCallback } from 'react';
import Layout from '@/components/Layout';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChefHat, MapPin, Navigation, Info, AlertTriangle, Settings, Sliders } from 'lucide-react';
import { RestaurantMap } from '@/components/Map/RestaurantMap';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { isInAvailableRegion, requestGeolocationPermission, checkGeolocationPermission } from '@/utils/geolocation';
import { Slider } from '@/components/ui/slider';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRestaurantData } from '@/hooks/useRestaurantData';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

// Tipo di dato per i ristoranti
interface Restaurant {
  id: string;
  name: string;
  location: { lat: number; lng: number; };
  address: string;
  distance: string;
  distanceValue?: number;
  image?: string;
  rating?: number;
  reviews?: number;
  cuisine?: string;
  isFavorite?: boolean;
}

const SearchPage = () => {
  const [userPosition, setUserPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(true); // Inizia cercando subito la posizione
  const [locationError, setLocationError] = useState<string | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [inAvailableRegion, setInAvailableRegion] = useState<boolean | null>(null);
  const [permissionState, setPermissionState] = useState<string | null>(null);
  const [hasRequestedPermission, setHasRequestedPermission] = useState(false);
  const [maxDistance, setMaxDistance] = useState<number>(100); // Impostazione del filtro distanza a 100km
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [hasInitializedMap, setHasInitializedMap] = useState(false);
  
  // Import the sample restaurant data to use as fallback
  const { restaurantData: sampleRestaurant } = useRestaurantData();
  
  // Controlla lo stato dei permessi di geolocalizzazione
  const checkPermissionStatus = useCallback(async () => {
    console.log("Controllo stato permessi geolocalizzazione...");
    const hasPermission = await checkGeolocationPermission();
    setPermissionState(hasPermission ? 'granted' : 'denied');
    console.log("Stato permessi:", hasPermission ? 'granted' : 'denied');
    return hasPermission;
  }, []);
  
  // Funzione per calcolare la distanza in km tra due punti geografici
  const calculateDistance = useCallback((lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Raggio della Terra in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distanza in km
  }, []);
  
  // Ottimizzata: funzione memoizzata per il recupero dei ristoranti
  const fetchRestaurants = useCallback(async (position?: { lat: number; lng: number }) => {
    if (isLoading) return; // Previene chiamate multiple simultanee
    
    setIsLoading(true);
    setLoadingProgress(10);
    
    try {
      console.log("Posizione utente per fetchRestaurants:", position);
      
      // Carica prima dalla cache per visualizzazione immediata
      try {
        const cachedData = localStorage.getItem('cachedRestaurants');
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          if (position && Array.isArray(parsedData) && parsedData.length > 0) {
            // Ricalcola la distanza per i ristoranti in cache
            const withDistance = parsedData.map((restaurant: any) => {
              if (restaurant.location && position) {
                const distanceValue = calculateDistance(
                  position.lat, 
                  position.lng, 
                  restaurant.location.lat, 
                  restaurant.location.lng
                );
                return {
                  ...restaurant,
                  distance: `${distanceValue.toFixed(1)} km`,
                  distanceValue
                };
              }
              return restaurant;
            }).filter((r: any) => (r.distanceValue || 0) <= maxDistance)
              .sort((a: any, b: any) => (a.distanceValue || 0) - (b.distanceValue || 0));
              
            setRestaurants(withDistance);
            console.log("Mostrando", withDistance.length, "ristoranti dalla cache");
            setLoadingProgress(40);
          }
        }
      } catch (e) {
        console.error("Errore nel recupero dati dalla cache:", e);
      }
      
      // Poi carica dal database (se online)
      if (navigator.onLine) {
        const restaurantsCollection = collection(db, "restaurants");
        setLoadingProgress(60);
        const restaurantsSnapshot = await getDocs(restaurantsCollection);
        setLoadingProgress(80);
        
        console.log("Numero di ristoranti trovati nel DB:", restaurantsSnapshot.docs.length);
        
        // Se non ci sono ristoranti nel database, usa il ristorante di esempio
        let fetchedRestaurants = [];
        
        if (restaurantsSnapshot.docs.length === 0) {
          console.log("Nessun ristorante trovato nel database, uso il ristorante di esempio:", sampleRestaurant);
          // Usa il ristorante di esempio come fallback
          if (sampleRestaurant) {
            const restaurantLocation = sampleRestaurant.location || { lat: 40.8388, lng: 14.2488 };
            
            // Calcola la distanza solo se l'utente ha condiviso la posizione
            let distanceValue = 0;
            if (position) {
              distanceValue = calculateDistance(
                position.lat, 
                position.lng, 
                restaurantLocation.lat, 
                restaurantLocation.lng
              );
              console.log("Distanza calcolata per", sampleRestaurant.name, ":", distanceValue.toFixed(1), "km");
            }
            
            fetchedRestaurants = [{
              id: sampleRestaurant.id || '1',
              name: sampleRestaurant.name,
              location: restaurantLocation,
              address: sampleRestaurant.address,
              distance: position ? `${distanceValue.toFixed(1)} km` : 'Distanza non disponibile',
              distanceValue: distanceValue,
              image: sampleRestaurant.coverImage,
              rating: sampleRestaurant.rating,
              reviews: sampleRestaurant.totalReviews,
              cuisine: sampleRestaurant.cuisine || 'Italiana',
              isFavorite: false
            }];
          }
        } else {
          // Mappa i ristoranti dal database
          fetchedRestaurants = restaurantsSnapshot.docs.map(doc => {
            const data = doc.data();
            const restaurantLocation = data.location || { lat: 0, lng: 0 };
            
            // Calcola la distanza solo se l'utente ha condiviso la posizione
            let distanceValue = 0;
            if (position) {
              distanceValue = calculateDistance(
                position.lat, 
                position.lng, 
                restaurantLocation.lat, 
                restaurantLocation.lng
              );
            }
            
            return {
              id: doc.id,
              name: data.name || 'Ristorante senza nome',
              location: restaurantLocation,
              address: data.address || 'Indirizzo non disponibile',
              distance: position ? `${distanceValue.toFixed(1)} km` : 'Distanza non disponibile',
              distanceValue: distanceValue,
              image: data.coverImage || '/placeholder.svg',
              rating: data.rating || 0,
              reviews: data.reviews || 0,
              cuisine: data.cuisine || 'Italiana',
              isFavorite: false
            } as Restaurant;
          });
        }
        
        // Filtra per distanza massima e ordina
        if (position) {
          fetchedRestaurants = fetchedRestaurants
            .filter(restaurant => (restaurant.distanceValue || 0) <= maxDistance)
            .sort((a, b) => (a.distanceValue || 0) - (b.distanceValue || 0));
          
          console.log("Ristoranti filtrati e ordinati:", fetchedRestaurants.length);
        }
        
        // Aggiorna i ristoranti solo se ci sono nuovi dati
        if (fetchedRestaurants.length > 0) {
          setRestaurants(fetchedRestaurants);
          
          // Aggiorna la cache locale per accesso futuro
          try {
            localStorage.setItem('cachedRestaurants', JSON.stringify(fetchedRestaurants));
          } catch (e) {
            console.error("Errore nel salvataggio cache:", e);
          }
        }
      }
      
      setLoadingProgress(100);
    } catch (error) {
      console.error('Errore nel recupero dei ristoranti:', error);
      
      // Fallback al ristorante di esempio se abbiamo la posizione ma non ristoranti
      if (position && restaurants.length === 0) {
        const restaurantLocation = sampleRestaurant?.location || { lat: 40.8388, lng: 14.2488 };
        const distanceValue = calculateDistance(
          position.lat, 
          position.lng, 
          restaurantLocation.lat, 
          restaurantLocation.lng
        );
        
        setRestaurants([{
          id: sampleRestaurant?.id || '1',
          name: sampleRestaurant?.name || 'Trattoria Keccabio',
          location: restaurantLocation,
          address: sampleRestaurant?.address || 'Via Toledo 42, Napoli',
          distance: `${distanceValue.toFixed(1)} km`,
          distanceValue: distanceValue,
          image: sampleRestaurant?.coverImage || '/placeholder.svg',
          rating: sampleRestaurant?.rating || 4.7,
          reviews: sampleRestaurant?.totalReviews || 128,
          cuisine: sampleRestaurant?.cuisine || 'Italiana',
          isFavorite: false
        }]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, maxDistance, sampleRestaurant, calculateDistance]);
  
  // Avvia l'acquisizione della posizione automaticamente all'apertura della pagina
  useEffect(() => {
    getUserLocation();
    
    // Carica comunque i ristoranti anche senza posizione per evitare pagina vuota
    const timer = setTimeout(() => {
      if (!userPosition && !isLocating && restaurants.length === 0) {
        console.log("Timeout scaduto, carico ristoranti senza posizione");
        fetchRestaurants();
      }
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Aggiorna la lista quando cambia la posizione o la distanza massima
  useEffect(() => {
    if (userPosition) {
      fetchRestaurants(userPosition);
    }
  }, [userPosition, maxDistance, fetchRestaurants]);
  
  const getUserLocation = async () => {
    console.log("Avvio rilevamento posizione...");
    setIsLocating(true);
    setLocationError(null);
    setHasRequestedPermission(true);
    
    try {
      // Prima verifica se abbiamo una cache della posizione recente
      try {
        const cachedPosition = localStorage.getItem('userPosition');
        if (cachedPosition) {
          const parsedPosition = JSON.parse(cachedPosition);
          const timestamp = parsedPosition.timestamp || 0;
          // Se la cache è più recente di 30 minuti, usala temporaneamente
          if (Date.now() - timestamp < 30 * 60 * 1000) {
            console.log("Usando posizione dalla cache temporaneamente:", parsedPosition);
            setUserPosition({ lat: parsedPosition.lat, lng: parsedPosition.lng });
            setHasInitializedMap(true);
          }
        }
      } catch (e) {
        console.error("Errore nel recupero posizione dalla cache:", e);
      }
    
      // Richiedi comunque i permessi per ottenere la posizione aggiornata
      const permissionGranted = await requestGeolocationPermission();
      
      console.log("Permessi concessi?", permissionGranted);
      
      if (!permissionGranted) {
        setLocationError("Permessi di posizione non concessi. Per trovare ristoranti vicini, attiva la geolocalizzazione nelle impostazioni del dispositivo.");
        setIsLocating(false);
        setPermissionState('denied');
        
        // Carica comunque i ristoranti anche senza posizione
        fetchRestaurants();
        return;
      }
    
      if (navigator.geolocation) {
        // Imposta un timeout di fallback per non bloccare l'utente
        const timeoutId = setTimeout(() => {
          if (isLocating) {
            console.log("Timeout geolocalizzazione, carico ristoranti senza posizione aggiornata");
            setIsLocating(false);
            
            // Se abbiamo già una posizione iniziale, usiamo quella
            if (!userPosition) {
              // Altrimenti carica senza posizione
              fetchRestaurants();
            }
          }
        }, 8000);
        
        navigator.geolocation.getCurrentPosition(
          (position) => {
            clearTimeout(timeoutId);
            console.log("Posizione ottenuta:", position.coords);
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            
            // Salva la posizione nella cache con timestamp
            try {
              localStorage.setItem('userPosition', JSON.stringify({
                ...pos,
                timestamp: Date.now()
              }));
            } catch (e) {
              console.error("Errore nel salvataggio posizione in cache:", e);
            }
            
            setUserPosition(pos);
            setPermissionState('granted');
            setHasInitializedMap(true);
            
            const regionCheck = isInAvailableRegion(pos);
            setInAvailableRegion(regionCheck.inRegion);
            
            if (regionCheck.inRegion) {
              toast.success(`Posizione rilevata in ${regionCheck.regionName}!`);
            } else {
              toast.info("La tua posizione è al di fuori dell'area del programma pilota (solo Campania).");
            }
            
            fetchRestaurants(pos);
            setIsLocating(false);
          },
          (error) => {
            clearTimeout(timeoutId);
            console.error('Errore durante il recupero della posizione:', error);
            
            let errorMessage = "Impossibile determinare la tua posizione.";
            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMessage = "Accesso alla posizione negato. Verifica i permessi del dispositivo nelle impostazioni.";
                setPermissionState('denied');
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage = "Dati sulla posizione non disponibili.";
                break;
              case error.TIMEOUT:
                errorMessage = "Timeout durante la richiesta della posizione.";
                break;
            }
            
            setLocationError(errorMessage);
            setIsLocating(false);
            
            // Carica comunque i ristoranti anche con errore
            fetchRestaurants();
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 5 * 60 * 1000 // Accetta posizioni fino a 5 minuti fa per velocità
          }
        );
      } else {
        const errorMessage = "Il tuo browser non supporta la geolocalizzazione.";
        setLocationError(errorMessage);
        setIsLocating(false);
        
        // Carica comunque i ristoranti anche senza geolocalizzazione
        fetchRestaurants();
      }
    } catch (error) {
      console.error("Errore durante la gestione dei permessi:", error);
      setLocationError("Si è verificato un errore durante l'accesso alla posizione.");
      setIsLocating(false);
      
      // Carica comunque i ristoranti anche con errore
      fetchRestaurants();
    }
  };
  
  const handleUserLocationFound = (position: { lat: number; lng: number }) => {
    console.log("Posizione utente trovata dalla mappa:", position);
    setUserPosition(position);
    setPermissionState('granted');
    setHasInitializedMap(true);
    
    // Salva la posizione nella cache con timestamp
    try {
      localStorage.setItem('userPosition', JSON.stringify({
        ...position,
        timestamp: Date.now()
      }));
    } catch (e) {
      console.error("Errore nel salvataggio posizione in cache:", e);
    }
    
    const regionCheck = isInAvailableRegion(position);
    setInAvailableRegion(regionCheck.inRegion);
    
    if (regionCheck.inRegion) {
      toast.success(`Posizione rilevata in ${regionCheck.regionName}!`);
    }
    
    setIsLocating(false);
  };
  
  const openSettingsGuide = () => {
    toast.info("Per attivare la geolocalizzazione: apri le Impostazioni del dispositivo → App → Gluten Free Eats → Autorizzazioni → Posizione → Consenti");
  };
  
  const handleDistanceChange = (value: number[]) => {
    console.log("Nuova distanza massima impostata:", value[0], "km");
    setMaxDistance(value[0]);
  };
  
  const openGoogleMaps = (restaurant: Restaurant) => {
    if (restaurant.location && userPosition) {
      // Apri Google Maps con le indicazioni stradali dalla posizione utente
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userPosition.lat},${userPosition.lng}&destination=${restaurant.location.lat},${restaurant.location.lng}&travelmode=driving`;
      window.open(googleMapsUrl, '_blank');
      toast.success('Apertura navigazione verso il ristorante');
    } else if (restaurant.location) {
      // Se non abbiamo la posizione utente, apri semplicemente la posizione del ristorante
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${restaurant.location.lat},${restaurant.location.lng}`;
      window.open(googleMapsUrl, '_blank');
      toast.success('Apertura mappa del ristorante');
    } else {
      toast.error('Coordinate del ristorante non disponibili');
    }
  };

  return (
    <Layout>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-poppins font-bold text-primary">Cerca Ristoranti</h1>
          <Link to="/restaurant-dashboard">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <ChefHat size={16} />
              Gestisci Ristorante
            </Button>
          </Link>
        </div>
        
        {/* Stato geolocalizzazione - mostrato solo durante caricamento attivo */}
        {isLocating && (
          <div className="mb-4">
            <Progress value={loadingProgress} className="h-2 mb-1" />
            <p className="text-sm text-center text-gray-600">
              Localizzazione in corso... {loadingProgress > 0 ? `${loadingProgress}%` : ''}
            </p>
          </div>
        )}
        
        {/* Region availability check */}
        {inAvailableRegion === false && (
          <Alert variant="warning" className="mb-4 bg-amber-50 border-amber-200">
            <MapPin className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800">Area non disponibile</AlertTitle>
            <AlertDescription className="text-amber-700">
              Il nostro servizio è attualmente disponibile solo in Campania durante la fase pilota.
              La tua posizione attuale è al di fuori di quest&apos;area.
            </AlertDescription>
          </Alert>
        )}
        
        {/* Permission denied alert */}
        {(permissionState === 'denied' && hasRequestedPermission) && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Permessi posizione non concessi</AlertTitle>
            <AlertDescription>
              Per utilizzare tutte le funzionalità dell&apos;app, attiva la geolocalizzazione nelle impostazioni del dispositivo.
              <Button 
                variant="outline" 
                size="sm" 
                onClick={openSettingsGuide}
                className="mt-2 flex items-center gap-1"
              >
                <Settings size={14} /> Apri impostazioni
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        {/* Location error message */}
        {locationError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm mb-4">
            {locationError}
            {permissionState === 'denied' && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={openSettingsGuide}
                className="mt-2 text-red-600 hover:text-red-700 hover:bg-red-100 w-full flex items-center justify-center gap-1"
              >
                <Settings size={14} /> Come attivare la geolocalizzazione
              </Button>
            )}
          </div>
        )}
        
        {/* Filtro distanza - visibile dopo che abbiamo ottenuto la posizione */}
        {userPosition && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Sliders size={18} className="text-primary" />
              <h3 className="font-medium">Distanza massima: {maxDistance} km</h3>
            </div>
            <Slider
              defaultValue={[100]}
              max={100}
              min={1}
              step={1}
              value={[maxDistance]}
              onValueChange={handleDistanceChange}
              className="my-3"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>1 km</span>
              <span>50 km</span>
              <span>100 km</span>
            </div>
          </div>
        )}
        
        {/* Map and List View - Modified layout */}
        {inAvailableRegion !== false ? (
          <div className="flex flex-col space-y-4">
            {/* Map takes 40vh - loading is handled internally */}
            <div className="h-[40vh] rounded-lg border overflow-hidden">
              <RestaurantMap 
                userLocation={userPosition}
                restaurants={restaurants}
                onUserLocationFound={handleUserLocationFound}
                autoFindLocation={!hasInitializedMap}
              />
            </div>
            
            {/* Restaurant list below the map */}
            <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="p-3 bg-gray-50 border-b flex justify-between items-center">
                <h4 className="font-medium">
                  {isLoading ? 'Caricamento ristoranti...' : 
                   restaurants.length > 0 ? `Ristoranti trovati (${restaurants.length})` : 
                   'Nessun ristorante trovato'}
                </h4>
                {locationError && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={getUserLocation}
                    className="text-xs"
                  >
                    <MapPin className="mr-1 h-3 w-3" /> Riprova
                  </Button>
                )}
              </div>
              
              <div className="max-h-[40vh] overflow-y-auto">
                {isLoading && restaurants.length === 0 ? (
                  // Skeleton loader durante il caricamento iniziale
                  <div className="p-2 space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="bg-white p-3 rounded-lg shadow-sm flex items-start gap-2">
                        <Skeleton className="h-5 w-5 rounded-full flex-shrink-0" />
                        <div className="flex-1">
                          <Skeleton className="h-4 w-3/4 mb-2" />
                          <Skeleton className="h-3 w-1/2 mb-1" />
                          <Skeleton className="h-3 w-1/4" />
                        </div>
                        <Skeleton className="h-8 w-8 rounded-md flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                ) : restaurants.length > 0 ? (
                  <div className="p-2 space-y-2">
                    {restaurants.map(restaurant => (
                      <div 
                        key={restaurant.id} 
                        className="bg-white p-3 rounded-lg shadow-sm flex items-start gap-2 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => {
                          // Navigate to restaurant details
                          window.location.href = `/restaurant/${restaurant.id}`;
                        }}
                      >
                        <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h5 className="font-medium">{restaurant.name}</h5>
                          <p className="text-sm text-gray-600">{restaurant.address}</p>
                          <p className="text-sm font-medium text-primary">{restaurant.distance}</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 flex-shrink-0"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent parent click
                            openGoogleMaps(restaurant);
                          }}
                        >
                          <Navigation className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    {userPosition ? 'Nessun ristorante trovato entro la distanza selezionata.' : 
                     'Condividi la tua posizione per trovare ristoranti nelle vicinanze.'}
                  </div>
                )}
                
                {/* Mostra indicatore di caricamento quando stiamo aggiornando la lista */}
                {isLoading && restaurants.length > 0 && (
                  <div className="p-3 text-center text-xs text-gray-500">
                    <div className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-primary border-r-transparent mr-1"></div>
                    Aggiornamento risultati...
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-800 mb-1">Servizio disponibile solo in Campania</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Durante la fase pilota, il nostro servizio è disponibile esclusivamente nella regione Campania.
              Stiamo lavorando per espandere il servizio ad altre regioni presto.
            </p>
          </div>
        )}
        
        {userPosition && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
            <p className="text-sm text-blue-700">
              <span className="font-medium">La tua posizione attuale:</span> 
              {' '}Lat: {userPosition.lat.toFixed(4)}, Lng: {userPosition.lng.toFixed(4)}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SearchPage;
