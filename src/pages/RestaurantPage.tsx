
import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import RestaurantDetails, { RestaurantDetailProps } from '@/components/Restaurant/RestaurantDetails';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import { useRestaurantData } from '@/hooks/useRestaurantData';

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
      
      // Check if we have cached data first
      if (cachedRestaurant) {
        console.log("Using cached restaurant data:", cachedRestaurant);
      }
      
      try {
        // Try to get from Firebase only if we're online
        if (navigator.onLine) {
          try {
            const restaurantDoc = await getDoc(doc(db, "restaurants", id));
            
            if (restaurantDoc.exists()) {
              const data = restaurantDoc.data();
              
              // Fetch additional data like opening hours
              let openingHours: { days: string; hours: string }[] = [];
              try {
                const hoursDoc = await getDoc(doc(db, "restaurants", id, "details", "hours"));
                if (hoursDoc.exists()) {
                  openingHours = (hoursDoc.data().schedule || []).map((item: any) => ({
                    days: item.day || item.days,
                    hours: item.hours
                  }));
                }
              } catch (error) {
                console.error("Error fetching opening hours:", error);
                
                // Use cached hours if available
                if (cachedRestaurant?.openingHours) {
                  openingHours = cachedRestaurant.openingHours;
                }
              }
              
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
              
              setIsLoading(false);
              return;
            }
          } catch (error) {
            console.error("Firebase error, falling back to cache:", error);
            // Continue to fallback
          }
        }
        
        // If we're offline or the restaurant wasn't found, use cached data
        if (cachedRestaurant) {
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
        } else {
          // If no cached data is available, use a default restaurant for demo purposes
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
          
          toast.info("Visualizzazione ristorante demo");
        }
      } catch (error) {
        console.error("Error fetching restaurant details:", error);
        
        // Provide a default restaurant in all error cases
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
        
        toast.error("Si è verificato un errore, visualizzazione dati demo");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRestaurantDetails();
  }, [id, cachedRestaurant]);
  
  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
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
