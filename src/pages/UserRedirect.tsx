
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import safeStorage from '@/lib/safeStorage';
import { syncPendingRestaurants } from '@/services/restaurantService';

const UserRedirect = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userType } = useAuth();
  
  useEffect(() => {
    const redirectUser = async () => {
      console.log("UserRedirect: Checking authentication status");
      console.log("isAuthenticated:", isAuthenticated);
      console.log("userType:", userType);
      
      if (!isAuthenticated) {
        console.log("Not authenticated, redirecting to login");
        toast.error("Per favore, accedi per continuare");
        navigate('/login');
        return;
      }
      
      // Ottieni il tipo di utente dal localStorage se non è presente nel context
      const userTypeFromStorage = userType || safeStorage.getItem('userType');
      console.log("User type (including fallback):", userTypeFromStorage);
      
      if (userTypeFromStorage === 'restaurant') {
        console.log("Redirecting to restaurant dashboard");
        
        // Verifica se ci sono ristoranti in attesa di sincronizzazione
        try {
          await syncPendingRestaurants();
        } catch (error) {
          console.error("Error syncing pending restaurants:", error);
        }
        
        // Verifica se esiste il flag di registrazione completata
        const registrationCompleted = safeStorage.getItem('restaurantRegistrationData');
        
        // Se la registrazione non è completa, reindirizza alla pagina di registrazione
        if (!registrationCompleted) {
          console.log("Restaurant registration not completed, redirecting to registration");
          navigate('/restaurant-registration');
          return;
        }
        
        navigate('/restaurant-dashboard');
      } else if (userTypeFromStorage === 'customer') {
        console.log("Redirecting to customer home");
        navigate('/home');
      } else {
        // Default fallback
        console.log("No user type found, redirecting to home");
        navigate('/');
      }
    };
    
    redirectUser();
  }, [navigate, isAuthenticated, userType]);
  
  // Show loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#bfe5c0]">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-t-green-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg text-[#38414a]">Reindirizzamento in corso...</p>
      </div>
    </div>
  );
};

export default UserRedirect;
