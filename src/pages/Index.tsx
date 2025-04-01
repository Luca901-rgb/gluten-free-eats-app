
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import RestaurantCard, { Restaurant } from '@/components/Restaurant/RestaurantCard';

// Sample data for now - would connect to an API in a real app
const sampleRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'La Trattoria Senza Glutine',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviews: 128,
    cuisine: 'Italiana',
    distance: '0.8 km',
    isFavorite: false,
  },
  {
    id: '2',
    name: 'Pizzeria Gluten Free',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.5,
    reviews: 95,
    cuisine: 'Pizzeria',
    distance: '1.2 km',
    isFavorite: true,
  },
  {
    id: '3',
    name: 'Pasta & Risotti',
    image: 'https://images.unsplash.com/photo-1458644267420-66bc8a5f21e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.3,
    reviews: 72,
    cuisine: 'Italiana',
    distance: '2.5 km',
    isFavorite: false,
  },
  {
    id: '4',
    name: 'La Celiachia',
    image: 'https://images.unsplash.com/photo-1515669097368-22e68427d265?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviews: 103,
    cuisine: 'Bistro',
    distance: '3.1 km',
    isFavorite: false,
  },
  {
    id: '5',
    name: 'Beato Te',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.2,
    reviews: 85,
    cuisine: 'Mediterranea',
    distance: '3.7 km',
    isFavorite: true,
  },
];

const Index = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>(sampleRestaurants);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would filter from the API
    // For demo, just filter the sample data
    const filtered = sampleRestaurants.filter(restaurant => 
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setRestaurants(filtered);
  };

  const handleToggleFavorite = (id: string) => {
    setRestaurants(restaurants.map(restaurant => 
      restaurant.id === id 
        ? { ...restaurant, isFavorite: !restaurant.isFavorite } 
        : restaurant
    ));
  };

  return (
    <Layout>
      <div className="px-4 py-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-poppins font-bold text-primary">Gluten Free Eats</h1>
          <p className="text-gray-600">Scopri i ristoranti gluten free vicino a te</p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              type="text"
              placeholder="Cerca ristoranti o cucina..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button type="submit" className="bg-primary hover:bg-primary/90">
            Cerca
          </Button>
        </form>

        <div className="space-y-2">
          <h2 className="text-xl font-poppins font-semibold">Ristoranti in evidenza</h2>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div 
                  key={i} 
                  className="h-48 bg-gray-200 animate-pulse rounded-lg"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {restaurants.map(restaurant => (
                <RestaurantCard 
                  key={restaurant.id} 
                  restaurant={restaurant} 
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
              
              {restaurants.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">Nessun ristorante trovato</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
