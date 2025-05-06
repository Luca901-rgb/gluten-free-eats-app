
import React from 'react';
import { Navigation, Wheat } from 'lucide-react';
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
      // Fallback to traditional navigation
      window.location.href = `/restaurant/${id}`;
    }
  };
  
  // Function to open Google Maps
  const handleNavigateClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents card onClick activation
    
    if (location) {
      // Open Google Maps at restaurant location
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`;
      window.open(googleMapsUrl, '_blank');
      toast.success('Apertura mappa del ristorante');
    } else {
      toast.error('Coordinate del ristorante non disponibili');
    }
  };

  // Highlight the sample restaurant (Keccabio)
  const isKeccabio = id === '1';

  return (
    <Card 
      className={`overflow-hidden transition-all duration-300 hover:shadow-md cursor-pointer animate-fade-in ${isKeccabio ? 'border-green-500 border-2' : ''}`}
      onClick={handleCardClick}
    >
      <div className="relative h-40">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback if image doesn't load
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
        <div className="absolute top-2 right-2 flex gap-2">
          <button 
            className="p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors"
            onClick={handleNavigateClick}
            title="Apri in Google Maps"
            aria-label="Apri in Google Maps"
          >
            <Navigation 
              size={16} 
              className="text-primary" 
            />
          </button>
        </div>
        {isKeccabio && (
          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
            Consigliato
          </div>
        )}
      </div>
      <CardContent className="p-3">
        <div className="flex justify-between items-start">
          <h3 className={`font-poppins font-semibold text-sm mb-1 ${isKeccabio ? 'text-green-700' : 'text-primary'}`}>{name}</h3>
        </div>
        <div className="flex items-center mb-1">
          <StarRating rating={rating} size={14} />
          <span className="text-xs text-gray-600 ml-2">{reviews} recensioni</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-700">{cuisine}</span>
          {distance && (
            <span className="text-gray-500 flex items-center">
              <Navigation className="w-3 h-3 mr-1" />
              {distance}
            </span>
          )}
        </div>
        {hasGlutenFreeOptions && (
          <div className="mt-2">
            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full flex items-center justify-center">
              <Wheat className="w-3 h-3 mr-1 text-green-700" />
              100% Gluten Free
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RestaurantCard;
