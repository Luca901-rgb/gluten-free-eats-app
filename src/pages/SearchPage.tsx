
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChefHat, MapPin, Navigation, Info, AlertTriangle } from 'lucide-react';
import { RestaurantMap } from '@/components/Map/RestaurantMap';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { isInAvailableRegion, requestGeolocationPermission, checkGeolocationPermission } from '@/utils/geolocation';

const sampleRestaurantLocations = [
  {
    id: '1',
    name: 'La Trattoria Senza Glutine',
    location: { lat: 45.4642, lng: 9.1900 }, // Milano
    address: 'Via Roma 123, Milano',
    distance: '0.8 km',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviews: 128,
    cuisine: 'Italiana',
    isFavorite: false,
  },
  {
    id: '2',
    name: 'Pizzeria Gluten Free',
    location: { lat: 45.4649, lng: 9.1880 }, // Milano nearby
    address: 'Via Dante 45, Milano',
    distance: '1.2 km',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.5,
    reviews: 95,
    cuisine: 'Pizzeria',
    isFavorite: true,
  },
  {
    id: '3',
    name: 'Pasta & Risotti',
    location: { lat: 45.4710, lng: 9.1930 }, // Milano nearby
    address: 'Piazza Duomo 10, Milano',
    distance: '2.5 km',
    image: 'https://images.unsplash.com/photo-1458644267420-66bc8a5f21e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.3,
    reviews: 72,
    cuisine: 'Italiana',
    isFavorite: false,
  },
];

const SearchPage = () => {
  const [userPosition, setUserPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [restaurants, setRestaurants] = useState(sampleRestaurantLocations);
  const [inAvailableRegion, setInAvailableRegion] = useState<boolean | null>(null);
  const [permissionState, setPermissionState] = useState<string | null>(null);
  
  /**
   * Controlla lo stato dei permessi di geolocalizzazione
   */
  const checkPermissionStatus = async () => {
    const hasPermission = await checkGeolocationPermission();
    setPermissionState(hasPermission ? 'granted' : 'denied');
    return hasPermission;
  };
  
  const getUserLocation = async () => {
    setIsLocating(true);
    setLocationError(null);
    
    try {
      // Richiedi i permessi esplicitamente (ideale su dispositivi mobili)
      const permissionGranted = await requestGeolocationPermission();
      
      if (!permissionGranted) {
        setLocationError("Permessi di posizione non concessi. Verifica le impostazioni del dispositivo.");
        setIsLocating(false);
        toast.error("Impossibile accedere alla posizione. Controlla i permessi del dispositivo nelle impostazioni.");
        return;
      }
    
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            
            setUserPosition(pos);
            
            const regionCheck = isInAvailableRegion(pos);
            setInAvailableRegion(regionCheck.inRegion);
            
            if (regionCheck.inRegion) {
              toast.success(`Posizione rilevata in ${regionCheck.regionName}!`);
            } else {
              toast.warning("La tua posizione è al di fuori dell'area del programma pilota (solo Campania).");
            }
            
            setIsLocating(false);
          },
          (error) => {
            console.error('Error getting location:', error);
            
            let errorMessage = "Impossibile determinare la tua posizione.";
            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMessage = "Accesso alla posizione negato. Verifica i permessi del dispositivo nelle impostazioni.";
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
    
    // Richiediamo la posizione solo al click per una migliore UX mobile
    // invece che all'avvio automatico della pagina
  }, []);
  
  const handleToggleFavorite = (id: string) => {
    setRestaurants(restaurants.map(restaurant => 
      restaurant.id === id 
        ? { ...restaurant, isFavorite: !restaurant.isFavorite } 
        : restaurant
    ));
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
        {permissionState === 'denied' && !locationError && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Permessi posizione non concessi</AlertTitle>
            <AlertDescription>
              Per utilizzare tutte le funzionalità dell&apos;app, attiva la geolocalizzazione nelle impostazioni del dispositivo.
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
            <div className="p-2 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm mb-4">
              {locationError}
            </div>
          )}
          
          {userPosition && !locationError && inAvailableRegion && (
            <div className="p-2 bg-green-50 border border-green-200 rounded-md text-green-600 text-sm mb-4">
              Posizione rilevata! Mostro i ristoranti vicini.
            </div>
          )}
        </div>
        
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
                <h4 className="font-medium">Lista Ristoranti</h4>
              </div>
              <div className="max-h-[40vh] overflow-y-auto">
                {restaurants.map(restaurant => (
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
                ))}
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
