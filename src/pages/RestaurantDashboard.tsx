
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import DashboardHeader from '@/components/Restaurant/DashboardHeader';
import DashboardNavigation from '@/components/Restaurant/DashboardNavigation';
import DashboardContent from '@/components/Restaurant/DashboardContent';
import { TabProvider } from '@/context/TabContext';
import { Button } from '@/components/ui/button';
import { LogOut, Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { TableProvider } from '@/context/TableContext';
import { BookingProvider } from '@/context/BookingContext';

const RestaurantDashboard = () => {
  const [user, loading] = useAuthState(auth);
  const [restaurantData, setRestaurantData] = useState({
    id: '1',
    name: 'Trattoria Keccabio',
    address: 'Via Toledo 42, Napoli, 80132',
    rating: 4.7,
    totalReviews: 128,
    coverImage: '/placeholder.svg'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const loadRestaurantData = async () => {
    setIsLoading(true);
    setLoadingError(null);

    try {
      // Fallback to default data if no user or connection issues
      if (!user) {
        console.log("No authenticated user found, using default data");
        setTimeout(() => {
          setIsLoading(false);
        }, 800);
        return;
      }

      console.log("Loading restaurant data for user:", user.uid);
      
      // Cerca il ristorante associato all'utente corrente
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (userDoc.exists() && userDoc.data().restaurantId) {
        const restaurantId = userDoc.data().restaurantId;
        console.log("Found restaurant ID:", restaurantId);
        
        const restaurantDoc = await getDoc(doc(db, "restaurants", restaurantId));
        
        if (restaurantDoc.exists()) {
          const data = restaurantDoc.data();
          console.log("Restaurant data loaded successfully:", data.name);
          
          setRestaurantData({
            id: restaurantId,
            name: data.name || 'Il mio ristorante',
            address: data.address || 'Indirizzo non disponibile',
            rating: data.rating || 0,
            totalReviews: data.reviewCount || 0,
            coverImage: data.coverImage || '/placeholder.svg'
          });
        } else {
          console.warn("Restaurant document not found, using default data");
        }
      } else {
        console.warn("No restaurant ID associated with user, using default data");
      }
    } catch (error) {
      console.error("Error loading restaurant data:", error);
      setLoadingError("Impossibile caricare i dati del ristorante. Verifica la connessione internet.");
      toast.error("Errore nel caricamento dei dati del ristorante");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only attempt to load data once the auth state is determined
    if (!loading) {
      loadRestaurantData();
    }
  }, [user, loading]);

  useEffect(() => {
    // Verifica che l'utente sia autenticato e sia di tipo "restaurant"
    if (!loading && !user) {
      toast.error("Accesso non autorizzato");
      navigate('/restaurant-login');
      return;
    }
    
    // Verifica il tipo di utente dal localStorage
    const userType = localStorage.getItem('userType');
    if (!loading && userType !== 'restaurant') {
      toast.error("Accesso riservato ai ristoratori");
      navigate('/restaurant-login');
    }
  }, [user, loading, navigate]);

  const handleLogout = () => {
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
      });
  };

  const handleRetry = () => {
    loadRestaurantData();
  };

  // Loading state with better feedback
  if (loading) {
    return (
      <Layout hideNavigation={true}>
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-gray-600">Verifica credenziali...</p>
        </div>
      </Layout>
    );
  }

  // Error state with retry option
  if (loadingError) {
    return (
      <Layout hideNavigation={true}>
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
      </Layout>
    );
  }

  // Loading data state
  if (isLoading) {
    return (
      <Layout hideNavigation={true}>
        <div className="bg-amber-50/50 p-4 text-center font-medium text-amber-800 border-b border-amber-200">
          Questa è l'interfaccia dedicata al ristoratore per gestire la propria attività
        </div>
        <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-gray-600">Caricamento della dashboard...</p>
        </div>
      </Layout>
    );
  }

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
      <TableProvider>
        <BookingProvider>
          <TabProvider>
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
    </Layout>
  );
};

export default RestaurantDashboard;
