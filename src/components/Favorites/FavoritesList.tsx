
import React from 'react';
import { Restaurant } from '@/types/restaurant';
import RestaurantCard from '@/components/Restaurant/RestaurantCard';

interface FavoritesListProps {
  favorites: Restaurant[];
  onToggleFavorite: (id: string) => void;
}

const FavoritesList: React.FC<FavoritesListProps> = ({ favorites, onToggleFavorite }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {favorites.map(restaurant => (
        <div key={restaurant.id} className="relative">
          <RestaurantCard
            restaurant={restaurant}
            onClick={() => window.location.href = `/restaurant/${restaurant.id}`}
          />
          <button
            onClick={() => onToggleFavorite(restaurant.id)}
            className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition shadow-sm"
            title="Rimuovi dai preferiti"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="w-5 h-5 text-red-500"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};

export default FavoritesList;
