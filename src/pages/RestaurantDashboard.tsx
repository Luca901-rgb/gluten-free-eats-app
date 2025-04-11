
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
    <Layout hideNavigation={true}>
      <div className="bg-amber-50/50 p-4 text-center font-medium text-amber-800 border-b border-amber-200">
        Questa è l'interfaccia dedicata al ristoratore per gestire la propria attività
      </div>
      <TabProvider>
        <div className="relative">
          <DashboardHeader restaurantData={restaurantData} />
          <DashboardNavigation isRestaurantOwner={isRestaurantOwner} />
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
