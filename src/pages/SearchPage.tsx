
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Search, MapPin, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import StarRating from '@/components/common/StarRating';
import { useRestaurantList } from '@/hooks/useRestaurantList';
import { useNavigate } from 'react-router-dom';

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { restaurants, isLoading } = useRestaurantList();
  const navigate = useNavigate();

  const handleRestaurantClick = (id: string) => {
    navigate(`/restaurant/${id}`);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[#bfe5c0] pb-20">
        {/* Search status message */}
        <div className="bg-white p-4 flex items-center space-x-2 rounded-lg m-4 shadow-sm">
          <div className="bg-black bg-opacity-10 p-2 rounded-full">
            <img src="/lovable-uploads/cb016c24-7700-4927-b5e2-40af08e4b219.png" alt="Spiga" className="w-5 h-5" />
          </div>
          <p className="text-gray-800 text-sm">Ricerca posizione in corso...</p>
        </div>

        {/* Page title */}
        <div className="px-4 pt-2 pb-6">
          <h1 className="text-3xl font-bold text-[#38414a]">Cerca ristoranti senza glutine</h1>
        </div>

        {/* Search input */}
        <div className="px-4 mb-6">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input 
                placeholder="Inserisci nome o indirizzo..." 
                className="pl-10 bg-white py-5 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              className="bg-white hover:bg-gray-100 text-gray-800 px-6 py-5 h-auto flex items-center space-x-1 rounded-lg border shadow-sm"
            >
              <img src="/lovable-uploads/c40a4cd3-13d0-4541-bf02-9f35cda8a4ce.png" alt="App Logo" className="w-5 h-5 mr-1" />
              <span className="text-sm">Vicino a me</span>
            </Button>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="px-4 mb-6 overflow-x-auto">
          <div className="flex space-x-2">
            <button className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-60 rounded-full border text-gray-800 whitespace-nowrap">
              <img src="/lovable-uploads/cb016c24-7700-4927-b5e2-40af08e4b219.png" alt="Wheat" className="w-5 h-5" />
              <span className="text-xs">Pizzeria</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-60 rounded-full border text-gray-800 whitespace-nowrap">
              <img src="/lovable-uploads/cb016c24-7700-4927-b5e2-40af08e4b219.png" alt="Wheat" className="w-5 h-5" />
              <span className="text-xs">Ristorante</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-60 rounded-full border text-gray-800 whitespace-nowrap">
              <img src="/lovable-uploads/cb016c24-7700-4927-b5e2-40af08e4b219.png" alt="Wheat" className="w-5 h-5" />
              <span className="text-xs">Trattoria</span>
            </button>
            <button className="p-3 bg-white rounded-lg border">
              <SlidersHorizontal size={18} className="text-gray-800" />
            </button>
          </div>
        </div>

        {/* Restaurant cards - loading skeletons */}
        {isLoading ? (
          <div className="px-4 space-y-4">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="bg-white/60 p-4 h-28 animate-pulse">
                <div className="flex">
                  <div className="w-1/3 bg-gray-200 rounded-lg h-full"></div>
                  <div className="w-2/3 pl-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="px-4 space-y-4">
            {restaurants.map((restaurant) => (
              <Card
                key={restaurant.id}
                className="bg-white/60 hover:bg-white transition-colors overflow-hidden cursor-pointer"
                onClick={() => handleRestaurantClick(restaurant.id)}
              >
                <div className="flex">
                  <div className="w-1/3">
                    <img
                      src={restaurant.image || "/placeholder.svg"}
                      alt={restaurant.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="w-2/3 p-3">
                    <h3 className="font-bold text-sm mb-1">{restaurant.name}</h3>
                    <div className="flex items-center mb-1">
                      <StarRating rating={restaurant.rating || 0} className="mr-1" size={14} />
                      <span className="text-xs text-gray-600">{restaurant.reviews || 0} recensioni</span>
                    </div>
                    <p className="text-xs text-gray-700">{restaurant.cuisine}</p>
                    {restaurant.hasGlutenFreeOptions && (
                      <span className="inline-flex items-center mt-1 px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">
                        <img src="/lovable-uploads/cb016c24-7700-4927-b5e2-40af08e4b219.png" alt="Spiga" className="w-3 h-3 mr-1" />
                        100% Gluten Free
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SearchPage;
