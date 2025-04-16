
import { useState, useEffect } from 'react';

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
}

export const useRestaurantData = (restaurantId?: string) => {
  // In una vera app, questo recupererebbe i dati da un'API in base al restaurantId
  const [restaurantData] = useState<RestaurantData>({
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
    }
  });

  // Cache del ristorante nel localStorage per accesso rapido
  useEffect(() => {
    try {
      localStorage.setItem('cachedKeccabioRestaurant', JSON.stringify(restaurantData));
    } catch (e) {
      console.error("Errore nel salvataggio cache ristorante:", e);
    }
  }, [restaurantData]);

  return { restaurantData };
};
