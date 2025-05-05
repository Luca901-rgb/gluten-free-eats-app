
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Search, MapPin, Filter, Sliders } from 'lucide-react';
import { useRestaurantList } from '@/hooks/useRestaurantList';
import { Card } from '@/components/ui/card';
import StarRating from '@/components/common/StarRating';

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { 
    restaurants, 
    isLoading, 
    getUserLocation,
    refreshRestaurants
  } = useRestaurantList();

  useEffect(() => {
    refreshRestaurants();
    getUserLocation();
  }, [refreshRestaurants, getUserLocation]);

  const filteredRestaurants = restaurants
    .filter(restaurant => 
      restaurant.hasGlutenFreeOptions && 
      (!searchQuery || 
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (restaurant.address && restaurant.address.toLowerCase().includes(searchQuery.toLowerCase()))
      ) &&
      (!selectedCategory || 
        restaurant.cuisine?.toLowerCase().includes(selectedCategory.toLowerCase())
      )
    );

  const categories = [
    "Ristorante", 
    "Pizzeria", 
    "Trattoria", 
    "Pub", 
    "Panineria"
  ];

  const handleRestaurantClick = (id: string) => {
    navigate(`/restaurant/${id}`);
  };

  return (
    <Layout>
      <div className="p-4 pb-20">
        <h1 className="text-2xl font-bold mb-4 text-left">Cerca Ristoranti</h1>
        
        <div className="relative mb-4">
          <div className="flex items-center bg-white border rounded-full p-2 pl-4">
            <Search className="text-gray-400 mr-2" size={20} />
            <input
              type="text"
              placeholder="Ricerca per nome o indirizzo..."
              className="flex-1 outline-none text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              className="ml-2 bg-green-default text-white rounded-full p-2"
              onClick={getUserLocation}
            >
              <MapPin size={18} />
            </button>
          </div>
        </div>
        
        <div className="flex items-center mb-4 overflow-x-auto py-1">
          {categories.map(category => (
            <button
              key={category}
              className={`mr-2 px-3 py-1 text-sm rounded-full whitespace-nowrap ${
                selectedCategory === category 
                  ? 'bg-green-default text-white' 
                  : 'bg-white border text-gray-700'
              }`}
              onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
            >
              {category}
            </button>
          ))}
          
          <button className="ml-auto p-2 bg-white border rounded-lg">
            <Sliders size={18} className="text-gray-700" />
          </button>
        </div>
        
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <p>Caricamento ristoranti...</p>
            </div>
          ) : filteredRestaurants.length > 0 ? (
            filteredRestaurants.map(restaurant => (
              <Card 
                key={restaurant.id} 
                className="restaurant-card overflow-hidden"
                onClick={() => handleRestaurantClick(restaurant.id)}
              >
                <div className="flex border-b">
                  <div className="w-24 h-24 bg-gray-200">
                    <img 
                      src={restaurant.image || "/lovable-uploads/72ce3268-fe10-45d6-9c12-aecfe184f7ed.png"} 
                      alt={restaurant.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/lovable-uploads/72ce3268-fe10-45d6-9c12-aecfe184f7ed.png";
                      }}
                    />
                  </div>
                  <div className="flex-1 p-3 text-left">
                    <h3 className="font-bold">{restaurant.name}</h3>
                    <div className="flex items-center my-1">
                      <StarRating rating={restaurant.rating} size="sm" />
                      <span className="text-xs text-gray-600 ml-1">{restaurant.reviews || 0}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">{restaurant.cuisine}</span>
                      {restaurant.distance && (
                        <span className="text-gray-500 flex items-center">
                          <MapPin size={12} className="mr-1" /> {restaurant.distance}
                        </span>
                      )}
                    </div>
                    <div className="mt-1">
                      <span className="green-tag text-xs">100% Gluten Free</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-8">
              <Search size={48} className="mx-auto text-gray-300 mb-2" />
              <p className="text-gray-600">Nessun ristorante trovato</p>
              <p className="text-sm text-gray-500">Prova a modificare i parametri di ricerca</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SearchPage;
