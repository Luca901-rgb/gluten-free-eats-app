
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Heart, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import RestaurantCard, { Restaurant } from '@/components/Restaurant/RestaurantCard';
import { toast } from 'sonner';
import { db, auth } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, deleteDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const FavoritesPage = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      if (user) {
        fetchFavorites(user.uid);
      } else {
        setIsLoading(false);
        toast.error("Per vedere i preferiti devi effettuare l'accesso");
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchFavorites = async (userId: string) => {
    setIsLoading(true);
    try {
      // Get the user's favorites list
      const userFavoritesRef = doc(db, "userFavorites", userId);
      const userFavoritesDoc = await getDoc(userFavoritesRef);
      
      if (!userFavoritesDoc.exists() || !userFavoritesDoc.data().restaurantIds || userFavoritesDoc.data().restaurantIds.length === 0) {
        setFavorites([]);
        setIsLoading(false);
        return;
      }
      
      const favoriteIds = userFavoritesDoc.data().restaurantIds as string[];
      
      // Fetch each restaurant from the favorites list
      const restaurantsPromises = favoriteIds.map(async (id) => {
        const restaurantDoc = await getDoc(doc(db, "restaurants", id));
        if (restaurantDoc.exists()) {
          const data = restaurantDoc.data();
          return {
            id: restaurantDoc.id,
            name: data.name || 'Ristorante senza nome',
            description: data.description || 'Nessuna descrizione disponibile',
            address: data.address || 'Indirizzo non disponibile',
            image: data.coverImage || '/placeholder.svg',
            rating: data.rating || 0,
            reviews: data.reviews || 0,
            hasGlutenFreeOptions: data.hasGlutenFreeOptions || false,
            isFavorite: true
          } as Restaurant;
        }
        return null;
      });
      
      const restaurantsData = (await Promise.all(restaurantsPromises)).filter(r => r !== null) as Restaurant[];
      setFavorites(restaurantsData);
    } catch (error) {
      console.error("Errore durante il recupero dei preferiti:", error);
      toast.error("Si è verificato un errore nel caricamento dei preferiti");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFavorite = async (id: string) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast.error("Devi effettuare l'accesso per gestire i preferiti");
      return;
    }
    
    try {
      const userFavoritesRef = doc(db, "userFavorites", currentUser.uid);
      const userFavoritesDoc = await getDoc(userFavoritesRef);
      
      let userFavorites: string[] = [];
      if (userFavoritesDoc.exists()) {
        userFavorites = userFavoritesDoc.data().restaurantIds || [];
      }
      
      // Remove from favorites
      const updatedFavorites = userFavorites.filter(restaurantId => restaurantId !== id);
      
      // Update Firestore
      await setDoc(userFavoritesRef, { restaurantIds: updatedFavorites }, { merge: true });
      
      // Update local state
      setFavorites(prevFavorites => prevFavorites.filter(restaurant => restaurant.id !== id));
      
      toast.success("Ristorante rimosso dai preferiti");
    } catch (error) {
      console.error("Errore durante la rimozione dai preferiti:", error);
      toast.error("Si è verificato un errore durante la rimozione dai preferiti");
    }
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="p-4 space-y-6">
          <h1 className="text-2xl font-poppins font-bold text-primary">I miei preferiti</h1>
          
          <div className="bg-secondary/20 rounded-lg p-8 text-center">
            <Heart size={32} className="mx-auto mb-3 text-primary" />
            <p className="text-gray-700 mb-4">Devi effettuare l'accesso per vedere i tuoi preferiti</p>
            <Button 
              onClick={() => navigate('/login')}
              className="flex items-center gap-2"
            >
              Accedi
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

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
