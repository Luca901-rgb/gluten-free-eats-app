
import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import RestaurantDetails, { RestaurantDetailProps } from '@/components/Restaurant/RestaurantDetails';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import { useRestaurantData } from '@/hooks/useRestaurantData';
import { Skeleton } from '@/components/ui/skeleton';

const RestaurantPage = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
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
  
  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      if (!id) {
        toast.error("ID del ristorante non valido");
        setIsLoading(false);
        return;
      }
      
      // OPTIMIZATION: First immediately set data from cache if available
      // This ensures we show content within milliseconds
      if (cachedRestaurant) {
        console.log("Using cached restaurant data immediately:", cachedRestaurant);
        setRestaurant({
          id: cachedRestaurant.id || id,
          name: cachedRestaurant.name,
          description: cachedRestaurant.description,
          coverImage: cachedRestaurant.coverImage,
          images: [cachedRestaurant.coverImage, '/placeholder.svg', '/placeholder.svg'],
          address: cachedRestaurant.address,
          phone: cachedRestaurant.phone || '+39 081 1234567',
          openingHours: cachedRestaurant.openingHours || [
            { days: 'Lunedì', hours: 'Chiuso' },
            { days: 'Martedì-Venerdì', hours: '12:00-14:30, 19:00-22:30' },
            { days: 'Sabato', hours: '12:00-15:00, 19:00-23:00' },
            { days: 'Domenica', hours: '12:00-15:00, 19:00-22:00' },
          ],
          rating: cachedRestaurant.rating,
          reviews: cachedRestaurant.totalReviews,
          hasGlutenFreeOptions: cachedRestaurant.hasGlutenFreeOptions || true
        });
        
        // Stop loading indicator immediately when we show cached data
        setIsLoading(false);
      } else {
        // If no cache is available, use a default restaurant immediately
        setRestaurant({
          id: id || '1',
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
        });
        setIsLoading(false);
      }
      
      // OPTIMIZATION: After showing cached/default data immediately,
      // try to refresh from Firebase but don't block UI
      if (navigator.onLine) {
        try {
          const restaurantDoc = await getDoc(doc(db, "restaurants", id));
          
          if (restaurantDoc.exists()) {
            const data = restaurantDoc.data();
            
            // Instead of nested waiting for hours, set defaults
            let openingHours = [
              { days: 'Lunedì', hours: 'Chiuso' },
              { days: 'Martedì-Venerdì', hours: '12:00-14:30, 19:00-22:30' },
              { days: 'Sabato', hours: '12:00-15:00, 19:00-23:00' },
              { days: 'Domenica', hours: '12:00-15:00, 19:00-22:00' },
            ];
            
            // Try to get hours but don't wait on it or block rendering
            getDoc(doc(db, "restaurants", id, "details", "hours"))
              .then(hoursDoc => {
                if (hoursDoc.exists()) {
                  const scheduleData = hoursDoc.data().schedule || [];
                  openingHours = scheduleData.map((item: any) => ({
                    days: item.day || item.days,
                    hours: item.hours
                  }));
                  
                  // Update only if user is still on the page
                  setRestaurant(current => {
                    if (current) {
                      return {
                        ...current,
                        openingHours
                      };
                    }
                    return current;
                  });
                }
              })
              .catch(err => console.log("Non-blocking hours fetch error:", err));
            
            // Update with Firebase data
            setRestaurant({
              id,
              name: data.name || 'Ristorante',
              description: data.description || 'Descrizione del ristorante non disponibile.',
              coverImage: data.coverImage || '/placeholder.svg',
              images: data.gallery || ['/placeholder.svg'],
              address: data.address || 'Indirizzo non disponibile',
              phone: data.phone || 'Telefono non disponibile',
              openingHours,
              rating: data.rating || 0,
              reviews: data.reviewCount || 0,
              hasGlutenFreeOptions: data.hasGlutenFreeOptions || true
            });
          }
        } catch (error) {
          console.error("Firebase error, already showing cache:", error);
          // We're already showing cached/default data, so this is non-blocking
        }
      } else if (!cachedRestaurant) {
        // Only show toast if we're offline and didn't have cached data
        toast.info("Visualizzazione ristorante in modalità offline");
      }
    };
    
    fetchRestaurantDetails();
  }, [id, cachedRestaurant]);
  
  // FAST LOADING WITH SKELETON SCREENS
  if (isLoading) {
    return (
      <Layout>
        <div className="pb-20">
          <div className="relative h-56 md:h-72">
            <Skeleton className="w-full h-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
              <div className="space-y-2">
                <Skeleton className="h-8 w-2/3" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
          </div>
          <div className="px-4 mt-4">
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="h-9 w-24" />
              ))}
            </div>
            <div className="mt-6 space-y-4">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
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
