
import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Search, Wheat } from 'lucide-react';
import NavigationButtons from '@/components/Home/NavigationButtons';
import RestaurantList from '@/components/Home/RestaurantList';
import { useRestaurantList } from '@/hooks/useRestaurantList';

const ClientHome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    restaurants,
    isLoading,
    regionStatus,
    refreshRestaurants,
    retryRegionCheck
  } = useRestaurantList();
  
  // Force loading restaurants when the page opens
  useEffect(() => {
    refreshRestaurants();
  }, [refreshRestaurants]);
  
  const handleSearchClick = () => {
    navigate('/search');
  };
  
  return (
    <Layout>
      <div className="w-full bg-[#a3e0a8] min-h-screen pb-20">
        {/* Header with title */}
        <div className="bg-green-500 text-white p-4 flex items-center justify-center">
          <h1 className="text-xl font-bold flex items-center">
            <Wheat className="w-7 h-7 mr-2" />
            GlutenFree Eats
          </h1>
        </div>
        
        <div className="bg-[#bfe5c0] p-4 pb-8">
          {/* Welcome message */}
          <div className="flex flex-col items-center mb-6 mt-2">
            <div className="flex items-center text-4xl font-bold text-[#38414a] mb-2">
              <Wheat className="w-12 h-12 mr-3" />
              <span className="text-shadow">Benvenuto</span>
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
          
          {/* Navigation buttons */}
          <div className="mb-8">
            <NavigationButtons isRegionAvailable={true} />
          </div>
          
          {/* Featured restaurants */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#38414a]">Ristoranti in evidenza</h2>
            
            <RestaurantList 
              restaurants={restaurants} 
              isLoading={isLoading} 
              regionStatus={regionStatus}
              onRetry={retryRegionCheck}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ClientHome;
