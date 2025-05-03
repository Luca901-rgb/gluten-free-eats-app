
import React from 'react';
import { Restaurant } from '@/components/Restaurant/RestaurantCard';
import RestaurantCard from '@/components/Restaurant/RestaurantCard';
import { toast } from 'sonner';

interface FavoritesListProps {
  favorites: Restaurant[];
  onToggleFavorite: (id: string) => void;
}

const FavoritesList: React.FC<FavoritesListProps> = ({ favorites, onToggleFavorite }) => {
  // Verifica se abbiamo dei preferiti da mostrare
  if (!favorites || favorites.length === 0) {
    console.log("Nessun ristorante preferito trovato");
    return null;
  }

  console.log("Rendering FavoritesList con", favorites.length, "preferiti:", favorites);

  return (
    <div className="space-y-4">
      {favorites.map(restaurant => {
        console.log("Rendering restaurant:", restaurant.id, restaurant.name);
        return (
          <RestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
            onToggleFavorite={onToggleFavorite}
          />
        );
      })}
    </div>
  );
};

export default FavoritesList;
