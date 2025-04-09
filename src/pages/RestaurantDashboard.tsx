
import React from 'react';
import Layout from '@/components/Layout';
import DashboardHeader from '@/components/Restaurant/DashboardHeader';
import DashboardNavigation from '@/components/Restaurant/DashboardNavigation';
import DashboardContent from '@/components/Restaurant/DashboardContent';
import { TabProvider } from '@/context/TabContext';
import { useRestaurantData } from '@/hooks/useRestaurantData';

const RestaurantDashboard = () => {
  const { restaurantData } = useRestaurantData();
  const isRestaurantOwner = true;

  return (
    <Layout>
      <TabProvider>
        <div className="relative">
          <DashboardHeader restaurantData={restaurantData} />
          <DashboardNavigation />
          <DashboardContent 
            restaurantData={restaurantData} 
            isRestaurantOwner={isRestaurantOwner} 
          />
        </div>
      </TabProvider>
    </Layout>
  );
};

export default RestaurantDashboard;
