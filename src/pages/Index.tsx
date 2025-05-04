
import React, { useEffect, useState, useCallback } from 'react';
import Layout from '@/components/Layout';
import WelcomeHeader from '@/components/Home/WelcomeHeader';
import RegionAlert from '@/components/Home/RegionAlert';
import SearchBar from '@/components/Home/SearchBar';
import RestaurantList from '@/components/Home/RestaurantList';
import NavigationButtons from '@/components/Home/NavigationButtons';
import { useRestaurantList } from '@/hooks/useRestaurantList';
import { Restaurant } from '@/components/Restaurant/RestaurantCard';
import { toast } from 'sonner';

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
  
  const [favoriteRestaurants, setFavoriteRestaurants] = useState<string[]>(() => {
    // Carica i preferiti dal localStorage all'inizializzazione
    const storedFavorites = localStorage.getItem('favoriteRestaurants');
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });

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

  // Gestisce l'aggiunta/rimozione dai preferiti
  const handleToggleFavorite = useCallback((id: string) => {
    setFavoriteRestaurants(prevFavorites => {
      const isCurrentlyFavorite = prevFavorites.includes(id);
      let newFavorites;
      
      if (isCurrentlyFavorite) {
        // Rimuovi dai preferiti
        newFavorites = prevFavorites.filter(favId => favId !== id);
        toast.success("Ristorante rimosso dai preferiti");
      } else {
        // Aggiungi ai preferiti
        newFavorites = [...prevFavorites, id];
        toast.success("Ristorante aggiunto ai preferiti");
      }
      
      // Salva nel localStorage
      localStorage.setItem('favoriteRestaurants', JSON.stringify(newFavorites));
      return newFavorites;
    });
  }, []);

  // Aggiorna la proprietà isFavorite nei ristoranti mostrati
  const restaurantsWithFavorites = restaurants.map(restaurant => ({
    ...restaurant,
    isFavorite: favoriteRestaurants.includes(restaurant.id)
  }));

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
            restaurants={restaurantsWithFavorites}
            isLoading={isLoading}
            regionStatus={regionStatus}
            onRetry={refreshRestaurants}
            onToggleFavorite={handleToggleFavorite}
          />
        </div>

        {/* Navigation buttons */}
        <NavigationButtons isRegionAvailable={regionStatus.inRegion} />
      </div>
    </Layout>
  );
};

export default Index;
