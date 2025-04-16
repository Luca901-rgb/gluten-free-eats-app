import React, { useState, useEffect } from 'react';
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
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [inAvailableRegion, setInAvailableRegion] = useState<boolean | null>(null);
  const [permissionState, setPermissionState] = useState<string | null>(null);
  const [hasRequestedPermission, setHasRequestedPermission] = useState(false);
  const [maxDistance, setMaxDistance] = useState<number>(100); // Impostazione del filtro distanza a 100km
  const [isLoading, setIsLoading] = useState(false);
  
  // Import the sample restaurant data to use as fallback
  const { restaurantData: sampleRestaurant } = useRestaurantData();
  
  // Controlla lo stato dei permessi di geolocalizzazione
  const checkPermissionStatus = async () => {
    console.log("Controllo stato permessi geolocalizzazione...");
    const hasPermission = await checkGeolocationPermission();
    setPermissionState(hasPermission ? 'granted' : 'denied');
    console.log("Stato permessi:", hasPermission ? 'granted' : 'denied');
    return hasPermission;
  };
  
  // Funzione per calcolare la distanza in km tra due punti geografici
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Raggio della Terra in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distanza in km
    return distance;
  };
  
  // Recupera i ristoranti dal database
  const fetchRestaurants = async (position?: { lat: number; lng: number }) => {
    setIsLoading(true);
    try {
      console.log("Posizione utente per fetchRestaurants:", position);
      const restaurantsCollection = collection(db, "restaurants");
      const restaurantsSnapshot = await getDocs(restaurantsCollection);
      
      console.log("Numero di ristoranti trovati:", restaurantsSnapshot.docs.length);
      
      // Se non ci sono ristoranti nel database, usa il ristorante di esempio
      let fetchedRestaurants = [];
      
      if (restaurantsSnapshot.docs.length === 0) {
        console.log("Nessun ristorante trovato nel database, uso il ristorante di esempio:", sampleRestaurant);
        // Usa il ristorante di esempio quando non ci sono ristoranti nel database
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
          cuisine: 'Italiana', // Default
          isFavorite: false
        }];
        
        console.log("Ristorante di esempio aggiunto:", fetchedRestaurants[0]);
      } else {
        // Mappa i ristoranti dal database
        fetchedRestaurants = restaurantsSnapshot.docs.map(doc => {
          const data = doc.data();
          const restaurantLocation = data.location || { lat: 0, lng: 0 };
          
          console.log("Ristorante:", data.name, "- Posizione:", restaurantLocation);
          
          // Calcola la distanza solo se l'utente ha condiviso la posizione
          let distanceValue = 0;
          if (position) {
            distanceValue = calculateDistance(
              position.lat, 
              position.lng, 
              restaurantLocation.lat, 
              restaurantLocation.lng
            );
            console.log("Distanza calcolata per", data.name, ":", distanceValue.toFixed(1), "km");
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
      
      // Filtra per distanza massima se l'utente ha impostato la posizione
      if (position) {
        console.log("Prima del filtro:", fetchedRestaurants.length, "ristoranti");
        console.log("Distanza massima impostata:", maxDistance, "km");
        
        fetchedRestaurants = fetchedRestaurants
          .filter(restaurant => {
            const isWithinRange = restaurant.distanceValue <= maxDistance;
            console.log(
              "Ristorante:", restaurant.name, 
              "- Distanza:", restaurant.distanceValue, "km", 
              "- Entro il raggio?", isWithinRange
            );
            return isWithinRange;
          })
          .sort((a, b) => (a.distanceValue || 0) - (b.distanceValue || 0)); // Ordina per distanza
        
        console.log("Dopo filtro e ordinamento:", fetchedRestaurants.length, "ristoranti");
      }
      
      setRestaurants(fetchedRestaurants);
    } catch (error) {
      console.error('Errore nel recupero dei ristoranti:', error);
      toast.error('Impossibile caricare i ristoranti');
      
      // Fallback al ristorante di esempio in caso di errore
      if (position) {
        const restaurantLocation = sampleRestaurant.location || { lat: 40.8388, lng: 14.2488 };
        const distanceValue = calculateDistance(
          position.lat, 
          position.lng, 
          restaurantLocation.lat, 
          restaurantLocation.lng
        );
        
        setRestaurants([{
          id: sampleRestaurant.id || '1',
          name: sampleRestaurant.name,
          location: restaurantLocation,
          address: sampleRestaurant.address,
          distance: `${distanceValue.toFixed(1)} km`,
          distanceValue: distanceValue,
          image: sampleRestaurant.coverImage,
          rating: sampleRestaurant.rating,
          reviews: sampleRestaurant.totalReviews,
          cuisine: 'Italiana',
          isFavorite: false
        }]);
        
        toast.info("Mostro il ristorante di esempio");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (userPosition) {
      fetchRestaurants(userPosition);
    }
  }, [userPosition, maxDistance]); // Ricarica quando la posizione o la distanza massima cambiano
  
  const getUserLocation = async () => {
    console.log("Richiesta posizione utente...");
    setIsLocating(true);
    setLocationError(null);
    setHasRequestedPermission(true);
    
    try {
      // Richiedi i permessi esplicitamente
      console.log("Richiesta permessi esplicita...");
      const permissionGranted = await requestGeolocationPermission();
      
      console.log("Permessi concessi?", permissionGranted);
      
      if (!permissionGranted) {
        setLocationError("Permessi di posizione non concessi. Per trovare ristoranti vicini, attiva la geolocalizzazione nelle impostazioni del dispositivo.");
        setIsLocating(false);
        setPermissionState('denied');
        toast.error("Accesso alla posizione negato. Verifica i permessi del dispositivo nelle impostazioni.");
        return;
      }
    
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log("Posizione ottenuta:", position.coords);
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            
            setUserPosition(pos);
            setPermissionState('granted');
            
            const regionCheck = isInAvailableRegion(pos);
            setInAvailableRegion(regionCheck.inRegion);
            
            if (regionCheck.inRegion) {
              toast.success(`Posizione rilevata in ${regionCheck.regionName}!`);
              fetchRestaurants(pos);
            } else {
              toast.warning("La tua posizione è al di fuori dell'area del programma pilota (solo Campania).");
            }
            
            setIsLocating(false);
          },
          (error) => {
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
            toast.error(errorMessage);
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
          }
        );
      } else {
        const errorMessage = "Il tuo browser non supporta la geolocalizzazione.";
        setLocationError(errorMessage);
        setIsLocating(false);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Errore durante la gestione dei permessi:", error);
      setLocationError("Si è verificato un errore durante l'accesso alla posizione.");
      setIsLocating(false);
      toast.error("Errore durante l'accesso alla posizione");
    }
  };
  
  useEffect(() => {
    // Aggiorna lo stato dei permessi all'avvio
    checkPermissionStatus();
  }, []);
  
  const openSettingsGuide = () => {
    toast.info("Per attivare la geolocalizzazione: apri le Impostazioni del dispositivo → App → Gluten Free Eats → Autorizzazioni → Posizione → Consenti");
  };
  
  const handleDistanceChange = (value: number[]) => {
    console.log("Nuova distanza massima impostata:", value[0], "km");
    setMaxDistance(value[0]);
  };

  return (
    <Layout>
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-poppins font-bold text-primary">Cerca Ristoranti</h1>
          <Link to="/restaurant-dashboard">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <ChefHat size={16} />
              Gestisci Ristorante
            </Button>
          </Link>
        </div>
        
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
        
        {/* User location and error states */}
        <div className="mb-4">
          <Button 
            onClick={getUserLocation} 
            disabled={isLocating} 
            className="mb-2 w-full flex items-center justify-center gap-2"
          >
            <Navigation size={16} className={isLocating ? "animate-pulse" : ""} />
            {isLocating ? "Localizzazione in corso..." : "Trova ristoranti vicino a me"}
          </Button>
          
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
          
          {userPosition && !locationError && inAvailableRegion && (
            <div className="p-2 bg-green-50 border border-green-200 rounded-md text-green-600 text-sm mb-4">
              Posizione rilevata! Mostro i ristoranti vicini.
            </div>
          )}
        </div>
        
        {/* Filtro distanza - visibile solo se l'utente ha condiviso la posizione */}
        {userPosition && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Sliders size={18} className="text-primary" />
              <h3 className="font-medium">Filtra per distanza massima: {maxDistance} km</h3>
            </div>
            <Slider
              defaultValue={[100]}
              max={100}
              min={1}
              step={1}
              value={[maxDistance]}
              onValueChange={handleDistanceChange}
              className="my-4"
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
            {/* Map takes 50vh - half the screen height */}
            <div className="h-[50vh] rounded-lg border overflow-hidden">
              <RestaurantMap 
                userLocation={userPosition}
                restaurants={restaurants}
              />
            </div>
            
            {/* Restaurant list below the map */}
            <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="p-3 bg-gray-50 border-b">
                <h4 className="font-medium">
                  {isLoading ? 'Caricamento ristoranti...' : 
                   restaurants.length > 0 ? `Ristoranti trovati (${restaurants.length})` : 
                   'Nessun ristorante trovato'}
                </h4>
              </div>
              <div className="max-h-[40vh] overflow-y-auto">
                {isLoading ? (
                  <div className="p-4 text-center">
                    <div className="animate-pulse h-6 w-24 bg-gray-200 rounded mx-auto"></div>
                  </div>
                ) : restaurants.length > 0 ? (
                  restaurants.map(restaurant => (
                    <div 
                      key={restaurant.id} 
                      className="bg-white p-3 m-2 rounded-lg shadow-sm flex items-start gap-2 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => {/* Navigate to restaurant details */}}
                    >
                      <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h5 className="font-medium">{restaurant.name}</h5>
                        <p className="text-sm text-gray-600">{restaurant.address}</p>
                        <p className="text-sm font-medium text-primary">{restaurant.distance}</p>
                      </div>
                      <Button variant="outline" size="icon" className="h-8 w-8 flex-shrink-0">
                        <Navigation className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    {userPosition ? 'Nessun ristorante trovato entro la distanza selezionata.' : 
                     'Condividi la tua posizione per trovare ristoranti nelle vicinanze.'}
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
