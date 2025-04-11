
import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import RestaurantDetails, { RestaurantDetailProps } from '@/components/Restaurant/RestaurantDetails';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';

const RestaurantPage = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [restaurant, setRestaurant] = useState<RestaurantDetailProps | null>(null);
  
  // Check if we have a booking code in the URL
  const searchParams = new URLSearchParams(location.search);
  const bookingCode = searchParams.get('bookingCode');
  const restaurantCode = searchParams.get('restaurantCode');
  
  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      if (!id) {
        toast.error("ID del ristorante non valido");
        setIsLoading(false);
        return;
      }
      
      try {
        const restaurantDoc = await getDoc(doc(db, "restaurants", id));
        
        if (!restaurantDoc.exists()) {
          toast.error("Ristorante non trovato");
          setIsLoading(false);
          return;
        }
        
        const data = restaurantDoc.data();
        
        // Fetch additional data like opening hours
        let openingHours: { day: string; hours: string }[] = [];
        try {
          const hoursDoc = await getDoc(doc(db, "restaurants", id, "details", "hours"));
          if (hoursDoc.exists()) {
            openingHours = hoursDoc.data().schedule || [];
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
      } catch (error) {
        console.error("Error fetching restaurant details:", error);
        toast.error("Si è verificato un errore nel caricamento dei dettagli del ristorante");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRestaurantDetails();
  }, [id]);
  
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
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <RestaurantDetails 
        restaurant={restaurant} 
        initialBookingCode={bookingCode || ''}
        initialRestaurantCode={restaurantCode || ''}
      />
    </Layout>
  );
};

export default RestaurantPage;
