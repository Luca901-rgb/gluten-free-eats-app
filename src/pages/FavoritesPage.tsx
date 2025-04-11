
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Heart, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import RestaurantCard, { Restaurant } from '@/components/Restaurant/RestaurantCard';
import { toast } from 'sonner';

const FavoritesPage = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data from an API
    const loadFavorites = () => {
      setIsLoading(true);
      // In a real app, this would be an API call
      setTimeout(() => {
        // Setting empty array as we removed sample data
        setFavorites([]);
        setIsLoading(false);
      }, 800);
    };

    loadFavorites();
  }, []);

  const handleToggleFavorite = (id: string) => {
    const updatedFavorites = favorites.filter(restaurant => restaurant.id !== id);
    setFavorites(updatedFavorites);
    toast.success('Ristorante rimosso dai preferiti');
  };

  return (
    <Layout>
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-poppins font-bold text-primary">I miei preferiti</h1>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            <p className="text-gray-500">Caricamento preferiti...</p>
          </div>
        ) : favorites.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {favorites.map(restaurant => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="bg-secondary/20 rounded-lg p-8 text-center">
            <Heart size={32} className="mx-auto mb-3 text-primary" />
            <p className="text-gray-700 mb-4">Non hai ancora ristoranti preferiti</p>
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <Search size={16} />
              Esplora ristoranti
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FavoritesPage;
