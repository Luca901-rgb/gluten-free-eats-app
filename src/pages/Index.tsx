
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
    handleToggleFavorite,
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
    console.log("Caricamento ristoranti all'avvio");
    
    // Pulizia della cache all'avvio per essere sicuri di avere dati freschi
    try {
      const cacheTimestamp = localStorage.getItem('lastCacheTime');
      if (!cacheTimestamp || Date.now() - parseInt(cacheTimestamp) > 10 * 60 * 1000) { // 10 minuti
        console.log("Cache scaduta o non presente, ricarico i dati");
        localStorage.removeItem('cachedRestaurants');
        localStorage.setItem('lastCacheTime', Date.now().toString());
      } else {
        console.log("Cache ancora valida");
      }
    } catch (e) {
      console.error("Errore nella gestione della cache:", e);
    }
    
    // Carica immediatamente senza attendere l'interazione utente
    refreshRestaurants();
    
    // Imposta un refresh periodico dei dati ogni 5 minuti se l'utente rimane sulla pagina
    const refreshInterval = setInterval(() => {
      if (navigator.onLine) {
        console.log("Aggiornamento periodico dei dati");
        refreshRestaurants();
      }
    }, 5 * 60 * 1000);
    
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
            onToggleFavorite={handleToggleFavorite}
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
