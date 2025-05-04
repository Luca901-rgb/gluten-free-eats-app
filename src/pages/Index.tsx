
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
    
    // Pulizia forzata della cache all'apertura della pagina
    try {
      localStorage.removeItem('cachedRestaurants');
      localStorage.removeItem('lastCacheTime');
      console.log("Cache forzatamente ripulita all'avvio della pagina");
    } catch (e) {
      console.error("Errore nella pulizia della cache:", e);
    }
  }, []);

  // Log quando cambiano i ristoranti
  useEffect(() => {
    console.log("Restaurants changed:", restaurants);
  }, [restaurants]);

  // Carica automaticamente i ristoranti all'apertura dell'app
  useEffect(() => {
    console.log("Caricamento ristoranti all'avvio");
    
    // Forza ricaricamento dati freschi all'avvio
    console.log("Forzo ricaricamento dati freschi");
    localStorage.removeItem('cachedRestaurants');
    localStorage.setItem('lastCacheTime', Date.now().toString());
    
    // Carica immediatamente senza attendere l'interazione utente
    refreshRestaurants();
    
    // Imposta un refresh periodico dei dati ogni 3 minuti se l'utente rimane sulla pagina
    const refreshInterval = setInterval(() => {
      if (navigator.onLine) {
        console.log("Aggiornamento periodico dei dati");
        refreshRestaurants();
      }
    }, 3 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
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

        {/* Navigation buttons */}
        <NavigationButtons isRegionAvailable={regionStatus.inRegion} />
      </div>
    </Layout>
  );
};

export default Index;
