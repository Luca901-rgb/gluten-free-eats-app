
import React from 'react';
import { Navigation } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import StarRating from '@/components/common/StarRating';
import { toast } from 'sonner';
import { Restaurant } from '@/types/restaurant';

// Define card props interface that uses the imported Restaurant type
interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick?: () => void;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ 
  restaurant, 
  onClick
}) => {
  const { id, name, image, rating, reviews, cuisine, distance, location, hasGlutenFreeOptions } = restaurant;

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Fallback alla navigazione tradizionale
      window.location.href = `/restaurant/${id}`;
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
          onError={(e) => {
            // Fallback se l'immagine non si carica
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
        <div className="absolute top-3 right-3 flex gap-2">
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
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-poppins font-semibold text-lg mb-1 text-primary">{name}</h3>
        </div>
        <div className="flex items-center mb-2">
          <StarRating rating={rating} />
          <span className="text-xs text-gray-600 ml-2">{reviews} recensioni</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-700">{cuisine}</span>
          {distance && (
            <span className="text-xs text-gray-500 flex items-center">
              <Navigation className="w-4 h-4 mr-1" />
              {distance}
            </span>
          )}
        </div>
        {hasGlutenFreeOptions && (
          <div className="mt-2">
            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full flex items-center justify-center">
              <img src="/lovable-uploads/cb016c24-7700-4927-b5e2-40af08e4b219.png" alt="Spiga" className="w-3 h-3 mr-1" />
              100% Gluten Free
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RestaurantCard;
