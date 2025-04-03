
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChefHat, MapPin, Navigation } from 'lucide-react';
import { RestaurantMap } from '@/components/Map/RestaurantMap';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);
  
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
        },
        (error) => {
          setLocationError("Impossibile determinare la tua posizione. Controlla le impostazioni di autorizzazione.");
          setIsLocating(false);
          console.error('Error getting location:', error);
        }
      );
    } else {
      setLocationError("Il tuo browser non supporta la geolocalizzazione.");
      setIsLocating(false);
    }
  };
  
  // Effect to prompt for location on page load
  useEffect(() => {
    getUserLocation();
  }, []);

  // Function to handle Mapbox token input
  const handleMapboxTokenSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const token = formData.get('mapboxToken') as string;
    if (token) {
      setMapboxToken(token);
      localStorage.setItem('mapbox_token', token);
    }
  };

  // Try to get token from localStorage on component mount
  useEffect(() => {
    const savedToken = localStorage.getItem('mapbox_token');
    if (savedToken) {
      setMapboxToken(savedToken);
    }
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
            <Navigation size={16} className="animate-pulse" />
            {isLocating ? "Localizzazione in corso..." : "Trova ristoranti vicino a me"}
          </Button>
          
          {locationError && (
            <div className="p-2 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm mb-4">
              {locationError}
            </div>
          )}
          
          {userPosition && (
            <div className="p-2 bg-green-50 border border-green-200 rounded-md text-green-600 text-sm mb-4">
              Posizione rilevata! Mostro i ristoranti vicini.
            </div>
          )}
        </div>
        
        {/* Mapbox token input dialog */}
        {!mapboxToken && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full mb-4">Inserisci Mapbox Token per visualizzare la mappa</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Inserisci il tuo token Mapbox</DialogTitle>
                <DialogDescription>
                  Per visualizzare la mappa dei ristoranti, è necessario un token pubblico di Mapbox. 
                  Puoi ottenere un token gratuito registrandoti su mapbox.com.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleMapboxTokenSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="mapboxToken" className="text-sm font-medium">
                    Token Mapbox
                  </label>
                  <input
                    id="mapboxToken"
                    name="mapboxToken"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="pk.eyJ1Ijoi..."
                    required
                  />
                </div>
                <Button type="submit" className="w-full">Salva Token</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
        
        {/* Map Component */}
        <div className="h-[60vh] rounded-lg border overflow-hidden mb-4">
          {mapboxToken ? (
            <RestaurantMap 
              accessToken={mapboxToken}
              userLocation={userPosition}
              restaurants={restaurants}
            />
          ) : (
            <div className="h-full flex items-center justify-center bg-gray-100">
              <div className="text-center p-4">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Inserisci il tuo token Mapbox per visualizzare la mappa</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Restaurant List */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-3">Ristoranti nelle vicinanze</h2>
          <div className="space-y-3">
            {restaurants.map(restaurant => (
              <div 
                key={restaurant.id}
                className="p-3 border rounded-lg flex items-center justify-between"
              >
                <div>
                  <h3 className="font-medium">{restaurant.name}</h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <MapPin size={14} className="mr-1" />
                    <span>{restaurant.address}</span>
                  </div>
                </div>
                <div>
                  <span className="text-sm bg-primary/10 text-primary py-1 px-2 rounded-full">
                    {restaurant.distance}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SearchPage;
