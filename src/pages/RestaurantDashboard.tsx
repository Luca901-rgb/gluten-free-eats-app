
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TabProvider } from '@/context/TabContext';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { auth, db } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { TableProvider } from '@/context/TableContext';
import { BookingProvider } from '@/context/BookingContext';
import { doc, getDoc } from 'firebase/firestore';
import safeStorage from '@/lib/safeStorage';

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
  const [isCorrectUser, setIsCorrectUser] = useState(false);
  
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
    
    const checkUserType = async () => {
      try {
        // Verifica se l'utente è autenticato
        if (!user) {
          console.log("Nessun utente autenticato, reindirizzamento al login");
          toast.error("Accesso richiesto");
          navigate('/restaurant-login');
          return;
        }
        
        // Verifica se l'utente è un ristoratore
        const isRestaurantOwner = safeStorage.getItem('isRestaurantOwner') === 'true';
        const userType = safeStorage.getItem('userType');
        
        if (!isRestaurantOwner && userType !== 'restaurant') {
          console.log("Utente non autorizzato: non è un ristoratore");
          
          // Verificare direttamente su Firestore il tipo di utente
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists() && userDoc.data().type === 'restaurant') {
            // Aggiorna il flag correttamente
            safeStorage.setItem('isRestaurantOwner', 'true');
            safeStorage.setItem('userType', 'restaurant');
            setIsCorrectUser(true);
          } else {
            // Reindirizza l'utente alla home cliente
            toast.error("Non hai i permessi per accedere alla dashboard ristoratore");
            navigate('/home');
            return;
          }
        } else {
          setIsCorrectUser(true);
        }
        
        // Verifica se l'utente ha completato la registrazione
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
        console.error("Errore durante il controllo dello stato utente:", error);
        // In caso di errore, mostriamo comunque la dashboard per evitare che l'utente rimanga bloccato
        setIsCorrectUser(true);
        setHasCompletedRegistration(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Simuliamo il caricamento
    const timer = setTimeout(() => {
      checkUserType();
    }, 800);
    
    return () => clearTimeout(timer);
  }, [navigate, initialTab, user]);

  const handleLogout = () => {
    try {
      safeStorage.removeItem('isAuthenticated');
      safeStorage.removeItem('userType'); 
      safeStorage.removeItem('userEmail');
      safeStorage.removeItem('userId');
      safeStorage.removeItem('isRestaurantOwner');
      
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

  // Se l'utente non è un ristoratore, non mostriamo nulla mentre viene effettuato il redirect
  if (!isCorrectUser) {
    return <LoadingScreen message="Verifica permessi..." timeout={2000} />;
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
