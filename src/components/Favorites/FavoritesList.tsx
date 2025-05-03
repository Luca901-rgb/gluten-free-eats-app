import React, { useEffect } from 'react';
import { Restaurant } from '@/components/Restaurant/RestaurantCard';
import RestaurantCard from '@/components/Restaurant/RestaurantCard';

interface FavoritesListProps {
  favorites: Restaurant[];
  onToggleFavorite: (id: string) => void;
}

const FavoritesList: React.FC<FavoritesListProps> = ({ favorites, onToggleFavorite }) => {
  useEffect(() => {
    console.log("FavoritesList montata con", favorites.length, "preferiti:", favorites);
  }, [favorites]);

  // Verifica se abbiamo dei preferiti da mostrare
  if (!favorites || favorites.length === 0) {
    console.log("Nessun ristorante preferito trovato");
    return <div className="text-center text-gray-500">Nessun ristorante nei preferiti</div>;
  }

  return (
    <div className="space-y-4">
      {favorites.map(restaurant => (
        <RestaurantCard
          key={restaurant.id}
          restaurant={restaurant}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
};

export default FavoritesList;
