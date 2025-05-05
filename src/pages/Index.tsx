
import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import { useNavigate } from 'react-router-dom';
import { Search, Heart, MapPin, Send, Calendar } from 'lucide-react';
import { useRestaurantList } from '@/hooks/useRestaurantList';
import { Card } from '@/components/ui/card';
import StarRating from '@/components/common/StarRating';
import { Button } from '@/components/ui/button';

const Index = () => {
  const navigate = useNavigate();
  const {
    restaurants,
    isLoading,
    refreshRestaurants
  } = useRestaurantList();
  
  // Force loading restaurants when the page opens
  useEffect(() => {
    refreshRestaurants();
  }, [refreshRestaurants]);

  const handleRestaurantClick = (id: string) => {
    navigate(`/restaurant/${id}`);
  };

  const handleSearchClick = () => {
    navigate('/search');
  };

  return (
    <Layout>
      <div className="w-full space-y-6 bg-green-100/60 min-h-screen pb-24">
        {/* Header with title */}
        <div className="bg-green-500 text-white p-4 flex items-center justify-center">
          <h1 className="text-xl font-bold flex items-center">
            <img src="/placeholder.svg" alt="Logo" className="w-8 h-8 mr-2" />
            GlutenFree Eats
          </h1>
        </div>
        
        {/* Search bar */}
        <div className="px-4">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative bg-white rounded-lg shadow-sm overflow-hidden">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Cerca ristoranti o cucina..." 
                className="w-full pl-10 pr-4 py-3 outline-none"
                onClick={handleSearchClick}
              />
            </div>
            <Button 
              onClick={handleSearchClick}
              className="bg-slate-700 hover:bg-slate-800 px-5 py-3 h-auto"
            >
              Cerca
            </Button>
          </div>
        </div>
        
        {/* Featured restaurants */}
        <div className="px-4 space-y-4">
          <h2 className="text-xl font-semibold text-center">Ristoranti in evidenza</h2>
          
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {restaurants.slice(0, 1).map(restaurant => (
                <Card 
                  key={restaurant.id} 
                  className="overflow-hidden bg-white rounded-lg shadow"
                  onClick={() => handleRestaurantClick(restaurant.id)}
                >
                  <div className="relative">
                    <img
                      src={restaurant.image || "/placeholder.svg"}
                      alt={restaurant.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <button className="p-2 bg-white rounded-full shadow">
                        <Send size={18} className="text-gray-600" />
                      </button>
                      <button className="p-2 bg-white rounded-full shadow">
                        <Heart size={18} className="text-gray-600" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-center">{restaurant.name}</h3>
                    <div className="flex items-center justify-center my-2">
                      <StarRating rating={restaurant.rating || 0} />
                      <span className="text-sm text-gray-600 ml-2">{restaurant.reviews || 0} recensioni</span>
                    </div>
                    <p className="text-center">Campana Gluten Free</p>
                    {restaurant.hasGlutenFreeOptions && (
                      <div className="flex justify-center mt-2">
                        <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
                          100% Gluten Free
                        </span>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-green-500 flex justify-around items-center py-2 text-white">
        <button className="flex flex-col items-center px-4">
          <div className="p-1 rounded-full bg-green-600">
            <MapPin size={20} />
          </div>
          <span className="text-xs mt-1">Home</span>
        </button>
        <button className="flex flex-col items-center px-4">
          <Search size={20} />
          <span className="text-xs mt-1">Ricerca</span>
        </button>
        <button className="flex flex-col items-center px-4">
          <Heart size={20} />
          <span className="text-xs mt-1">Preferiti</span>
        </button>
        <button className="flex flex-col items-center px-4">
          <Calendar size={20} />
          <span className="text-xs mt-1">Prenotazioni</span>
        </button>
      </div>
    </Layout>
  );
};

export default Index;
