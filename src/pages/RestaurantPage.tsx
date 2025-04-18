
import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import RestaurantDetails, { RestaurantDetailProps } from '@/components/Restaurant/RestaurantDetails';
import { doc, getDoc, DocumentSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import { useRestaurantData } from '@/hooks/useRestaurantData';
import { Skeleton } from '@/components/ui/skeleton';

// PRECARICAMENTO DEI DATI DEFAULT
const DEFAULT_RESTAURANT: RestaurantDetailProps = {
  id: '1',
  name: 'Trattoria Keccabio',
  description: 'Ristorante 100% gluten free specializzato in cucina campana tradizionale. Il nostro locale è certificato dall\'Associazione Italiana Celiachia e tutto il nostro menù è privo di glutine. Dal pane alla pasta, dalle pizze ai dolci, offriamo un\'esperienza gastronomica completa senza compromessi sul gusto.',
  coverImage: '/placeholder.svg',
  images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
  address: 'Via Toledo 42, Napoli, 80132',
  phone: '+39 081 1234567',
  openingHours: [
    { days: 'Lunedì', hours: 'Chiuso' },
    { days: 'Martedì-Venerdì', hours: '12:00-14:30, 19:00-22:30' },
    { days: 'Sabato', hours: '12:00-15:00, 19:00-23:00' },
    { days: 'Domenica', hours: '12:00-15:00, 19:00-22:00' },
  ],
  rating: 4.7,
  reviews: 128,
  hasGlutenFreeOptions: true
};

const RestaurantPage = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false); // CAMBIO IMPORTANTE: inizia con false
  const [restaurant, setRestaurant] = useState<RestaurantDetailProps | null>(null);
  const { restaurantData: cachedRestaurant } = useRestaurantData(id);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  
  // Check if we have a booking code in the URL
  const searchParams = new URLSearchParams(location.search);
  const bookingCode = searchParams.get('bookingCode');
  const restaurantCode = searchParams.get('restaurantCode');
  
  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // OTTIMIZZAZIONE: Imposta i dati predefiniti immediatamente
  useEffect(() => {
    // Imposta immediatamente il default o il cached restaurant
    if (cachedRestaurant) {
      setRestaurant({
        id: cachedRestaurant.id || id || '1',
        name: cachedRestaurant.name,
        description: cachedRestaurant.description,
        coverImage: cachedRestaurant.coverImage,
        images: [cachedRestaurant.coverImage || '/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
        address: cachedRestaurant.address,
        phone: cachedRestaurant.phone || '+39 081 1234567',
        openingHours: cachedRestaurant.openingHours || DEFAULT_RESTAURANT.openingHours,
        rating: cachedRestaurant.rating,
        reviews: cachedRestaurant.totalReviews,
        hasGlutenFreeOptions: cachedRestaurant.hasGlutenFreeOptions || true
      });
    } else {
      // Se non c'è cache, usa il default restaurant preimpostato
      setRestaurant({...DEFAULT_RESTAURANT, id: id || '1'});
    }
    
    // FETCH ASINCRONO: Solo dopo aver mostrato qualcosa, prova a caricare da Firebase
    if (navigator.onLine && id) {
      // Usa Promise.race con un timeout per garantire una risposta rapida
      Promise.race([
        getDoc(doc(db, "restaurants", id)),
        // Timeout di 2 secondi
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2000))
      ])
        .then((response) => {
          if (response instanceof Error) throw response;
          
          // Esplicitamente tipizzo restaurantDoc come DocumentSnapshot
          const restaurantDoc = response as DocumentSnapshot;
          
          if (restaurantDoc.exists()) {
            const data = restaurantDoc.data();
            
            // Aggiorna il ristorante con i dati da Firebase
            setRestaurant(current => {
              if (!current) return current;
              
              return {
                ...current,
                id,
                name: data?.name || current.name,
                description: data?.description || current.description, 
                coverImage: data?.coverImage || current.coverImage,
                images: data?.gallery || current.images,
                address: data?.address || current.address,
                phone: data?.phone || current.phone,
                rating: data?.rating || current.rating,
                reviews: data?.reviewCount || current.reviews,
                hasGlutenFreeOptions: data?.hasGlutenFreeOptions !== undefined 
                  ? data.hasGlutenFreeOptions 
                  : current.hasGlutenFreeOptions
              };
            });
            
            // Carica le ore in modo non bloccante
            getDoc(doc(db, "restaurants", id, "details", "hours"))
              .then(hoursDoc => {
                if (hoursDoc.exists()) {
                  const scheduleData = hoursDoc.data().schedule || [];
                  const openingHours = scheduleData.map((item: any) => ({
                    days: item.day || item.days,
                    hours: item.hours
                  }));
                  
                  setRestaurant(current => {
                    if (current) {
                      return { ...current, openingHours };
                    }
                    return current;
                  });
                }
              })
              .catch(() => {/* ignora errori per gli orari */});
          }
        })
        .catch(error => {
          if (error.message !== 'timeout') {
            console.error("Errore nel caricamento da Firebase:", error);
          }
          // Nessun toast, stiamo già mostrando i dati
        });
    }
  }, [id, cachedRestaurant]);

  // OTTIMIZZAZIONE: SALTA COMPLETAMENTE IL LOADING STATE
  // Il ristorante sarà sempre disponibile immediatamente (default o cached)
  
  return (
    <Layout>
      {isOffline && (
        <div className="mx-4 mt-2 p-2 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-700">
          Stai visualizzando dati in modalità offline. Alcuni dettagli potrebbero non essere aggiornati.
        </div>
      )}
      {restaurant ? (
        <RestaurantDetails 
          restaurant={restaurant} 
          initialBookingCode={bookingCode || ''}
          initialRestaurantCode={restaurantCode || ''}
        />
      ) : (
        // Questo caso non dovrebbe mai verificarsi, ma è buona pratica mantenerlo
        <div className="p-4 text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Ristorante non trovato</h1>
          <p className="text-gray-600">Il ristorante che stai cercando non esiste o è stato rimosso.</p>
          {isOffline && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
              <p className="text-amber-700">Sei offline. Riconnettiti a internet per caricare i dati più recenti.</p>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

export default RestaurantPage;
