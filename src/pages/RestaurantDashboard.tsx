
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { TabProvider } from '@/context/TabContext';
import RestaurantLayout from '@/components/Restaurant/RestaurantLayout';
import DashboardHeader from '@/components/Restaurant/DashboardHeader';
import DashboardContent from '@/components/Restaurant/DashboardContent';
import { useRestaurantTab } from '@/hooks/useRestaurantTab';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import safeStorage from '@/lib/safeStorage';
import { toast } from 'sonner';

interface RestaurantData {
  id?: string;
  name: string;
  description: string;
  address: string;
  image?: string;
  rating?: number;
  cuisine?: string;
  hasGlutenFreeOptions: boolean;
  isAicCertified?: boolean;
}

const RestaurantDashboard = () => {
  const navigate = useNavigate();
  const { currentTab, setCurrentTab } = useRestaurantTab();
  const [restaurantData, setRestaurantData] = useState<RestaurantData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadRestaurantData = async () => {
      // Il proprietario del ristorante è l'utente attualmente autenticato
      const userId = safeStorage.getItem('userId') || auth.currentUser?.uid;
      
      if (!userId) {
        console.error("Nessun utente autenticato");
        toast.error("Errore nel caricamento dei dati del ristorante");
        navigate('/login');
        return;
      }
      
      try {
        // Ottieni l'ID del ristorante dell'utente corrente
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
          console.error("Utente non trovato");
          toast.error("Utente non trovato");
          return;
        }
        
        const userData = userSnap.data();
        const restaurantId = userData.restaurantId;
        
        if (!restaurantId) {
          console.error("Nessun ristorante associato all'utente");
          
          // Utilizziamo un ristorante di esempio per test
          const sampleRestaurant: RestaurantData = {
            id: "sample-restaurant",
            name: "Il tuo ristorante",
            description: "Descrizione del tuo ristorante senza glutine",
            address: "Via Example, 123, Milano",
            image: "/placeholder.svg",
            rating: 4.5,
            cuisine: "Gluten Free",
            hasGlutenFreeOptions: true,
            isAicCertified: true
          };
          
          setRestaurantData(sampleRestaurant);
          setIsLoading(false);
          return;
        }
        
        // Ottieni i dati del ristorante
        const restaurantRef = doc(db, 'restaurants', restaurantId);
        const restaurantSnap = await getDoc(restaurantRef);
        
        if (!restaurantSnap.exists()) {
          console.error("Ristorante non trovato");
          toast.error("Ristorante non trovato");
          return;
        }
        
        const restaurant = {
          id: restaurantSnap.id,
          ...restaurantSnap.data()
        } as RestaurantData;
        
        setRestaurantData(restaurant);
      } catch (error) {
        console.error("Errore nel caricamento dei dati del ristorante:", error);
        toast.error("Errore nel caricamento dei dati del ristorante");
        
        // Fallback a ristorante di esempio
        const sampleRestaurant: RestaurantData = {
          id: "sample-restaurant",
          name: "Ristorante Demo",
          description: "Un ristorante di esempio con opzioni senza glutine",
          address: "Via Roma 123, Milano",
          image: "/placeholder.svg",
          rating: 4.5,
          cuisine: "Italiana Gluten Free",
          hasGlutenFreeOptions: true,
          isAicCertified: true
        };
        
        setRestaurantData(sampleRestaurant);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRestaurantData();
  }, [navigate]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#a3e0a8]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-green-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Caricamento dashboard...</p>
        </div>
      </div>
    );
  }
  
  if (!restaurantData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#a3e0a8]">
        <div className="text-center p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Nessun ristorante trovato</h2>
          <p className="text-gray-600 mb-4">Non è possibile trovare informazioni sul tuo ristorante.</p>
          <button 
            className="px-4 py-2 bg-green-500 text-white rounded-md"
            onClick={() => navigate('/restaurant-registration')}
          >
            Registra un ristorante
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <RestaurantLayout>
      <DashboardHeader />
      
      <DashboardContent 
        restaurantData={restaurantData}
        isRestaurantOwner={true}
      />
    </RestaurantLayout>
  );
};

const DashboardWithProvider = () => {
  return (
    <TabProvider>
      <RestaurantDashboard />
    </TabProvider>
  );
};

export default DashboardWithProvider;
