
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Heart, Search } from 'lucide-react';
import { toast } from 'sonner';
import { db, auth } from '@/lib/firebase';
import { collection, getDocs, doc, deleteDoc, getDoc } from 'firebase/firestore';
import RestaurantCard, { Restaurant } from '@/components/Restaurant/RestaurantCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

const FavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      setIsLoading(true);
      
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        setIsLoading(false);
        return;
      }
      
      try {
        // Carica prima dall'archivio locale per una risposta veloce
        const localFavorites = localStorage.getItem(`favorites_${currentUser.uid}`);
        if (localFavorites) {
          try {
            const favoriteIds = JSON.parse(localFavorites) as string[];
            
            // Se abbiamo ristoranti in cache, usa quelli per un caricamento istantaneo
            const cachedRestaurants = localStorage.getItem('cachedRestaurants');
            if (cachedRestaurants) {
              const allCachedRestaurants = JSON.parse(cachedRestaurants) as Restaurant[];
              const cachedFavorites = allCachedRestaurants
                .filter(r => favoriteIds.includes(r.id))
                .map(r => ({ ...r, isFavorite: true }));
                
              if (cachedFavorites.length > 0) {
                setFavorites(cachedFavorites);
              }
            }
          } catch (e) {
            console.error("Errore nel parsing dei preferiti locali:", e);
          }
        }
        
        // Se siamo online, carica i dati più aggiornati da Firestore
        if (navigator.onLine) {
          const userFavoritesDoc = await getDoc(doc(db, "userFavorites", currentUser.uid));
          
          if (userFavoritesDoc.exists() && userFavoritesDoc.data().restaurantIds) {
            const favoriteIds = userFavoritesDoc.data().restaurantIds || [];
            
            if (favoriteIds.length === 0) {
              setFavorites([]);
              setIsLoading(false);
              return;
            }
            
            // Carica i dettagli completi di ogni ristorante preferito
            const userFavoritesCollection = collection(db, `users/${currentUser.uid}/favorites`);
            const favoritesSnapshot = await getDocs(userFavoritesCollection);
            
            if (favoritesSnapshot.empty) {
              // Se non abbiamo dati nella sottocollezione, carica direttamente dai ristoranti
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
                  return null;
                } catch (e) {
                  console.error(`Errore nel caricamento del ristorante ${id}:`, e);
                  return null;
                }
              });
              
              const restaurantsData = (await Promise.all(restaurantsPromises)).filter(Boolean) as Restaurant[];
              setFavorites(restaurantsData);
            } else {
              // Usa i dati dalla sottocollezione favorites dell'utente
              const restaurantsData = favoritesSnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                  id: doc.id,
                  name: data.name || 'Ristorante senza nome',
                  image: data.image || '/placeholder.svg',
                  rating: data.rating || 0,
                  reviews: data.reviews || 0,
                  cuisine: data.cuisine || 'Italiana',
                  description: data.description || 'Nessuna descrizione disponibile',
                  address: data.address || 'Indirizzo non disponibile',
                  hasGlutenFreeOptions: true,
                  isFavorite: true
                } as Restaurant;
              });
              
              setFavorites(restaurantsData);
            }
          } else {
            setFavorites([]);
          }
        }
      } catch (error) {
        console.error("Errore nel recupero dei preferiti:", error);
        toast.error("Errore nel caricamento dei preferiti");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFavorites();
  }, []);

  const handleToggleFavorite = async (id: string) => {
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      toast.error("Devi effettuare l'accesso per gestire i preferiti");
      return;
    }
    
    try {
      // Rimuovi immediatamente dalla UI
      setFavorites(prevFavorites => prevFavorites.filter(item => item.id !== id));
      
      if (navigator.onLine) {
        // Aggiorna Firestore: rimuovi dai preferiti globali
        const userFavoritesDoc = await getDoc(doc(db, "userFavorites", currentUser.uid));
        if (userFavoritesDoc.exists()) {
          const currentFavorites = userFavoritesDoc.data().restaurantIds || [];
          const updatedFavorites = currentFavorites.filter((favId: string) => favId !== id);
          
          await doc(db, "userFavorites", currentUser.uid).update({
            restaurantIds: updatedFavorites
          });
        }
        
        // Rimuovi anche dalla sottocollezione
        await deleteDoc(doc(db, `users/${currentUser.uid}/favorites`, id));
      }
      
      // Aggiorna localStorage per la persistenza offline
      const localFavorites = localStorage.getItem(`favorites_${currentUser.uid}`);
      if (localFavorites) {
        try {
          const favoriteIds = JSON.parse(localFavorites) as string[];
          const updatedFavorites = favoriteIds.filter(favId => favId !== id);
          localStorage.setItem(`favorites_${currentUser.uid}`, JSON.stringify(updatedFavorites));
        } catch (e) {
          console.error("Errore nell'aggiornamento dei preferiti locali:", e);
        }
      }
      
      toast.success("Ristorante rimosso dai preferiti");
    } catch (error) {
      console.error("Errore nella rimozione dai preferiti:", error);
      toast.error("Errore nella rimozione dai preferiti");
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 pb-20">
        <h1 className="text-2xl font-bold mb-6">I miei preferiti</h1>
        
        {isLoading ? (
          // Skeleton loader per i preferiti
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex p-4 border rounded-lg">
                <Skeleton className="h-24 w-24 rounded-md" />
                <div className="ml-4 flex-1">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2 mb-4" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : favorites.length > 0 ? (
          <div className="space-y-4">
            {favorites.map(restaurant => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            <Heart size={48} className="mx-auto opacity-20 mb-4" />
            <p className="text-lg">Non hai ancora aggiunto ristoranti ai preferiti</p>
            <p className="text-sm mt-2">Esplora i ristoranti e aggiungi quelli che ti piacciono ai preferiti</p>
            <Button 
              className="mt-6" 
              variant="outline"
              onClick={() => window.location.href = '/search'}
            >
              <Search size={16} className="mr-2" />
              Cerca ristoranti
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FavoritesPage;
