
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
import { Skeleton } from '@/components/ui/skeleton';

const RestaurantDashboard = () => {
  const [user] = useAuthState(auth);
  const [searchParams] = useSearchParams();
  
  // Dati del ristorante predefiniti
  const restaurantData = {
    id: '1',
    name: 'Keccakè',
    address: 'Via Toledo 42, Napoli, 80132',
    rating: 4.7,
    totalReviews: 128,
    coverImage: '/placeholder.svg'
  };
  
  const navigate = useNavigate();
  
  // Ottieni la tab iniziale dall'URL o usa 'home' come default
  const initialTab = searchParams.get('tab') || 'home';
  
  // Controlla se il ristoratore ha completato la registrazione
  const [hasCompletedRegistration, setHasCompletedRegistration] = useState(true);
  
  useEffect(() => {
    // Verifica se l'utente ha completato la registrazione
    const checkRegistrationStatus = () => {
      // Qui dovresti verificare se l'utente ha completato tutti gli step
      // Per ora, usiamo localStorage come esempio
      const regData = localStorage.getItem('restaurantRegistrationData');
      
      // Se non ci sono dati di registrazione, consideriamo la registrazione incompleta
      if (!regData) {
        console.log("Registrazione incompleta, reindirizzamento...");
        setHasCompletedRegistration(false);
        // Rimandiamo alla pagina di registrazione con un piccolo delay
        setTimeout(() => {
          navigate('/restaurant-register');
          toast.info("Per favore, completa la registrazione del ristorante");
        }, 500);
      } else {
        setHasCompletedRegistration(true);
      }
    };
    
    checkRegistrationStatus();
  }, [navigate]);

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
          navigate('/');
        });
    } catch {
      navigate('/');
    }
  };

  // Se la registrazione non è completa, non mostriamo nulla mentre viene effettuato il redirect
  if (!hasCompletedRegistration) {
    return null;
  }

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
              <DashboardHeader restaurantData={restaurantData} />
              <DashboardNavigation isRestaurantOwner={true} />
              <DashboardContent 
                restaurantData={restaurantData} 
                isRestaurantOwner={true} 
              />
            </div>
          </TabProvider>
        </BookingProvider>
      </TableProvider>
    </RestaurantLayout>
  );
};

export default RestaurantDashboard;
