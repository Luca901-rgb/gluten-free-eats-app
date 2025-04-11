import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import StarRating from '@/components/common/StarRating';

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
  isFavorite?: boolean;
  hasGlutenFreeOptions?: boolean;
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
  const { id, name, image, rating, reviews, cuisine, distance, isFavorite } = restaurant;

  const handleCardClick = () => {
    navigate(`/restaurant/${id}`);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(id);
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
        <button 
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
          onClick={handleFavoriteClick}
        >
          <Heart 
            size={20} 
            className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-500"} 
          />
        </button>
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
      </CardContent>
    </Card>
  );
};

export default RestaurantCard;
