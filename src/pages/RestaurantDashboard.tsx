
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import DashboardHeader from '@/components/Restaurant/DashboardHeader';
import DashboardNavigation from '@/components/Restaurant/DashboardNavigation';
import DashboardContent from '@/components/Restaurant/DashboardContent';
import { TabProvider } from '@/context/TabContext';
import { useRestaurantData } from '@/hooks/useRestaurantData';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';

const RestaurantDashboard = () => {
  const { restaurantData } = useRestaurantData();
  const isRestaurantOwner = true;
  const navigate = useNavigate();

  const handleLogout = () => {
    // Rimuovi lo stato di autenticazione
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userType');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    
    toast.success("Logout effettuato con successo");
    navigate('/');
  };

  return (
    <Layout hideNavigation={true}>
      <div className="bg-amber-50/50 p-4 text-center font-medium text-amber-800 border-b border-amber-200">
        Questa è l'interfaccia dedicata al ristoratore per gestire la propria attività
      </div>
      <div className="flex justify-end p-2 bg-white border-b">
        <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-1.5">
          <LogOut size={16} />
          <span>Esci</span>
        </Button>
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
