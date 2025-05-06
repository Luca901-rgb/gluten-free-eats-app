
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useRestaurantList } from '@/hooks/useRestaurantList';
import StarRating from '@/components/common/StarRating';
import { Button } from '@/components/ui/button';
import { sampleRestaurant } from '@/data/sampleRestaurant';
import Layout from '@/components/Layout';

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
      <div className="w-full bg-[#a3e0a8] min-h-screen pb-20">
        {/* Header with title */}
        <div className="bg-green-500 text-white p-4 flex items-center justify-center">
          <h1 className="text-xl font-bold flex items-center">
            <img src="/lovable-uploads/cb016c24-7700-4927-b5e2-40af08e4b219.png" alt="Logo" className="w-8 h-8 mr-2" />
            GlutenFree Eats
          </h1>
        </div>
        
        <div className="bg-[#bfe5c0] p-4 pb-8">
          {/* Large logo and subtitle */}
          <div className="flex flex-col items-center mb-6 mt-2">
            <div className="flex items-center text-4xl font-bold text-[#38414a] mb-2">
              <img src="/lovable-uploads/cb016c24-7700-4927-b5e2-40af08e4b219.png" alt="Logo" className="w-14 h-14 mr-3" />
              <span className="text-shadow">Gluten Free Eats</span>
            </div>
            <p className="text-[#38414a] text-lg">Scopri i ristoranti gluten free vicino a te</p>
          </div>
          
          {/* Search bar */}
          <div className="mb-6">
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
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#38414a]">Ristoranti in evidenza</h2>
            
            {isLoading ? (
              <div className="flex justify-center py-10">
                <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="space-y-4 mt-4">
                <div 
                  className="bg-white rounded-lg shadow overflow-hidden cursor-pointer"
                  onClick={() => handleRestaurantClick(sampleRestaurant.id)}
                >
                  <div className="relative">
                    <img
                      src={sampleRestaurant.image || "/placeholder.svg"}
                      alt={sampleRestaurant.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <button className="bg-white rounded-full p-2 shadow">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                      </button>
                      <button className="bg-white rounded-full p-2 shadow">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-2xl font-bold mb-1">Trattoria Keccabio</h3>
                    <div className="flex items-center justify-center mb-2">
                      <div className="flex">
                        {[1, 2, 3, 4].map((star) => (
                          <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                        ))}
                        <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      </div>
                      <span className="text-gray-600 ml-2">128 recensioni</span>
                    </div>
                    <p className="text-center text-gray-600 mb-2">Campana Gluten Free</p>
                    <div className="flex justify-center">
                      <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
                        100% Gluten Free
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
