
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChefHat, MapPin, Navigation } from 'lucide-react';
import { RestaurantMap } from '@/components/Map/RestaurantMap';
import { toast } from 'sonner';

// Sample restaurant location data (would come from API in production)
const sampleRestaurantLocations = [
  {
    id: '1',
    name: 'La Trattoria Senza Glutine',
    location: { lat: 45.4642, lng: 9.1900 }, // Milano
    address: 'Via Roma 123, Milano',
    distance: '0.8 km',
  },
  {
    id: '2',
    name: 'Pizzeria Gluten Free',
    location: { lat: 45.4649, lng: 9.1880 }, // Milano nearby
    address: 'Via Dante 45, Milano',
    distance: '1.2 km',
  },
  {
    id: '3',
    name: 'Pasta & Risotti',
    location: { lat: 45.4710, lng: 9.1930 }, // Milano nearby
    address: 'Piazza Duomo 10, Milano',
    distance: '2.5 km',
  },
];

const SearchPage = () => {
  const [userPosition, setUserPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [restaurants, setRestaurants] = useState(sampleRestaurantLocations);
  
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
          setIsLocating(false);
          toast.success("Posizione rilevata con successo!");
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
          
          {userPosition && !locationError && (
            <div className="p-2 bg-green-50 border border-green-200 rounded-md text-green-600 text-sm mb-4">
              Posizione rilevata! Mostro i ristoranti vicini.
            </div>
          )}
        </div>
        
        {/* Map Component replaced with list view */}
        <div className="h-[60vh] rounded-lg border overflow-hidden mb-4">
          <RestaurantMap 
            userLocation={userPosition}
            restaurants={restaurants}
          />
        </div>
      </div>
    </Layout>
  );
};

export default SearchPage;
