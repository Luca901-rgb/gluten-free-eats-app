
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AlertCircle, MapPin } from 'lucide-react';

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

// Create custom icons for the map
const createIcon = (color: string) => new Icon({
  iconUrl: `https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const userIcon = createIcon('blue');
const restaurantIcon = createIcon('red');

export const RestaurantMap: React.FC<RestaurantMapProps> = ({ 
  userLocation, 
  restaurants 
}) => {
  // Calculate center position
  const defaultCenter = [41.9028, 12.4964]; // Default: Rome, Italy
  
  const centerLat = userLocation?.lat || (restaurants[0]?.location.lat || defaultCenter[0]);
  const centerLng = userLocation?.lng || (restaurants[0]?.location.lng || defaultCenter[1]);
  
  const [mapError, setMapError] = React.useState<string | null>(null);

  // Handle map load errors
  React.useEffect(() => {
    const handleError = () => {
      setMapError("Si è verificato un errore durante il caricamento della mappa.");
    };

    window.addEventListener('error', handleError);
    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);

  // If there's an error loading the map, show fallback UI
  if (mapError) {
    return (
      <div className="h-full w-full bg-gray-100 flex flex-col items-center justify-center p-4 rounded-lg text-center">
        <AlertCircle className="h-12 w-12 text-amber-500 mb-2" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">Mappa non disponibile</h3>
        <p className="text-gray-600 mb-4">{mapError}</p>
        
        <div className="w-full max-w-md space-y-3 mt-2">
          <h4 className="font-medium text-left">Ristoranti nelle vicinanze:</h4>
          {restaurants.map(restaurant => (
            <div key={restaurant.id} className="bg-white p-3 rounded-lg shadow-sm flex items-start gap-2">
              <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="font-medium">{restaurant.name}</h5>
                <p className="text-sm text-gray-600">{restaurant.address}</p>
                <p className="text-sm font-medium text-primary">{restaurant.distance}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <MapContainer 
      center={[centerLat, centerLng]}
      zoom={13} 
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {/* Add user location marker if available */}
      {userLocation && (
        <Marker 
          position={[userLocation.lat, userLocation.lng]}
        >
          <Popup>
            <strong>La tua posizione</strong>
          </Popup>
        </Marker>
      )}
      
      {/* Add restaurant markers */}
      {restaurants.map(restaurant => (
        <Marker 
          key={restaurant.id}
          position={[restaurant.location.lat, restaurant.location.lng]}
        >
          <Popup>
            <div>
              <strong>{restaurant.name}</strong>
              <p>{restaurant.address}</p>
              <p>Distanza: {restaurant.distance}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};
