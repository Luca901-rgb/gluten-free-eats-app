
import { useState } from 'react';

export interface RestaurantData {
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
}

export const useRestaurantData = (restaurantId?: string) => {
  // In a real app, this would fetch data from an API based on the restaurantId
  const [restaurantData] = useState<RestaurantData>({
    name: 'La Trattoria Senza Glutine',
    description: 'Ristorante 100% gluten free specializzato in cucina italiana tradizionale. Il nostro locale è certificato dall\'Associazione Italiana Celiachia e tutto il nostro menù è privo di glutine. Dal pane alla pasta, dalle pizze ai dolci, offriamo un\'esperienza gastronomica completa senza compromessi sul gusto.',
    address: 'Via Roma 123, Milano, 20100',
    phone: '+39 02 1234567',
    email: 'info@trattoriasenzaglutine.it',
    website: 'www.trattoriasenzaglutine.it',
    openingHours: [
      { days: 'Lunedì', hours: 'Chiuso' },
      { days: 'Martedì-Venerdì', hours: '12:00-14:30, 19:00-22:30' },
      { days: 'Sabato', hours: '12:00-15:00, 19:00-23:00' },
      { days: 'Domenica', hours: '12:00-15:00, 19:00-22:00' },
    ],
    rating: 4.7,
    totalReviews: 128,
    coverImage: '/placeholder.svg'
  });

  // In a real app, we might include loading and error states here
  return { restaurantData };
};
