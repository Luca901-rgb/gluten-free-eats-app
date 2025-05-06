import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import RestaurantDetails, { RestaurantDetailProps } from '@/components/Restaurant/RestaurantDetails';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import { sampleRestaurant } from '@/data/sampleRestaurant';

const RestaurantPage = () => {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [restaurant, setRestaurant] = useState<RestaurantDetailProps | null>(null);
  
  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      if (!id) {
        toast.error("ID del ristorante non valido");
        setIsLoading(false);
        return;
      }
      
      try {
        // If this is the sample restaurant (Keccabio), use its predefined data
        if (id === sampleRestaurant.id) {
          const keccabioDetails: RestaurantDetailProps = {
            id: sampleRestaurant.id,
            name: sampleRestaurant.name,
            description: sampleRestaurant.description || 'Ristorante 100% gluten free specializzato in cucina campana tradizionale.',
            coverImage: sampleRestaurant.image,
            images: [
              '/lovable-uploads/95f0a77e-f037-47c5-be02-90f2eaa053da.png',
              '/lovable-uploads/b21bbbb3-e4d7-4dfe-9487-6771cefd5463.png',
              '/lovable-uploads/6b05bf4a-3f83-4c13-a0a6-b1da63ae22c8.png',
              '/lovable-uploads/980b8b9d-0d2d-4177-a121-51beeced8789.png',
            ],
            address: sampleRestaurant.address || 'Via Toledo 42, Napoli, 80132',
            phone: sampleRestaurant.phone || '+39 081 123 4567',
            openingHours: sampleRestaurant.openingHours || [
              { days: 'Lunedì', hours: 'Chiuso' },
              { days: 'Martedì-Venerdì', hours: '12:00-14:30, 19:00-22:30' },
              { days: 'Sabato', hours: '12:00-15:00, 19:00-23:00' },
              { days: 'Domenica', hours: '12:00-15:00, 19:00-22:00' }
            ],
            rating: sampleRestaurant.rating || 4.8,
            reviews: sampleRestaurant.reviews || 128,
            hasGlutenFreeOptions: true,
            menuUrl: '/menu/keccabio',
            awards: ['Certificato AIC', 'Miglior Ristorante Gluten Free 2024']
          };
          
          setRestaurant(keccabioDetails);
          setIsLoading(false);
          return;
        }
        
        // Otherwise try to fetch from Firebase
        const restaurantDoc = await getDoc(doc(db, "restaurants", id));
        
        if (!restaurantDoc.exists()) {
          toast.error("Ristorante non trovato");
          setIsLoading(false);
          return;
        }
        
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
          } else {
            // Default opening hours if not available
            openingHours = [
              { days: 'Lunedì-Venerdì', hours: '12:00-15:00, 19:00-23:00' },
              { days: 'Sabato-Domenica', hours: '12:00-23:00' }
            ];
          }
        } catch (error) {
          console.error("Error fetching opening hours:", error);
          // Default opening hours in case of error
          openingHours = [
            { days: 'Lunedì-Venerdì', hours: '12:00-15:00, 19:00-23:00' },
            { days: 'Sabato-Domenica', hours: '12:00-23:00' }
          ];
        }
        
        setRestaurant({
          id,
          name: data?.name || 'Ristorante senza nome',
          description: data?.description || 'Nessuna descrizione disponibile',
          coverImage: data?.coverImage || '/placeholder.svg',
          images: data?.gallery || ['/placeholder.svg'],
          address: data?.address || 'Indirizzo non disponibile',
          phone: data?.phone || 'Telefono non disponibile',
          openingHours,
          rating: Number(data?.rating) || 4.0,
          reviews: Number(data?.reviewCount) || 0,
          hasGlutenFreeOptions: data?.hasGlutenFreeOptions || false
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
      <RestaurantDetails restaurant={restaurant} />
    </Layout>
  );
};

export default RestaurantPage;
