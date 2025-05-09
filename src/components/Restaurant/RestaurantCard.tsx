
import React from 'react';
import { Navigation, Wheat } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import StarRating from '@/components/common/StarRating';
import { toast } from 'sonner';
import { Restaurant } from '@/types/restaurant';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

// Define card props interface that uses the imported Restaurant type
interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick?: () => void;
  isHighlighted?: boolean;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ 
  restaurant, 
  onClick,
  isHighlighted = false
}) => {
  const navigate = useNavigate();
  const { id, name, image, rating, reviews, cuisine, distance, location, hasGlutenFreeOptions } = restaurant;

  const handleCardClick = () => {
    console.log("Restaurant card clicked for ID:", id);
    if (onClick) {
      onClick();
    } else {
      // Navigate using react-router
      navigate(`/restaurant/${id}`);
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

  // Check if this is Keccabio (the sample restaurant)
  const isKeccabio = id === '1';

  return isHighlighted ? (
    // Enhanced layout for highlighted card (Keccabio on featured section)
    <Card 
      className="overflow-hidden transition-all duration-300 hover:shadow-md cursor-pointer animate-fade-in border-green-500 border-2"
      onClick={handleCardClick}
    >
      <div className="relative">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-48 object-cover"
          onError={(e) => {
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
            <Navigation size={16} className="text-green-600" />
          </button>
        </div>
        <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
          Consigliato
        </div>
        <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
          <h2 className="text-2xl font-bold">{name}</h2>
          <div className="flex items-center mt-1">
            <StarRating rating={rating} className="text-yellow-400" />
            <span className="ml-2">{reviews} recensioni</span>
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="text-center mb-3">
          <span className="text-gray-700">{cuisine}</span>
        </div>
        
        <p className="text-gray-600 text-sm text-center mb-3">
          {restaurant.description?.substring(0, 100)}
          {restaurant.description && restaurant.description.length > 100 ? '...' : ''}
        </p>
        
        <div className="flex justify-center items-center">
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200 flex items-center gap-1">
            <Wheat className="w-3 h-3" />
            <span>100% Gluten Free</span>
          </Badge>
        </div>
      </CardContent>
    </Card>
  ) : (
    // Regular card for non-highlighted restaurants
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
