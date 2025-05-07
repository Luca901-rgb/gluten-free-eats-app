
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
import LoadingScreen from '@/components/LoadingScreen';

const RestaurantDashboard = () => {
  const [user] = useAuthState(auth);
  const [searchParams] = useSearchParams();
  const [loading, setIsLoading] = useState(true);
  
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
  const [hasCompletedRegistration, setHasCompletedRegistration] = useState(false);
  
  useEffect(() => {
    console.log("RestaurantDashboard: Inizializzazione con tab", initialTab);
    
    // Simuliamo il caricamento
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    // Verifica se l'utente ha completato la registrazione
    const checkRegistrationStatus = () => {
      try {
        // Qui dovresti verificare se l'utente ha completato tutti gli step
        // Per ora, usiamo localStorage come esempio
        const regData = localStorage.getItem('restaurantRegistrationData') || 
                      localStorage.getItem('restaurantInfo');
        
        console.log("Dati di registrazione trovati:", regData ? "sì" : "no");
        
        // Se ci sono dati di registrazione, consideriamo la registrazione completata
        if (regData) {
          console.log("Registrazione completata, mostro la dashboard");
          setHasCompletedRegistration(true);
        } else {
          console.log("Registrazione incompleta, reindirizzamento...");
          setHasCompletedRegistration(false);
          // Rimandiamo alla pagina di registrazione con un piccolo delay
          toast.info("Per favore, completa la registrazione del ristorante");
          setTimeout(() => {
            navigate('/restaurant-registration');
          }, 500);
        }
      } catch (error) {
        console.error("Errore durante il controllo dello stato di registrazione:", error);
        // In caso di errore, mostriamo comunque la dashboard per evitare che l'utente rimanga bloccato
        setHasCompletedRegistration(true);
      }
    };
    
    checkRegistrationStatus();
    
    return () => clearTimeout(timer);
  }, [navigate, initialTab]);

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

  // Se stiamo ancora caricando, mostra lo schermo di caricamento
  if (loading) {
    return <LoadingScreen message="Caricamento dashboard..." timeout={2000} />;
  }

  // Se la registrazione non è completa, non mostriamo nulla mentre viene effettuato il redirect
  if (!hasCompletedRegistration) {
    return <LoadingScreen message="Verifica registrazione..." timeout={2000} />;
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
