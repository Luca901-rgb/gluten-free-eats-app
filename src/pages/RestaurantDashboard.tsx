
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TabProvider } from '@/context/TabContext';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { TableProvider } from '@/context/TableContext';
import { BookingProvider } from '@/context/BookingContext';

import RestaurantLayout from '@/components/Restaurant/RestaurantLayout';
import DashboardHeader from '@/components/Restaurant/DashboardHeader';
import DashboardNavigation from '@/components/Restaurant/DashboardNavigation';
import DashboardContent from '@/components/Restaurant/DashboardContent';
import LoadingScreen from '@/components/LoadingScreen';

const RestaurantDashboard = () => {
  const [user] = useAuthState(auth);
  const [searchParams] = useSearchParams();
  // Impostiamo direttamente i dati predefiniti all'inizio
  const [restaurantData] = useState({
    id: '1',
    name: 'Keccakè',
    address: 'Via Toledo 42, Napoli, 80132',
    rating: 4.7,
    totalReviews: 128,
    coverImage: '/placeholder.svg'
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  // Impostiamo un timeout molto breve per completare il caricamento
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleLogout = () => {
    try {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userType');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userId');
      
      auth.signOut()
        .then(() => {
          toast.success("Logout effettuato con successo");
          navigate('/');
        })
        .catch(() => {
          // Force navigation even on error
          navigate('/');
        });
    } catch {
      // Ensure navigation happens even if there's an error
      navigate('/');
    }
  };

  // Ottieni la tab iniziale dall'URL o usa 'home' come default
  const initialTab = searchParams.get('tab') || 'home';

  return (
    <RestaurantLayout>
      <div className="bg-amber-50/50 p-4 text-center font-medium text-amber-800 border-b border-amber-200">
        Questa è l'interfaccia dedicata al ristoratore per gestire la propria attività
      </div>
      <div className="flex justify-end p-2 bg-white border-b">
        <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-1.5">
          <LogOut size={16} />
          <span>Esci</span>
        </Button>
      </div>
      <TableProvider>
        <BookingProvider>
          <TabProvider defaultTab={initialTab}>
            <div className="relative">
              {isLoading ? (
                <LoadingScreen 
                  message="Caricamento dashboard..." 
                  timeout={1000}
                  onRetry={() => window.location.reload()}
                />
              ) : (
                <>
                  <DashboardHeader restaurantData={restaurantData} />
                  <DashboardNavigation isRestaurantOwner={true} />
                  <DashboardContent 
                    restaurantData={restaurantData} 
                    isRestaurantOwner={true} 
                  />
                </>
              )}
            </div>
          </TabProvider>
        </BookingProvider>
      </TableProvider>
    </RestaurantLayout>
  );
};

export default RestaurantDashboard;
