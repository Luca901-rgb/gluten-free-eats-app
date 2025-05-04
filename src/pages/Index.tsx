
import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import WelcomeHeader from '@/components/Home/WelcomeHeader';
import RegionAlert from '@/components/Home/RegionAlert';
import SearchBar from '@/components/Home/SearchBar';
import RestaurantList from '@/components/Home/RestaurantList';
import NavigationButtons from '@/components/Home/NavigationButtons';
import { useRestaurantList } from '@/hooks/useRestaurantList';

const Index = () => {
  const {
    restaurants,
    searchTerm,
    setSearchTerm,
    isLoading,
    regionStatus,
    handleSearch,
    refreshRestaurants
  } = useRestaurantList();
  
  // Log per debug
  useEffect(() => {
    console.log("Index page - Mounting");
    console.log("Initial restaurants:", restaurants);
  }, []);

  // Log quando cambiano i ristoranti
  useEffect(() => {
    console.log("Restaurants changed:", restaurants);
  }, [restaurants]);

  // Carica automaticamente i ristoranti all'apertura dell'app
  useEffect(() => {
    console.log("Forzando ricarica ristoranti dalla pagina Index");
    
    // Carica immediatamente senza attendere l'interazione utente
    refreshRestaurants();
    
  }, [refreshRestaurants]);

  return (
    <Layout>
      <div className="w-full px-4 py-6 space-y-6">
        <WelcomeHeader />
        
        {/* Region alerts */}
        <RegionAlert regionStatus={regionStatus} />
        
        {/* Search functionality */}
        <SearchBar 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          onSubmit={handleSearch} 
        />

        {/* Restaurant listings */}
        <div className="space-y-2">
          <h2 className="text-xl font-poppins font-semibold">Ristoranti in evidenza</h2>
          <RestaurantList 
            restaurants={restaurants}
            isLoading={isLoading}
            regionStatus={regionStatus}
            onRetry={refreshRestaurants}
          />
        </div>

        {/* Only show the "Near you" button now */}
        {regionStatus.inRegion && (
          <NavigationButtons isRegionAvailable={regionStatus.inRegion} />
        )}
      </div>
    </Layout>
  );
};

export default Index;
