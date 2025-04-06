
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChefHat, MapPin, Navigation, List, Map, Info } from 'lucide-react';
import { RestaurantMap } from '@/components/Map/RestaurantMap';
import { toast } from 'sonner';
import RestaurantCard from '@/components/Restaurant/RestaurantCard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { isInAvailableRegion } from '@/utils/geolocation';

// Sample restaurant location data (would come from API in production)
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
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [inAvailableRegion, setInAvailableRegion] = useState<boolean | null>(null);
  
  // Get user's location if allowed
  const getUserLocation = () => {
    setIsLocating(true);
    setLocationError(null);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          setUserPosition(pos);
          
          // Verifica se l'utente è nella regione disponibile
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
              errorMessage = "Accesso alla posizione negato. Verifica i permessi del browser.";
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
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      const errorMessage = "Il tuo browser non supporta la geolocalizzazione.";
      setLocationError(errorMessage);
      setIsLocating(false);
      toast.error(errorMessage);
    }
  };
  
  // Effect to prompt for location on page load
  useEffect(() => {
    getUserLocation();
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
              La tua posizione attuale è al di fuori di quest'area.
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
        
        {/* View toggle buttons */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <Button 
              variant={viewMode === 'map' ? 'default' : 'outline'} 
              className="rounded-r-none"
              onClick={() => setViewMode('map')}
            >
              <Map size={18} className="mr-1" /> Mappa
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'default' : 'outline'} 
              className="rounded-l-none"
              onClick={() => setViewMode('list')}
            >
              <List size={18} className="mr-1" /> Lista
            </Button>
          </div>
        </div>
        
        {/* Map or List View */}
        {inAvailableRegion ? (
          viewMode === 'map' ? (
            <div className="h-[60vh] rounded-lg border overflow-hidden mb-4">
              <RestaurantMap 
                userLocation={userPosition}
                restaurants={restaurants}
              />
            </div>
          ) : (
            <div className="space-y-4">
              {restaurants.map(restaurant => (
                <RestaurantCard 
                  key={restaurant.id} 
                  restaurant={restaurant}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          )
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
      </div>
    </Layout>
  );
};

export default SearchPage;
