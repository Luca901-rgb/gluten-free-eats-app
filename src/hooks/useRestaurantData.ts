
import { useState, useEffect, useCallback } from 'react';

export interface RestaurantData {
  id?: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  openingHours: Array<{
    days: string;
    hours: string;
  }>;
  rating: number;
  totalReviews: number;
  coverImage: string;
  location?: {
    lat: number;
    lng: number;
  };
  cuisine?: string;
  hasGlutenFreeOptions?: boolean;
}

export const useRestaurantData = (restaurantId?: string) => {
  const [restaurantData, setRestaurantData] = useState<RestaurantData>(() => {
    // Prima cerca nel localStorage per un caricamento istantaneo
    try {
      const cached = localStorage.getItem('cachedKeccabioRestaurant');
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) {
      console.error("Errore nel recupero dati dalla cache:", e);
    }
    
    // Dati di fallback se non ci sono dati in cache
    return {
      id: '1',
      name: 'Trattoria Keccabio',
      description: 'Ristorante 100% gluten free specializzato in cucina campana tradizionale. Il nostro locale è certificato dall\'Associazione Italiana Celiachia e tutto il nostro menù è privo di glutine. Dal pane alla pasta, dalle pizze ai dolci, offriamo un\'esperienza gastronomica completa senza compromessi sul gusto.',
      address: 'Via Toledo 42, Napoli, 80132',
      phone: '+39 081 1234567',
      email: 'keccabio@gmail.com',
      website: 'www.keccabio.it',
      openingHours: [
        { days: 'Lunedì', hours: 'Chiuso' },
        { days: 'Martedì-Venerdì', hours: '12:00-14:30, 19:00-22:30' },
        { days: 'Sabato', hours: '12:00-15:00, 19:00-23:00' },
        { days: 'Domenica', hours: '12:00-15:00, 19:00-22:00' },
      ],
      rating: 4.7,
      totalReviews: 128,
      coverImage: '/placeholder.svg',
      // Coordinate precise per Via Toledo 42, Napoli
      location: {
        lat: 40.8388, 
        lng: 14.2488
      },
      cuisine: 'Campana Gluten Free',
      hasGlutenFreeOptions: true
    };
  });

  // Funzione di cache ottimizzata che evita aggiornamenti superflui
  const cacheRestaurantData = useCallback((data: RestaurantData) => {
    try {
      // Cache per questa pagina
      localStorage.setItem('cachedKeccabioRestaurant', JSON.stringify(data));
      
      // Aggiunge il ristorante al formato di cache per useRestaurantList
      const cachedRestaurants = localStorage.getItem('cachedRestaurants');
      let restaurantsArray = cachedRestaurants ? JSON.parse(cachedRestaurants) : [];
      
      // Verifica se il ristorante è già nella cache per evitare duplicati
      const restaurantExists = restaurantsArray.some((r: any) => r.id === data.id);
      
      if (!restaurantExists) {
        // Formato per RestaurantCard
        const cardFormat = {
          id: data.id || '1',
          name: data.name,
          image: data.coverImage,
          rating: data.rating,
          reviews: data.totalReviews,
          cuisine: data.cuisine || 'Campana Gluten Free',
          description: data.description,
          address: data.address,
          hasGlutenFreeOptions: true,
          isFavorite: false,
          location: data.location,
          // Timestamp per ordinare per recente
          cachedAt: Date.now()
        };
        
        restaurantsArray.push(cardFormat);
      } else {
        // Aggiorna i dati esistenti invece di aggiungerne di nuovi
        restaurantsArray = restaurantsArray.map((r: any) => 
          r.id === data.id ? {
            ...r,
            name: data.name,
            image: data.coverImage,
            rating: data.rating,
            reviews: data.totalReviews,
            cuisine: data.cuisine || 'Campana Gluten Free',
            description: data.description,
            address: data.address,
            hasGlutenFreeOptions: true,
            location: data.location,
            cachedAt: Date.now()
          } : r
        );
      }
      
      // Limita la cache a massimo 30 ristoranti, mantenendo i più recenti
      if (restaurantsArray.length > 30) {
        restaurantsArray.sort((a: any, b: any) => (b.cachedAt || 0) - (a.cachedAt || 0));
        restaurantsArray = restaurantsArray.slice(0, 30);
      }
      
      localStorage.setItem('cachedRestaurants', JSON.stringify(restaurantsArray));
    } catch (e) {
      console.error("Errore nel salvataggio cache ristorante:", e);
    }
  }, []);

  // Cache all'inizializzazione
  useEffect(() => {
    cacheRestaurantData(restaurantData);
  }, [restaurantData, cacheRestaurantData]);

  return { restaurantData, cacheRestaurantData };
};
