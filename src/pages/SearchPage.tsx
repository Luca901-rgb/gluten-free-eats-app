import React, { useState, useEffect, useCallback } from 'react';
import Layout from '@/components/Layout';
import { useSearchParams } from 'react-router-dom';
import { useRestaurantList, RegionStatus } from '@/hooks/useRestaurantList';
import { Restaurant } from '@/types/restaurant';
import { toast } from 'sonner';
import { CheckCircle, AlertTriangle, MapPin, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserLocation } from '@/hooks/useUserLocation';
import { RestaurantMap } from '@/components/Map/RestaurantMap';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const { restaurants, isLoading, regionStatus, userLocation, getUserLocation } = useRestaurantList();
  const [userPosition, setUserPosition] = useState<{ lat: number | null, lng: number | null }>({ lat: null, lng: null });
  const [locationPermission, setLocationPermission] = useState<PermissionState | null>(null);
  const [inAvailableRegion, setInAvailableRegion] = useState<boolean | null>(null);
  const [distanceFilter, setDistanceFilter] = useState<number | null>(null);
  const [isMiles, setIsMiles] = useState(false);
  const { checkPermissionStatus } = useUserLocation();

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = isMiles ? 3958.8 : 6371; // Radius of earth in miles or kilometers
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in miles or kilometers
    return distance.toFixed(1);
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180)
  }

  const fetchRestaurants = useCallback(async () => {
    if (userPosition.lat && userPosition.lng && restaurants) {
      const updatedRestaurants = restaurants.map(restaurant => {
        if (restaurant.location?.lat && restaurant.location?.lng) {
          const distance = calculateDistance(
            userPosition.lat,
            userPosition.lng,
            restaurant.location.lat,
            restaurant.location.lng
          );
          return { ...restaurant, distance: `${distance} ${isMiles ? 'mi' : 'km'}` };
        }
        return restaurant;
      });
    }
  }, [userPosition, restaurants, isMiles]);

  useEffect(() => {
    const getInitialLocation = async () => {
      const location = searchParams.get('location');
      if (location) {
        try {
          const [lat, lng] = location.split(',').map(parseFloat);
          if (!isNaN(lat) && !isNaN(lng)) {
            setUserPosition({ lat, lng });
          } else {
            toast.error("Invalid location coordinates in URL");
          }
        } catch (error) {
          toast.error("Error parsing location from URL");
        }
      } else {
        await getUserLocation();
      }
    };

    getInitialLocation();
  }, [searchParams, getUserLocation]);

  useEffect(() => {
    const checkRegionStatus = () => {
      if (regionStatus) {
        setInAvailableRegion(regionStatus.inRegion);
      }
    };

    checkRegionStatus();
  }, [regionStatus]);

  useEffect(() => {
    const getPermission = async () => {
      const permission = await checkPermissionStatus();
      setLocationPermission(permission);
    };

    getPermission();
  }, [checkPermissionStatus]);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  const handleGetUserLocation = async () => {
    try {
      await getUserLocation();
    } catch (error) {
      console.error("Error getting user location:", error);
      toast.error("Failed to retrieve user location");
    }
  };

  const handleDistanceFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setDistanceFilter(value === 'any' ? null : parseFloat(value));
  };

  // Add navigation handler for restaurant details
  const navigateToRestaurantDetails = (restaurantId: string) => {
    window.location.href = `/restaurant/${restaurantId}`;
  };

  return (
    <Layout>
      <div className="p-4">
        {/* Header with title and button */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Cerca Ristoranti</h1>
          <Button onClick={handleGetUserLocation}>
            Aggiorna posizione
          </Button>
        </div>
        
        {/* Region alerts and permission alerts */}
        {regionStatus && regionStatus.error && (
          <div className="rounded-md bg-red-50 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Errore di localizzazione
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{regionStatus.error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {locationPermission === 'denied' && (
          <div className="rounded-md bg-yellow-50 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Permessi di localizzazione disabilitati
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>Per favore abilita i permessi di localizzazione per una migliore esperienza.</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* User location button and states */}
        {userPosition.lat && userPosition.lng && (
          <div className="rounded-md bg-green-50 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Posizione rilevata
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>Latitudine: {userPosition.lat}, Longitudine: {userPosition.lng}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Distance filter */}
        <div className="mb-4">
          <label htmlFor="distance" className="block text-sm font-medium text-gray-700">
            Filtra per distanza massima:
          </label>
          <select
            id="distance"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
            defaultValue="any"
            onChange={handleDistanceFilterChange}
          >
            <option value="any">Qualsiasi distanza</option>
            <option value="5">5 km</option>
            <option value="10">10 km</option>
            <option value="20">20 km</option>
          </select>
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
                      onClick={() => navigateToRestaurantDetails(restaurant.id)}
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
                          e.stopPropagation();
                          if (restaurant.location) {
                            const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${restaurant.location.lat},${restaurant.location.lng}`;
                            window.open(googleMapsUrl, '_blank');
                          }
                        }}
                      >
                        <Navigation className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center">
                    <p className="text-gray-500">Nessun ristorante trovato in questa zona.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Regione non disponibile
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>La tua regione non è ancora supportata. Riprova più tardi.</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* User position display */}
        {userPosition.lat && userPosition.lng && (
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              La tua posizione: Latitudine {userPosition.lat}, Longitudine {userPosition.lng}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SearchPage;
