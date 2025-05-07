
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TabProvider } from '@/context/TabContext';
import { Button } from '@/components/ui/button';
import { LogOut, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { TableProvider } from '@/context/TableContext';
import { BookingProvider } from '@/context/BookingContext';

import RestaurantLayout from '@/components/Restaurant/RestaurantLayout';
import DashboardHeader from '@/components/Restaurant/DashboardHeader';
import DashboardNavigation from '@/components/Restaurant/DashboardNavigation';
import DashboardContent from '@/components/Restaurant/DashboardContent';
import LoadingScreen from '@/components/LoadingScreen';

const RestaurantDashboard = () => {
  const [user, loading] = useAuthState(auth);
  const [searchParams] = useSearchParams();
  const [restaurantData, setRestaurantData] = useState({
    id: '1',
    name: 'Keccakè',
    address: 'Via Toledo 42, Napoli, 80132',
    rating: 4.7,
    totalReviews: 128,
    coverImage: '/placeholder.svg'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);
  const navigate = useNavigate();
  
  // Riduciamo ulteriormente i timeout e utilizziamo sempre i dati predefiniti fin dall'inizio
  // Questo dovrebbe risolvere lo schermo verde vuoto
  useEffect(() => {
    // Impostazione immediata dei dati predefiniti
    console.log("Inizializzazione dashboard con dati predefiniti");
    
    // Timeout molto breve per l'inizializzazione
    const timer = setTimeout(() => {
      if (isLoading) {
        console.log("Forzatura caricamento completato");
        setIsLoading(false);
      }
    }, 1000); // Solo 1 secondo di attesa massima
    
    return () => clearTimeout(timer);
  }, []);
  
  // Controlla se ci sono parametri nell'URL per impostare la tab
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      console.log("Tab from URL:", tabParam);
    }
  }, [searchParams]);
  
  const loadRestaurantData = async () => {
    try {
      console.log("Tentativo di caricamento dati ristorante...");
      
      // Utilizziamo subito i dati predefiniti ma continuiamo a caricare quelli reali in background
      setTimeout(() => {
        // Forziamo il completamento del caricamento dopo un breve istante
        // a prescindere dal risultato delle operazioni asincrone
        setIsLoading(false);
      }, 1500);
      
      if (!user) {
        console.log("Nessun utente autenticato trovato, utilizzo dati predefiniti");
        return;
      }

      console.log("Caricamento dati ristorante per l'utente:", user.uid);
      
      // Cerca il ristorante associato all'utente corrente
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (userDoc.exists() && userDoc.data().restaurantId) {
        const restaurantId = userDoc.data().restaurantId;
        console.log("ID ristorante trovato:", restaurantId);
        
        const restaurantDoc = await getDoc(doc(db, "restaurants", restaurantId));
        
        if (restaurantDoc.exists()) {
          const data = restaurantDoc.data();
          console.log("Dati ristorante caricati con successo:", data.name);
          
          setRestaurantData({
            id: restaurantId,
            name: data.name || 'Keccakè',
            address: data.address || 'Indirizzo non disponibile',
            rating: data.rating || 0,
            totalReviews: data.reviewCount || 0,
            coverImage: data.coverImage || '/placeholder.svg'
          });
        } else {
          console.warn("Documento ristorante non trovato, utilizzo dati predefiniti");
        }
      } else {
        console.warn("Nessun ID ristorante associato all'utente, utilizzo dati predefiniti");
      }
    } catch (error) {
      console.error("Errore caricamento dati ristorante:", error);
      setLoadingError("Impossibile caricare i dati del ristorante. Verifica la connessione internet.");
    }
  };

  useEffect(() => {
    // Iniziamo con l'auth inizializzata per evitare blocchi
    setAuthInitialized(true);
    
    // Carica i dati subito, senza aspettare la fine del caricamento auth
    loadRestaurantData();
    
    // Se dopo mezzo secondo siamo ancora in caricamento, forziamo il completamento
    const forceTimer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(forceTimer);
  }, [user]);

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
        .catch((error) => {
          console.error("Errore durante il logout:", error);
          toast.error("Errore durante il logout");
          // Forza comunque la navigazione in caso di errore
          setTimeout(() => navigate('/'), 500);
        });
    } catch (error) {
      console.error("Errore critico durante il logout:", error);
      // Forza comunque la navigazione in caso di errore
      navigate('/');
    }
  };

  const handleRetry = () => {
    // Reset errori e riprova caricamento
    setLoadingError(null);
    loadRestaurantData();
    
    // Timeout di sicurezza anche per il retry
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  // Stato di errore con opzione di riprova
  if (loadingError) {
    return (
      <RestaurantLayout>
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
            <p className="text-red-600 mb-4">{loadingError}</p>
            <Button 
              variant="outline" 
              onClick={handleRetry} 
              className="flex items-center gap-2"
            >
              <RefreshCw size={16} />
              Riprova
            </Button>
          </div>
        </div>
      </RestaurantLayout>
    );
  }

  // Ottieni la tab iniziale dall'URL o usa 'home' come default
  const initialTab = searchParams.get('tab') || 'home';

  // Ritorna sempre il contenuto principale, anche durante il caricamento
  // questo dovrebbe risolvere il problema dello schermo verde vuoto
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
                <div className="py-10">
                  <LoadingScreen 
                    message="Caricamento dati..." 
                    timeout={1500}
                    onRetry={handleRetry}
                  />
                </div>
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
