
import { Restaurant } from '@/types/restaurant';

export const sampleRestaurant: Restaurant = {
  id: '1',
  name: 'Trattoria Keccabio',
  image: '/lovable-uploads/95f0a77e-f037-47c5-be02-90f2eaa053da.png', 
  rating: 4.8,
  reviews: 128,
  cuisine: 'Campana Gluten Free',
  description: 'Ristorante 100% gluten free specializzato in cucina campana tradizionale. Il nostro locale è certificato dall\'Associazione Italiana Celiachia e tutto il nostro menù è privo di glutine. Dal pane alla pasta, dalle pizze ai dolci, offriamo un\'esperienza gastronomica completa senza compromessi sul gusto.',
  address: 'Via Toledo 42, Napoli, 80132',
  hasGlutenFreeOptions: true,
  isFavorite: false,
  location: {
    lat: 40.8388, 
    lng: 14.2488
  },
  openingHours: [
    { days: 'Lunedì', hours: 'Chiuso' },
    { days: 'Martedì-Venerdì', hours: '12:00-14:30, 19:00-22:30' },
    { days: 'Sabato', hours: '12:00-15:00, 19:00-23:00' },
    { days: 'Domenica', hours: '12:00-15:00, 19:00-22:00' }
  ],
  phone: '+39 081 123 4567'
};
