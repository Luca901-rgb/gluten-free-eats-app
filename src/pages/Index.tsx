
import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import { useNavigate } from 'react-router-dom';
import { Search, Heart, MapPin } from 'lucide-react';
import { useRestaurantList } from '@/hooks/useRestaurantList';
import { Card } from '@/components/ui/card';
import StarRating from '@/components/common/StarRating';
import { Link } from 'react-router-dom';
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
      <div className="w-full px-4 py-6 pb-20 space-y-6 bg-green-light">
        {/* Simplified search bar */}
        <div 
          className="flex items-center bg-white rounded-full p-4 shadow-sm" 
          onClick={handleSearchClick}
        >
          <Search className="text-gray-400 mr-2" size={20} />
          <span className="text-gray-500">Cerca ristoranti o cucina...</span>
        </div>
        
        {/* Login/Register options */}
        <div className="flex flex-col gap-2 mb-4">
          <Link to="/login">
            <Button variant="default" className="w-full">Accedi</Button>
          </Link>
          <Link to="/register">
            <Button variant="outline" className="w-full">Registrati</Button>
          </Link>
        </div>
        
        {/* Featured restaurants */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-left">Ristoranti in evidenza</h2>
          
          {isLoading ? (
            <div className="flex justify-center py-20">
              <p>Caricamento ristoranti...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {restaurants.slice(0, 3).map(restaurant => (
                <Card 
                  key={restaurant.id} 
                  className="rounded-xl overflow-hidden shadow-sm bg-white"
                  onClick={() => handleRestaurantClick(restaurant.id)}
                >
                  <div className="relative">
                    <img
                      src={restaurant.image || "/placeholder.svg"}
                      alt={restaurant.name}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <button className="p-2 bg-white rounded-full shadow">
                        <MapPin size={18} className="text-gray-600" />
                      </button>
                      <button className="p-2 bg-white rounded-full shadow">
                        <Heart size={18} className="text-gray-600" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4 text-left">
                    <h3 className="text-lg font-bold">{restaurant.name}</h3>
                    <div className="flex items-center my-1">
                      <StarRating rating={restaurant.rating || 0} />
                      <span className="text-sm text-gray-600 ml-2">{restaurant.reviews || 0} recensioni</span>
                    </div>
                    <p className="text-sm text-gray-600">{restaurant.cuisine}</p>
                    {restaurant.hasGlutenFreeOptions && (
                      <div className="mt-2">
                        <span className="green-tag">100% Gluten Free</span>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
