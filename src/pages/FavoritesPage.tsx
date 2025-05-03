
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { toast } from 'sonner';
import { db, auth } from '@/lib/firebase';
import { collection, getDocs, doc, deleteDoc, getDoc, updateDoc } from 'firebase/firestore';
import { Restaurant } from '@/components/Restaurant/RestaurantCard';
import safeStorage from '@/lib/safeStorage';
import LoadingSkeleton from '@/components/Favorites/LoadingSkeleton';
import EmptyState from '@/components/Favorites/EmptyState';
import FavoritesList from '@/components/Favorites/FavoritesList';

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
        toast.error("Devi effettuare l'accesso per vedere i preferiti");
        return;
      }
      
      try {
        console.log("Tentativo di recupero preferiti per l'utente", currentUser.uid);
        
        // Carica prima dall'archivio locale per una risposta veloce
        const localFavorites = safeStorage.getItem(`favorites_${currentUser.uid}`);
        let favoriteIds: string[] = [];
        let restaurantsData: Restaurant[] = [];
        
        if (localFavorites) {
          try {
            favoriteIds = JSON.parse(localFavorites) as string[];
            console.log("Preferiti trovati in localStorage:", favoriteIds);
            
            // Se abbiamo ristoranti in cache, usa quelli per un caricamento istantaneo
            const cachedRestaurants = safeStorage.getItem('cachedRestaurants');
            if (cachedRestaurants) {
              const allCachedRestaurants = JSON.parse(cachedRestaurants) as Restaurant[];
              console.log("Cache dei ristoranti trovata con", allCachedRestaurants.length, "elementi");
              
              const cachedFavorites = allCachedRestaurants
                .filter(r => favoriteIds.includes(r.id))
                .map(r => ({ ...r, isFavorite: true }));
                
              if (cachedFavorites.length > 0) {
                console.log("Trovati", cachedFavorites.length, "ristoranti preferiti nella cache");
                restaurantsData = [...cachedFavorites];
              }
            }
          } catch (e) {
            console.error("Errore nel parsing dei preferiti locali:", e);
          }
        }
        
        // Verifica se il ristorante di esempio è tra i preferiti
        const hasSampleRestaurantInFavorites = favoriteIds.includes('1');
        
        // Se il ristorante di esempio è nei preferiti, aggiungilo
        if (hasSampleRestaurantInFavorites) {
          console.log("Ristorante di esempio trovato nei preferiti");
          // Verifica che non sia già presente nell'array restaurantsData
          if (!restaurantsData.some(r => r.id === '1')) {
            restaurantsData.push(sampleRestaurant);
          }
        }
        
        // Se siamo online, carica i dati più aggiornati da Firestore
        if (navigator.onLine) {
          console.log("Online - Tentativo di caricare preferiti da Firestore");
          const userFavoritesDoc = await getDoc(doc(db, "userFavorites", currentUser.uid));
          
          if (userFavoritesDoc.exists() && userFavoritesDoc.data().restaurantIds) {
            favoriteIds = userFavoritesDoc.data().restaurantIds || [];
            console.log("Preferiti trovati in Firestore:", favoriteIds);
            
            // Se il ristorante di esempio è nei preferiti di Firestore ma non è ancora nell'array
            if (favoriteIds.includes('1') && !restaurantsData.some(r => r.id === '1')) {
              restaurantsData.push(sampleRestaurant);
            }
            
            // Carica i dettagli completi di ogni ristorante preferito
            const userFavoritesCollection = collection(db, `users/${currentUser.uid}/favorites`);
            const favoritesSnapshot = await getDocs(userFavoritesCollection);
            
            // Usa i dati dalla sottocollezione favorites dell'utente
            if (!favoritesSnapshot.empty) {
              console.log("Trovati", favoritesSnapshot.size, "ristoranti nella sottocollezione favorites");
              favoritesSnapshot.docs.forEach(doc => {
                if (doc.id === '1') return; // Salta il ristorante di esempio che abbiamo già aggiunto
                
                const data = doc.data();
                // Verifica che non sia già presente nell'array restaurantsData
                if (!restaurantsData.some(r => r.id === doc.id)) {
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
                    isFavorite: true,
                    location: data.location || null
                  });
                }
              });
            } else if (favoriteIds.length > 0) {
              console.log("Nessun ristorante nella sottocollezione, carico dai ristoranti");
              // Se non abbiamo dati nella sottocollezione, carica direttamente dai ristoranti
              const restaurantsPromises = favoriteIds
                .filter(id => id !== '1' && !restaurantsData.some(r => r.id === id)) // Salta quelli già aggiunti
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
                        isFavorite: true,
                        location: data.location || null
                      } as Restaurant;
                    }
                    return null;
                  } catch (e) {
                    console.error(`Errore nel caricamento del ristorante ${id}:`, e);
                    return null;
                  }
                });
              
              const fetchedRestaurants = (await Promise.all(restaurantsPromises)).filter(Boolean) as Restaurant[];
              console.log("Caricati", fetchedRestaurants.length, "ristoranti da Firestore");
              restaurantsData.push(...fetchedRestaurants);
            }
          } else {
            console.log("Nessun preferito trovato in Firestore");
            
            // Se non ci sono preferiti in Firestore ma abbiamo il ristorante di esempio nei preferiti locali
            if (hasSampleRestaurantInFavorites && !restaurantsData.some(r => r.id === '1')) {
              restaurantsData.push(sampleRestaurant);
            }
          }
        } else {
          console.log("Offline - Utilizzo solo dati locali");
          
          // Se siamo offline ma abbiamo il ristorante di esempio nei preferiti locali
          if (hasSampleRestaurantInFavorites && !restaurantsData.some(r => r.id === '1')) {
            restaurantsData.push(sampleRestaurant);
          }
        }
        
        // Aggiorna sempre localStorage con i preferiti aggiornati
        console.log("Salvataggio finale preferiti in localStorage:", favoriteIds);
        safeStorage.setItem(`favorites_${currentUser.uid}`, JSON.stringify(favoriteIds));
        
        console.log("Salvataggio finale array restaurantsData con", restaurantsData.length, "elementi");
        setFavorites(restaurantsData);
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
      
      // Aggiorna localStorage per la persistenza offline
      const localFavorites = safeStorage.getItem(`favorites_${currentUser.uid}`);
      let favoriteIds: string[] = [];
      if (localFavorites) {
        try {
          favoriteIds = JSON.parse(localFavorites) as string[];
          const updatedFavorites = favoriteIds.filter(favId => favId !== id);
          safeStorage.setItem(`favorites_${currentUser.uid}`, JSON.stringify(updatedFavorites));
          
          // Aggiorna anche la cache dei ristoranti
          const cachedRestaurants = safeStorage.getItem('cachedRestaurants');
          if (cachedRestaurants) {
            const parsedCachedRestaurants = JSON.parse(cachedRestaurants);
            const updatedCache = parsedCachedRestaurants.map((r: Restaurant) => 
              r.id === id ? { ...r, isFavorite: false } : r
            );
            safeStorage.setItem('cachedRestaurants', JSON.stringify(updatedCache));
          }
        } catch (e) {
          console.error("Errore nell'aggiornamento dei preferiti locali:", e);
        }
      }
      
      // Gestione speciale per il ristorante di esempio
      if (id === '1') {
        // Per il ristorante di esempio, non facciamo altro che aggiornare localStorage
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
    } catch (error) {
      console.error("Errore nella rimozione dai preferiti:", error);
      toast.error("Errore nella rimozione dai preferiti");
    }
  };

  console.log("Rendering FavoritesPage con", favorites.length, "preferiti");

  return (
    <Layout>
      <div className="container mx-auto p-4 pb-20">
        <h1 className="text-2xl font-bold mb-6">I miei preferiti</h1>
        
        {isLoading ? (
          <LoadingSkeleton />
        ) : favorites.length > 0 ? (
          <FavoritesList 
            favorites={favorites} 
            onToggleFavorite={handleToggleFavorite} 
          />
        ) : (
          <EmptyState />
        )}
      </div>
    </Layout>
  );
};

export default FavoritesPage;
