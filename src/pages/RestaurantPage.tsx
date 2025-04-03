
import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import RestaurantDetails, { RestaurantDetailProps } from '@/components/Restaurant/RestaurantDetails';

// Sample restaurant data - would be fetched from API in real app
const sampleRestaurant: RestaurantDetailProps = {
  id: '1',
  name: 'La Trattoria Senza Glutine',
  description: 'Ristorante 100% gluten free specializzato in cucina italiana tradizionale. Il nostro locale è certificato dall\'Associazione Italiana Celiachia e tutto il nostro menù è privo di glutine. Dal pane alla pasta, dalle pizze ai dolci, offriamo un\'esperienza gastronomica completa senza compromessi sul gusto.',
  coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
  images: [
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1458644267420-66bc8a5f21e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1515669097368-22e68427d265?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1495214783159-3503f1c2a8d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1473093226795-af9932fe5856?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  ],
  address: 'Via Roma 123, Milano, 20100',
  phone: '+39 02 1234567',
  openingHours: [
    { days: 'Lunedì', hours: 'Chiuso' },
    { days: 'Martedì-Venerdì', hours: '12:00-14:30, 19:00-22:30' },
    { days: 'Sabato', hours: '12:00-15:00, 19:00-23:00' },
    { days: 'Domenica', hours: '12:00-15:00, 19:00-22:00' },
  ],
  rating: 4.7,
  reviews: 128,
  hasGlutenFreeOptions: true,
  awards: [
    'Certificato AIC (Associazione Italiana Celiachia)',
    'Miglior ristorante gluten free 2023',
  ],
};

const RestaurantPage = () => {
  const { id } = useParams<{ id: string }>();
  
  // In a real app, you would fetch the restaurant data based on the ID
  // For now, we'll just use sample data
  
  return (
    <Layout>
      <RestaurantDetails restaurant={sampleRestaurant} />
    </Layout>
  );
};

export default RestaurantPage;
