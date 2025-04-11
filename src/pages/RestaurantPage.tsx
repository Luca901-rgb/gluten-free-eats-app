
import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import RestaurantDetails, { RestaurantDetailProps } from '@/components/Restaurant/RestaurantDetails';

const RestaurantPage = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  
  // Check if we have a booking code in the URL
  const searchParams = new URLSearchParams(location.search);
  const bookingCode = searchParams.get('bookingCode');
  const restaurantCode = searchParams.get('restaurantCode');
  
  // In a real app, we would fetch this data from an API based on the ID
  // For now, creating an empty restaurant object
  const emptyRestaurant: RestaurantDetailProps = {
    id: id || '1',
    name: 'Ristorante',
    description: 'Descrizione del ristorante non disponibile.',
    coverImage: '/placeholder.svg',
    images: ['/placeholder.svg'],
    address: 'Indirizzo non disponibile',
    phone: 'Telefono non disponibile',
    openingHours: [],
    rating: 0,
    reviews: 0,
    hasGlutenFreeOptions: true
  };
  
  return (
    <Layout>
      <RestaurantDetails 
        restaurant={emptyRestaurant} 
        initialBookingCode={bookingCode || ''}
        initialRestaurantCode={restaurantCode || ''}
      />
    </Layout>
  );
};

export default RestaurantPage;
