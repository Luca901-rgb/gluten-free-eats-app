import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Loader2, Star, MapPin, Trash2 } from 'lucide-react';

// Tipo per un elemento preferito
interface Favorite {
  id: string;
  name: string;
  address?: string;
  image?: string;
  rating?: number;
  description?: string;
  restaurantId?: string;
}

const FavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const user = auth.currentUser;
        
        if (!user) {
          console.log("Nessun utente autenticato");
          setFavorites([]);
          setLoading(false);
          return;
        }
        
        const userId = user.uid;
        
        // Verifica se ci sono preferiti salvati localmente
        const cachedFavorites = localStorage.getItem(`favorites_${userId}`);
        let favoritesData: Favorite[] = [];
        
        if (cachedFavorites) {
          try {
            const parsedFavorites = JSON.parse(cachedFavorites);
            if (Array.isArray(parsedFavorites)) {
              favoritesData = parsedFavorites;
              console.log("Caricati preferiti dalla cache locale:", favoritesData.length);
            }
          } catch (e) {
            console.error("Errore nel parsing dei preferiti dalla cache:", e);
          }
        }
        
        // Prova a recuperare i preferiti da Firestore
        try {
          const favoritesRef = collection(db, `users/${userId}/favorites`);
          const favoritesSnapshot = await getDocs(favoritesRef);
          
          if (!favoritesSnapshot.empty) {
            favoritesData = favoritesSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            })) as Favorite[];
            
            // Aggiorna la cache locale
            localStorage.setItem(`favorites_${userId}`, JSON.stringify(favoritesData));
            console.log("Preferiti caricati da Firestore e salvati in cache:", favoritesData.length);
          } else if (favoritesData.length === 0) {
            console.log("Nessun preferito trovato in Firestore");
          }
        } catch (firestoreError) {
          console.error("Errore nel caricamento dei preferiti da Firestore:", firestoreError);
          // Se abbiamo dati dalla cache, continuiamo a usarli
          if (favoritesData.length === 0) {
            setError("Impossibile caricare i preferiti. Verifica la tua connessione.");
          }
        }
        
        setFavorites(favoritesData);
      } catch (err) {
        console.error("Errore generale nel caricamento dei preferiti:", err);
        setError("Si è verificato un errore nel caricamento dei preferiti.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchFavorites();
    
    // Aggiorna i preferiti quando l'utente cambia
    const unsubscribe = auth.onAuthStateChanged(() => {
      fetchFavorites();
    });
    
    return () => unsubscribe();
  }, []);
  
  const removeFavorite = async (favoriteId: string) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("Devi essere loggato per rimuovere dai preferiti");
        return;
      }
      
      const userId = user.uid;
      
      // Ottimistic UI update - rimuovi immediatamente dall'interfaccia
      setFavorites(prev => prev.filter(fav => fav.id !== favoriteId));
      
      // Aggiorna la cache locale
      const updatedFavorites = favorites.filter(fav => fav.id !== favoriteId);
      localStorage.setItem(`favorites_${userId}`, JSON.stringify(updatedFavorites));
      
      // Rimuovi da Firestore
      try {
        await deleteDoc(doc(db, `users/${userId}/favorites`, favoriteId));
        toast.success("Rimosso dai preferiti");
      } catch (error) {
        console.error("Errore nella rimozione da Firestore:", error);
        // Non ripristiniamo l'interfaccia per semplicità dell'utente, ma logghiamo l'errore
      }
    } catch (error) {
      console.error("Errore nella rimozione dai preferiti:", error);
      toast.error("Impossibile rimuovere dai preferiti");
      
      // Ricarica i preferiti in caso di errore
      const user = auth.currentUser;
      if (user) {
        const cachedFavorites = localStorage.getItem(`favorites_${user.uid}`);
        if (cachedFavorites) {
          setFavorites(JSON.parse(cachedFavorites));
        }
      }
    }
  };
  
  const navigateToRestaurant = (restaurantId: string) => {
    if (restaurantId) {
      navigate(`/restaurants/${restaurantId}`);
    } else {
      toast.error("Informazioni sul ristorante non disponibili");
    }
  };
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Caricamento preferiti...</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">I miei preferiti</h1>
      
      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      {!loading && favorites.length === 0 && !error && (
        <div className="text-center py-10">
          <Star className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Nessun preferito</h2>
          <p className="text-muted-foreground mb-6">
            Non hai ancora aggiunto ristoranti ai preferiti.
          </p>
          <Button onClick={() => navigate('/restaurants')}>
            Esplora ristoranti
          </Button>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((favorite) => (
          <Card key={favorite.id} className="overflow-hidden">
            {favorite.image && (
              <div className="aspect-video w-full overflow-hidden">
                <img 
                  src={favorite.image} 
                  alt={favorite.name} 
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                  onError={(e) => (e.currentTarget.src = '/placeholder-restaurant.jpg')}
                />
              </div>
            )}
            
            <CardHeader>
              <CardTitle>{favorite.name}</CardTitle>
              {favorite.address && (
                <CardDescription className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {favorite.address}
                </CardDescription>
              )}
            </CardHeader>
            
            <CardContent>
              {favorite.description && (
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {favorite.description}
                </p>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => favorite.restaurantId && navigateToRestaurant(favorite.restaurantId)}
                disabled={!favorite.restaurantId}
              >
                Visualizza
              </Button>
              
              <Button 
                variant="ghost" 
                className="text-destructive" 
                onClick={() => removeFavorite(favorite.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Rimuovi
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;