
import React, { useState, useEffect, useCallback } from 'react';
import Layout from '@/components/Layout';
import { Heart, Search, WifiOff, RefreshCcw, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import RestaurantCard, { Restaurant } from '@/components/Restaurant/RestaurantCard';
import RestaurantList from '@/components/Home/RestaurantList';
import { toast } from 'sonner';
import { db, auth } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, deleteDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const FavoritesPage = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Callback version of fetchFavorites to use in useEffect and retry handler
  const fetchFavorites = useCallback(async (userId: string) => {
    setIsLoading(true);
    setLoadingError(null);
    
    try {
      console.log("Tentativo di caricamento preferiti...", { retryCount, time: new Date().toISOString() });
      console.log("Stato connessione:", navigator.onLine ? "Online" : "Offline");
      
      // Get the user's favorites list
      const userFavoritesRef = doc(db, "userFavorites", userId);
      const userFavoritesDoc = await getDoc(userFavoritesRef);
      
      if (!userFavoritesDoc.exists() || !userFavoritesDoc.data().restaurantIds || userFavoritesDoc.data().restaurantIds.length === 0) {
        console.log("Nessun preferito trovato o lista vuota");
        setFavorites([]);
        setIsLoading(false);
        return;
      }
      
      const favoriteIds = userFavoritesDoc.data().restaurantIds as string[];
      console.log(`Trovati ${favoriteIds.length} preferiti`);
      
      // Fetch each restaurant from the favorites list
      const restaurantsPromises = favoriteIds.map(async (id) => {
        try {
          const restaurantDoc = await getDoc(doc(db, "restaurants", id));
          if (restaurantDoc.exists()) {
            const data = restaurantDoc.data();
            return {
              id: restaurantDoc.id,
              name: data.name || 'Ristorante senza nome',
              image: data.coverImage || '/placeholder.svg',
              rating: data.rating || 0,
              reviews: data.reviews || 0,
              cuisine: data.cuisine || 'Italiana',
              description: data.description || 'Nessuna descrizione disponibile',
              address: data.address || 'Indirizzo non disponibile',
              hasGlutenFreeOptions: data.hasGlutenFreeOptions || false,
              isFavorite: true
            } as Restaurant;
          }
          console.log(`Ristorante ${id} non trovato`);
          return null;
        } catch (error) {
          console.error(`Errore nel recupero del ristorante ${id}:`, error);
          return null;
        }
      });
      
      const restaurantsData = (await Promise.all(restaurantsPromises)).filter(r => r !== null) as Restaurant[];
      console.log(`Caricati con successo ${restaurantsData.length} ristoranti preferiti`);
      setFavorites(restaurantsData);
      setIsOffline(false); // Impostiamo esplicitamente a false se il caricamento è riuscito
    } catch (error) {
      console.error("Errore durante il recupero dei preferiti:", error);
      // Determina se l'errore è dovuto alla connessione offline
      const isActuallyOffline = !navigator.onLine;
      setIsOffline(isActuallyOffline);
      
      if (isActuallyOffline) {
        setLoadingError("Sei offline. Non è possibile caricare i preferiti");
      } else {
        setLoadingError("Si è verificato un errore nel caricamento dei preferiti. Riprova più tardi.");
      }
      
      toast.error("Si è verificato un errore nel caricamento dei preferiti");
    } finally {
      setIsLoading(false);
    }
  }, [retryCount]);

  useEffect(() => {
    // Monitor online/offline status
    const handleOnlineStatus = () => {
      const isOnline = navigator.onLine;
      console.log("Cambiamento stato connessione:", isOnline ? "Online" : "Offline");
      setIsOffline(!isOnline);
      
      if (isOnline) {
        // If we're back online and authenticated, try to fetch favorites again
        const user = auth.currentUser;
        if (user) {
          fetchFavorites(user.uid);
        }
      }
    };

    // Initial check
    setIsOffline(!navigator.onLine);
    
    // Add event listeners
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    // Check authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed:", user ? "Utente autenticato" : "Utente non autenticato");
      setIsAuthenticated(!!user);
      if (user) {
        fetchFavorites(user.uid);
      } else {
        setIsLoading(false);
        toast.error("Per vedere i preferiti devi effettuare l'accesso");
      }
    });

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
      unsubscribe();
    };
  }, [fetchFavorites]);

  const handleRetry = () => {
    const user = auth.currentUser;
    if (user) {
      console.log("Tentativo di ricaricamento dei preferiti...");
      setRetryCount(prev => prev + 1); // Incrementa il contatore per forzare il refetch
      fetchFavorites(user.uid);
    } else {
      toast.error("Per vedere i preferiti devi effettuare l'accesso");
    }
  };

  const handleToggleFavorite = async (id: string) => {
    if (isOffline) {
      toast.error("Non puoi modificare i preferiti mentre sei offline");
      return;
    }
    
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
        
        <RestaurantList
          restaurants={favorites}
          isLoading={isLoading}
          isOffline={isOffline}
          loadingError={loadingError}
          regionStatus={{ checked: true, inRegion: true }}
          onToggleFavorite={handleToggleFavorite}
          onRetry={handleRetry}
        />
        
        {!isLoading && !isOffline && !loadingError && favorites.length === 0 && (
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
