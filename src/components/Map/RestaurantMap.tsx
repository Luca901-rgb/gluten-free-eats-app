
import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

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
  
  // Initialize map when component mounts
  useEffect(() => {
    if (!mapContainer.current) return;
    
    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    const initialCenter = userLocation || 
      (restaurants.length > 0 ? 
        { lng: restaurants[0].location.lng, lat: restaurants[0].location.lat } : 
        { lng: 12.4964, lat: 41.9028 }); // Default to Rome if no location
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [initialCenter.lng, initialCenter.lat],
      zoom: 13
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl(), 'top-right'
    );

    // Clean up on unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Add markers when map is loaded and when restaurants or user location changes
  useEffect(() => {
    if (!map.current) return;

    // Wait for map to load before adding markers
    const addMarkers = () => {
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
    };

    if (map.current.loaded()) {
      addMarkers();
    } else {
      map.current.on('load', addMarkers);
    }
  }, [restaurants, userLocation]);

  return (
    <div ref={mapContainer} className="h-full w-full" />
  );
};
