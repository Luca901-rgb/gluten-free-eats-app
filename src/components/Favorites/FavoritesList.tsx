
import React, { useEffect } from 'react';
import { Restaurant } from '@/components/Restaurant/RestaurantCard';
import RestaurantCard from '@/components/Restaurant/RestaurantCard';

interface FavoritesListProps {
  favorites: Restaurant[];
  onToggleFavorite: (id: string) => void;
  isLoading?: boolean;
}

const FavoritesList: React.FC<FavoritesListProps> = ({ favorites, onToggleFavorite, isLoading = false }) => {
  useEffect(() => {
    console.log("FavoritesList rendered with", favorites.length, "preferiti:", favorites);
  }, [favorites]);

  if (isLoading) {
    return <div className="text-center py-4">Caricamento preferiti...</div>;
  }

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
          onToggleFavorite={() => onToggleFavorite(restaurant.id)}
        />
      ))}
    </div>
  );
};

export default FavoritesList;
