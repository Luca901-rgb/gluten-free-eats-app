
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Heart, Search } from 'lucide-react';
import { toast } from 'sonner';
import { db, auth } from '@/lib/firebase';
import { collection, getDocs, doc, deleteDoc, getDoc, updateDoc } from 'firebase/firestore';
import RestaurantCard, { Restaurant } from '@/components/Restaurant/RestaurantCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

const FavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Ristorante d'esempio per gestire il caso in cui viene aggiunto ai preferiti
  const sampleRestaurant: Restaurant = {
    id: '1',
    name: 'Trattoria Keccabio',
    image: '/placeholder.svg', 
    rating: 4.7,
    reviews: 128,
    cuisine: 'Campana Gluten Free',
    description: 'Ristorante 100% gluten free specializzato in cucina campana tradizionale.',
    address: 'Via Toledo 42, Napoli, 80132',
    hasGlutenFreeOptions: true,
    isFavorite: true,
    location: {
      lat: 40.8388, 
      lng: 14.2488
    }
  };

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
        let favoriteIds: string[] = [];
        
        if (localFavorites) {
          try {
            favoriteIds = JSON.parse(localFavorites) as string[];
            
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
        
        // Verifica se il ristorante di esempio è tra i preferiti
        const hasSampleRestaurantInFavorites = favoriteIds.includes('1');
        
        // Se siamo online, carica i dati più aggiornati da Firestore
        if (navigator.onLine) {
          const userFavoritesDoc = await getDoc(doc(db, "userFavorites", currentUser.uid));
          
          if (userFavoritesDoc.exists() && userFavoritesDoc.data().restaurantIds) {
            favoriteIds = userFavoritesDoc.data().restaurantIds || [];
            
            if (favoriteIds.length === 0 && !hasSampleRestaurantInFavorites) {
              setFavorites([]);
              setIsLoading(false);
              return;
            }
            
            // Carica i dettagli completi di ogni ristorante preferito
            const userFavoritesCollection = collection(db, `users/${currentUser.uid}/favorites`);
            const favoritesSnapshot = await getDocs(userFavoritesCollection);
            
            const restaurantsData: Restaurant[] = [];
            
            // Aggiungi il ristorante di esempio se presente nei preferiti
            if (favoriteIds.includes('1') || hasSampleRestaurantInFavorites) {
              restaurantsData.push(sampleRestaurant);
            }
            
            if (!favoritesSnapshot.empty) {
              // Usa i dati dalla sottocollezione favorites dell'utente
              favoritesSnapshot.docs.forEach(doc => {
                const data = doc.data();
                restaurantsData.push({
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
                });
              });
            } else if (favoriteIds.length > 0 && favoriteIds.some(id => id !== '1')) {
              // Se non abbiamo dati nella sottocollezione, carica direttamente dai ristoranti
              const restaurantsPromises = favoriteIds
                .filter(id => id !== '1') // Filtra l'ID del ristorante di esempio che già abbiamo gestito
                .map(async (id) => {
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
              
              const fetchedRestaurants = (await Promise.all(restaurantsPromises)).filter(Boolean) as Restaurant[];
              restaurantsData.push(...fetchedRestaurants);
            }
            
            setFavorites(restaurantsData);
          } else {
            // Non ci sono preferiti in Firestore, ma potremmo avere il ristorante di esempio
            if (hasSampleRestaurantInFavorites) {
              setFavorites([sampleRestaurant]);
            } else {
              setFavorites([]);
            }
          }
        } else {
          // In modalità offline, se abbiamo il ristorante di esempio nei preferiti, mostralo
          if (hasSampleRestaurantInFavorites) {
            const currentFavorites = [...favorites];
            if (!currentFavorites.some(r => r.id === '1')) {
              currentFavorites.push(sampleRestaurant);
            }
            setFavorites(currentFavorites);
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
      
      // Ottieni il nome del ristorante prima di rimuoverlo dall'UI
      const restaurantName = favorites.find(r => r.id === id)?.name || 'Ristorante';
      toast.success(`${restaurantName} rimosso dai preferiti`);
      
      // Gestione speciale per il ristorante di esempio
      if (id === '1') {
        // Per il ristorante di esempio, aggiorniamo solo localStorage
        const localFavorites = localStorage.getItem(`favorites_${currentUser.uid}`);
        if (localFavorites) {
          try {
            const favoriteIds = JSON.parse(localFavorites) as string[];
            const updatedFavorites = favoriteIds.filter(favId => favId !== id);
            localStorage.setItem(`favorites_${currentUser.uid}`, JSON.stringify(updatedFavorites));
            
            // Aggiorna anche la cache dei ristoranti
            const cachedRestaurants = localStorage.getItem('cachedRestaurants');
            if (cachedRestaurants) {
              const parsedCachedRestaurants = JSON.parse(cachedRestaurants);
              const updatedCache = parsedCachedRestaurants.map((r: Restaurant) => 
                r.id === id ? { ...r, isFavorite: false } : r
              );
              localStorage.setItem('cachedRestaurants', JSON.stringify(updatedCache));
            }
          } catch (e) {
            console.error("Errore nell'aggiornamento dei preferiti locali:", e);
          }
        }
        return;
      }
      
      if (navigator.onLine) {
        // Aggiorna Firestore: rimuovi dai preferiti globali
        const userFavoritesRef = doc(db, "userFavorites", currentUser.uid);
        let userFavorites: string[] = [];
        
        try {
          const userFavoritesDoc = await getDoc(userFavoritesRef);
          if (userFavoritesDoc.exists()) {
            userFavorites = userFavoritesDoc.data().restaurantIds || [];
          }
        } catch (error) {
          console.error("Errore nel recupero dei preferiti:", error);
        }
        
        const updatedFavorites = userFavorites.filter((favId: string) => favId !== id);
        
        await updateDoc(userFavoritesRef, {
          restaurantIds: updatedFavorites
        });
        
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
          
          // Aggiorna anche la cache dei ristoranti
          const cachedRestaurants = localStorage.getItem('cachedRestaurants');
          if (cachedRestaurants) {
            const parsedCachedRestaurants = JSON.parse(cachedRestaurants);
            const updatedCache = parsedCachedRestaurants.map((r: Restaurant) => 
              r.id === id ? { ...r, isFavorite: false } : r
            );
            localStorage.setItem('cachedRestaurants', JSON.stringify(updatedCache));
          }
        } catch (e) {
          console.error("Errore nell'aggiornamento dei preferiti locali:", e);
        }
      }
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
