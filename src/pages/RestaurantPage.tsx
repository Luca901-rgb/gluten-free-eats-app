
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
      
      try {
        // Try to get from Firebase first
        if (navigator.onLine) {
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
        }
        
        // If we're offline or the restaurant wasn't found, use cached data
        if (cachedRestaurant) {
          console.log("Using cached restaurant data:", cachedRestaurant);
          setRestaurant({
            id: cachedRestaurant.id || id,
            name: cachedRestaurant.name,
            description: cachedRestaurant.description,
            coverImage: cachedRestaurant.coverImage,
            images: [cachedRestaurant.coverImage, '/placeholder.svg', '/placeholder.svg'],
            address: cachedRestaurant.address,
            phone: cachedRestaurant.phone || '+39 081 1234567',
            openingHours: cachedRestaurant.openingHours,
            rating: cachedRestaurant.rating,
            reviews: cachedRestaurant.totalReviews,
            hasGlutenFreeOptions: cachedRestaurant.hasGlutenFreeOptions || true
          });
        } else {
          // Show error message if neither online data nor cache is available
          toast.error("Ristorante non trovato");
        }
      } catch (error) {
        console.error("Error fetching restaurant details:", error);
        
        // Use cached data if available when there's an error
        if (cachedRestaurant) {
          console.log("Error occurred, using cached restaurant data");
          setRestaurant({
            id: cachedRestaurant.id || id,
            name: cachedRestaurant.name,
            description: cachedRestaurant.description,
            coverImage: cachedRestaurant.coverImage,
            images: [cachedRestaurant.coverImage, '/placeholder.svg', '/placeholder.svg'],
            address: cachedRestaurant.address,
            phone: cachedRestaurant.phone || '+39 081 1234567',
            openingHours: cachedRestaurant.openingHours,
            rating: cachedRestaurant.rating,
            reviews: cachedRestaurant.totalReviews,
            hasGlutenFreeOptions: cachedRestaurant.hasGlutenFreeOptions || true
          });
        } else {
          toast.error("Si è verificato un errore nel caricamento dei dettagli del ristorante");
        }
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
  
  // If restaurant not found, show error
  if (!restaurant) {
    return (
      <Layout>
        <div className="p-4 text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Ristorante non trovato</h1>
          <p className="text-gray-600">Il ristorante che stai cercando non esiste o è stato rimosso.</p>
          {isOffline && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
              <p className="text-amber-700">Sei offline. Riconnettiti a internet per caricare i dati più recenti.</p>
            </div>
          )}
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
      <RestaurantDetails 
        restaurant={restaurant} 
        initialBookingCode={bookingCode || ''}
        initialRestaurantCode={restaurantCode || ''}
      />
    </Layout>
  );
};

export default RestaurantPage;
