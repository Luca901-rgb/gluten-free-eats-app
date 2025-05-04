
import { Restaurant } from '@/types/restaurant';

export const sampleRestaurant: Restaurant = {
  id: '1',
  name: 'Trattoria Keccabio',
  image: '/placeholder.svg', 
  rating: 4.7,
  reviews: 128,
  cuisine: 'Campana Gluten Free',
  description: 'Ristorante 100% gluten free specializzato in cucina campana tradizionale.',
  address: 'Via Toledo 42, Napoli, 80132',
  hasGlutenFreeOptions: true,
  isFavorite: false,
  location: {
    lat: 40.8388, 
    lng: 14.2488
  }
};
