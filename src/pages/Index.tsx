
import React from 'react';
import Layout from '@/components/Layout';
import WelcomeHeader from '@/components/Home/WelcomeHeader';
import RestaurateurAccess from '@/components/Home/RestaurateurAccess';
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
    handleToggleFavorite
  } = useRestaurantList();

  return (
    <Layout>
      <div className="px-4 py-6 space-y-6">
        <WelcomeHeader />
        <RestaurateurAccess />
        
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
          />
        </div>

        {/* Navigation buttons */}
        <NavigationButtons isRegionAvailable={regionStatus.inRegion} />
      </div>
    </Layout>
  );
};

export default Index;
