
import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import WelcomeHeader from '@/components/Home/WelcomeHeader';
import RegionAlert from '@/components/Home/RegionAlert';
import SearchBar from '@/components/Home/SearchBar';
import RestaurantList from '@/components/Home/RestaurantList';
import NavigationButtons from '@/components/Home/NavigationButtons';
import { useRestaurantList } from '@/hooks/useRestaurantList';
import { sampleRestaurant } from '@/data/sampleRestaurant';

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
  
  // Debug logs
  useEffect(() => {
    console.log("Index page - Mounting");
    console.log("Initial restaurants:", restaurants);
  }, []);

  useEffect(() => {
    console.log("Restaurants changed:", restaurants);
  }, [restaurants]);

  // Forza il caricamento dei ristoranti all'apertura della pagina
  useEffect(() => {
    console.log("Forzando ricarica ristoranti dalla pagina Index");
    
    // Forza un refresh immediato
    refreshRestaurants();
    
    // Imposta anche un controllo dopo 500ms nel caso il primo caricamento fallisse
    const timer = setTimeout(() => {
      console.log("Controllo di sicurezza per i ristoranti");
      refreshRestaurants();
    }, 500);
    
    return () => clearTimeout(timer);
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
