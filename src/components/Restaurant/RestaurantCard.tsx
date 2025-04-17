
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Navigation } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import StarRating from '@/components/common/StarRating';
import { toast } from 'sonner';

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  cuisine: string;
  description?: string;
  address?: string;
  distance?: string;
  location?: {
    lat: number;
    lng: number;
  };
  isFavorite?: boolean;
  hasGlutenFreeOptions?: boolean;
  distanceValue?: number;
}

interface RestaurantCardProps {
  restaurant: Restaurant;
  onToggleFavorite?: (id: string) => void;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ 
  restaurant, 
  onToggleFavorite 
}) => {
  const navigate = useNavigate();
  const { id, name, image, rating, reviews, cuisine, distance, isFavorite, location } = restaurant;

  const handleCardClick = () => {
    navigate(`/restaurant/${id}`);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(id);
    }
  };
  
  // Funzione per aprire Google Maps
  const handleNavigateClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Previene l'attivazione dell'onClick del Card
    
    if (location) {
      // Apri Google Maps nella posizione del ristorante
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`;
      window.open(googleMapsUrl, '_blank');
      toast.success('Apertura mappa del ristorante');
    } else {
      toast.error('Coordinate del ristorante non disponibili');
    }
  };

  return (
    <Card 
      className="overflow-hidden transition-all duration-300 hover:shadow-md cursor-pointer animate-fade-in"
      onClick={handleCardClick}
    >
      <div className="relative h-48">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          {location && (
            <button 
              className="p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
              onClick={handleNavigateClick}
              title="Apri in Google Maps"
              aria-label="Apri in Google Maps"
            >
              <Navigation 
                size={20} 
                className="text-primary" 
              />
            </button>
          )}
          <button 
            className="p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
            onClick={handleFavoriteClick}
            title={isFavorite ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
            aria-label={isFavorite ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
          >
            <Heart 
              size={20} 
              className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-500"} 
            />
          </button>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-poppins font-semibold text-lg mb-1 text-primary">{name}</h3>
        <div className="flex items-center mb-2">
          <StarRating rating={rating} />
          <span className="text-sm text-gray-600 ml-2">{reviews} recensioni</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-700">{cuisine}</span>
          {distance && <span className="text-sm text-gray-500">{distance}</span>}
        </div>
        {restaurant.hasGlutenFreeOptions && (
          <div className="mt-2">
            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
              100% Gluten Free
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RestaurantCard;
