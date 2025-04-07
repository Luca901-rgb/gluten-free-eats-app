
import React, { useEffect, FC } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { MapPin, Navigation } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Define interfaces
interface Restaurant {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  address: string;
  distance: string;
}

interface RestaurantMapProps {
  userLocation: { lat: number; lng: number } | null;
  restaurants: Restaurant[];
}

// Component to set the map view based on locations
const SetMapView: FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

export const RestaurantMap: FC<RestaurantMapProps> = ({ 
  userLocation, 
  restaurants 
}) => {
  const navigate = useNavigate();
  // Default center if no user location is provided (centered on Italy)
  const defaultCenter: [number, number] = [41.9028, 12.4964];
  const center: [number, number] = userLocation ? [userLocation.lat, userLocation.lng] : defaultCenter;
  const zoom = userLocation ? 13 : 6;
  
  // Custom restaurant marker icon
  const restaurantIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
  
  // Blue icon for user location
  const userIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const navigateToRestaurant = (restaurantId: string, lat: number, lng: number) => {
    // Navigate to the restaurant details page
    navigate(`/restaurant/${restaurantId}`);
    
    // In a real app, you might also launch navigation in Google Maps
    // This code demonstrates how to open Google Maps with directions
    if (userLocation) {
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${lat},${lng}&travelmode=driving`;
      window.open(googleMapsUrl, '_blank');
      toast.success('Apertura navigazione verso il ristorante');
    }
  };

  return (
    <div className="h-full w-full flex flex-col">
      <h3 className="text-lg font-medium text-gray-900 mb-3">Ristoranti nelle vicinanze</h3>
      
      {/* The map container */}
      <div className="flex-1 rounded-lg overflow-hidden border border-gray-200 shadow-sm mb-4">
        {/* @ts-ignore - Ignoring TypeScript issues with react-leaflet props */}
        <MapContainer 
          style={{ height: '100%', width: '100%' }}
          center={center}
          zoom={zoom}
          className="z-0"
        >
          {/* @ts-ignore - Ignoring TypeScript issues with react-leaflet props */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* Dynamic center recalculation when userLocation changes */}
          <SetMapView center={center} zoom={zoom} />
          
          {/* User location marker */}
          {userLocation && (
            /* @ts-ignore - Ignoring TypeScript issues with react-leaflet props */
            <Marker 
              position={[userLocation.lat, userLocation.lng]}
              icon={userIcon}
            >
              <Popup>
                <div className="text-sm font-medium">La tua posizione</div>
              </Popup>
            </Marker>
          )}
          
          {/* Restaurant markers */}
          {restaurants.map(restaurant => (
            /* @ts-ignore - Ignoring TypeScript issues with react-leaflet props */
            <Marker 
              key={restaurant.id} 
              position={[restaurant.location.lat, restaurant.location.lng]}
              icon={restaurantIcon}
            >
              <Popup>
                <div className="text-center">
                  <h5 className="font-medium">{restaurant.name}</h5>
                  <p className="text-sm text-gray-600">{restaurant.address}</p>
                  <p className="text-sm font-medium text-primary">{restaurant.distance}</p>
                  <Button 
                    onClick={() => navigateToRestaurant(restaurant.id, restaurant.location.lat, restaurant.location.lng)}
                    className="mt-2 w-full"
                    size="sm"
                  >
                    <Navigation className="mr-1 h-4 w-4" /> Vai da qui
                  </Button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      
      {/* List of restaurants below the map */}
      <div className="w-full space-y-3 bg-gray-50 p-3 rounded-lg overflow-auto max-h-48">
        {restaurants.map(restaurant => (
          <div 
            key={restaurant.id} 
            className="bg-white p-3 rounded-lg shadow-sm flex items-start gap-2 hover:bg-gray-50 cursor-pointer"
            onClick={() => navigateToRestaurant(restaurant.id, restaurant.location.lat, restaurant.location.lng)}
          >
            <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h5 className="font-medium">{restaurant.name}</h5>
              <p className="text-sm text-gray-600">{restaurant.address}</p>
              <p className="text-sm font-medium text-primary">{restaurant.distance}</p>
            </div>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Navigation className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      
      {userLocation && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
          <p className="text-sm text-blue-700">
            <span className="font-medium">La tua posizione attuale:</span> 
            {' '}Lat: {userLocation.lat.toFixed(4)}, Lng: {userLocation.lng.toFixed(4)}
          </p>
        </div>
      )}
    </div>
  );
};
