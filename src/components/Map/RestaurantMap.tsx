
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { AlertCircle, MapPin } from 'lucide-react';

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

// Token Mapbox predefinito per l'applicazione
const MAPBOX_TOKEN = 'pk.eyJ1IjoibG92YWJsZS1haS1kZW1vIiwiYSI6ImNscHJ6NnUyOTBxOHEycWxlZ3Q4ajYwcnEifQ.RRzh8g7xRyR9OzMVdWt4cA';

export const RestaurantMap: React.FC<RestaurantMapProps> = ({ 
  userLocation, 
  restaurants 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapError, setMapError] = useState<string | null>(null);
  
  // Initialize map when component mounts
  useEffect(() => {
    if (!mapContainer.current) return;
    
    try {
      mapboxgl.accessToken = MAPBOX_TOKEN;
      
      const initialCenter = userLocation || 
        (restaurants.length > 0 ? 
          { lng: restaurants[0].location.lng, lat: restaurants[0].location.lat } : 
          { lng: 12.4964, lat: 41.9028 }); // Default to Rome if no location
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [initialCenter.lng, initialCenter.lat],
        zoom: 13,
        failIfMajorPerformanceCaveat: false // Try to render even with performance issues
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl(), 'top-right'
      );

      // Check for map load errors
      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        setMapError('Si è verificato un errore durante il caricamento della mappa.');
      });

      // Clean up on unmount
      return () => {
        if (map.current) {
          map.current.remove();
          map.current = null;
        }
      };
    } catch (err) {
      console.error('Map initialization error:', err);
      setMapError('Impossibile inizializzare la mappa. Il tuo browser potrebbe non supportare WebGL.');
    }
  }, []);

  // Add markers when map is loaded and when restaurants or user location changes
  useEffect(() => {
    if (!map.current || mapError) return;

    // Wait for map to load before adding markers
    const addMarkers = () => {
      try {
        // Clear existing markers
        markers.current.forEach(marker => marker.remove());
        markers.current = [];

        // Add user location marker if available
        if (userLocation) {
          const userMarker = new mapboxgl.Marker({
            color: '#3b82f6', // Blue marker
            scale: 0.8
          })
            .setLngLat([userLocation.lng, userLocation.lat])
            .addTo(map.current!);
          
          // Add popup for user marker
          new mapboxgl.Popup({
            offset: 25,
            closeButton: false
          })
            .setLngLat([userLocation.lng, userLocation.lat])
            .setHTML('<strong>La tua posizione</strong>')
            .addTo(map.current!);
            
          markers.current.push(userMarker);
          
          // Center map on user location
          map.current!.flyTo({
            center: [userLocation.lng, userLocation.lat],
            essential: true,
            zoom: 13
          });
        }

        // Add restaurant markers
        restaurants.forEach(restaurant => {
          const popup = new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <strong>${restaurant.name}</strong>
              <p>${restaurant.address}</p>
              <p>Distanza: ${restaurant.distance}</p>
            `);

          const marker = new mapboxgl.Marker({ color: "#FF5733" })
            .setLngLat([restaurant.location.lng, restaurant.location.lat])
            .setPopup(popup)
            .addTo(map.current!);
            
          markers.current.push(marker);
        });
        
        // If no user location but we have restaurants, fit bounds to restaurants
        if (!userLocation && restaurants.length > 0) {
          const bounds = new mapboxgl.LngLatBounds();
          restaurants.forEach(restaurant => {
            bounds.extend([restaurant.location.lng, restaurant.location.lat]);
          });
          
          map.current!.fitBounds(bounds, {
            padding: 70,
            maxZoom: 15
          });
        }
      } catch (err) {
        console.error('Error adding markers:', err);
        setMapError('Si è verificato un errore durante l\'aggiunta dei marker sulla mappa.');
      }
    };

    if (map.current.loaded()) {
      addMarkers();
    } else {
      map.current.on('load', addMarkers);
    }
  }, [restaurants, userLocation, mapError]);

  // Render fallback UI when map cannot be initialized
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
    <div ref={mapContainer} className="h-full w-full" />
  );
};
