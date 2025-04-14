
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Loader2, Star, MapPin, Trash2 } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import Layout from '@/components/Layout';

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
        
        // Prova a recuperare i preferiti da Firestore
        try {
          // Ottieni preferiti dall'utente corrente
          const favoritesRef = collection(db, `users/${userId}/favorites`);
          const favoritesSnapshot = await getDocs(favoritesRef);
          
          if (!favoritesSnapshot.empty) {
            const favoritesData = favoritesSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            })) as Favorite[];
            
            // Aggiorna la cache locale
            localStorage.setItem(`favorites_${userId}`, JSON.stringify(favoritesData));
            console.log("Preferiti caricati da Firestore:", favoritesData.length);
            setFavorites(favoritesData);
          } else {
            console.log("Nessun preferito trovato in Firestore");
            setFavorites([]);
          }
        } catch (firestoreError) {
          console.error("Errore nel caricamento dei preferiti da Firestore:", firestoreError);
          
          // Prova a caricare dalla cache locale
          const cachedFavorites = localStorage.getItem(`favorites_${userId}`);
          if (cachedFavorites) {
            try {
              const parsedFavorites = JSON.parse(cachedFavorites);
              if (Array.isArray(parsedFavorites)) {
                setFavorites(parsedFavorites);
                console.log("Caricati preferiti dalla cache locale:", parsedFavorites.length);
              }
            } catch (e) {
              console.error("Errore nel parsing dei preferiti dalla cache:", e);
              setFavorites([]);
            }
          } else {
            setFavorites([]);
          }
        }
      } catch (err) {
        console.error("Errore generale nel caricamento dei preferiti:", err);
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFavorites();
    
    // Timeout di sicurezza - se dopo 2 secondi ancora carica, forziamo la fine
    const safetyTimeout = setTimeout(() => {
      if (loading) {
        setLoading(false);
      }
    }, 2000);
    
    return () => clearTimeout(safetyTimeout);
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
        toast.error("Impossibile rimuovere dai preferiti online");
      }
    } catch (error) {
      console.error("Errore nella rimozione dai preferiti:", error);
      toast.error("Impossibile rimuovere dai preferiti");
    }
  };
  
  const navigateToRestaurant = (restaurantId: string) => {
    if (restaurantId) {
      navigate(`/restaurant/${restaurantId}`);
    } else {
      toast.error("Informazioni sul ristorante non disponibili");
    }
  };
  
  // Se il caricamento dura più di 1 secondo, mostriamo uno skeleton
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto p-4 min-h-[calc(100vh-4rem)]">
          <h1 className="text-2xl font-bold mb-6">I miei preferiti</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <Card key={item} className="overflow-hidden">
                <Skeleton className="aspect-video w-full" />
                <CardHeader>
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-4/5" />
                </CardContent>
                <CardFooter className="flex justify-between py-4">
                  <Skeleton className="h-9 w-24" />
                  <Skeleton className="h-9 w-24" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto p-4 pb-20 min-h-[calc(100vh-4rem)]">
        <h1 className="text-2xl font-bold mb-6">I miei preferiti</h1>
        
        {error && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6">
            {error}
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-4" 
              onClick={() => setError(null)}
            >
              Chiudi
            </Button>
          </div>
        )}
        
        {!loading && favorites.length === 0 && !error && (
          <div className="text-center py-10">
            <Star className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Nessun preferito</h2>
            <p className="text-muted-foreground mb-6">
              Non hai ancora aggiunto ristoranti ai preferiti.
            </p>
            <Button onClick={() => navigate('/search')}>
              Esplora ristoranti
            </Button>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {favorites.map((favorite) => (
            <Card key={favorite.id} className="overflow-hidden">
              {favorite.image && (
                <div className="aspect-video w-full overflow-hidden">
                  <img 
                    src={favorite.image} 
                    alt={favorite.name} 
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                    onError={(e) => {
                      (e.currentTarget.src as string) = '/placeholder-restaurant.jpg';
                    }}
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
    </Layout>
  );
};

export default FavoritesPage;
