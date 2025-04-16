
import React, { useEffect, FC } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Navigation } from 'lucide-react';
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
  
  // Coordiante di Napoli come centro di default per la Campania
  const campaniaCenter: [number, number] = [40.8518, 14.2681]; // Napoli
  
  // Default center if no user location is provided
  const defaultCenter: [number, number] = userLocation ? [userLocation.lat, userLocation.lng] : campaniaCenter;
  const zoom = userLocation ? 13 : 9; // Zoom out a bit per mostrare più della Campania quando non c'è posizione utente
  
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
    <div className="h-full w-full">
      <div className="h-full rounded-lg overflow-hidden border border-gray-200 shadow-sm">
        {/* 
          The issue is with the TypeScript type definitions for react-leaflet.
          We need to work around the type issues without using ts-ignore.
        */}
        <MapContainer 
          style={{ height: '100%', width: '100%' }} 
          className="z-0"
          key={`map-${defaultCenter[0]}-${defaultCenter[1]}-${zoom}`} // Force re-render when center/zoom changes
          // @ts-expect-error - center and zoom are valid props but TypeScript types are incorrect
          center={defaultCenter} 
          zoom={zoom}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            // @ts-expect-error - attribution is valid but TypeScript types are incorrect
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* Dynamic center recalculation when userLocation changes */}
          {userLocation && <SetMapView center={[userLocation.lat, userLocation.lng]} zoom={zoom} />}
          
          {/* User location marker */}
          {userLocation && (
            <Marker 
              position={[userLocation.lat, userLocation.lng]}
              // @ts-expect-error - icon is valid but TypeScript types are incorrect
              icon={userIcon}
            >
              <Popup>
                <div className="text-sm font-medium">La tua posizione</div>
              </Popup>
            </Marker>
          )}
          
          {/* Restaurant markers */}
          {restaurants.map(restaurant => (
            <Marker 
              key={restaurant.id} 
              position={[restaurant.location.lat, restaurant.location.lng]}
              // @ts-expect-error - icon is valid but TypeScript types are incorrect
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
    </div>
  );
};
