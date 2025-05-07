
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

import './App.css';

import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Register from './pages/Register';
import Login from './pages/Login';
import RestaurantPage from './pages/RestaurantPage';
import RestaurantDashboard from './pages/RestaurantDashboard';
import RestaurantRegister from './pages/RestaurantRegister';
import RestaurantLogin from './pages/RestaurantLogin';
import RestaurantHomePage from './pages/RestaurantHomePage';
import SearchPage from './pages/SearchPage';
import BookingsPage from './pages/BookingsPage';
import ProfilePage from './pages/ProfilePage';
import FavoritesPage from './pages/FavoritesPage';
import LoadingScreen from './components/LoadingScreen';
import safeStorage from './lib/safeStorage';
import RestaurantRegistrationPage from './pages/RestaurantRegistrationPage';

// Componente per reindirizzare gli utenti ristoratore alla dashboard
const RestaurantRedirect = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log("Reindirizzamento alla dashboard ristorante");
    // Piccolo delay nel redirect per evitare problemi di navigazione
    const redirectTimer = setTimeout(() => {
      navigate("/restaurant-dashboard?tab=home");
    }, 100);
    
    return () => clearTimeout(redirectTimer);
  }, [navigate]);
  
  return <LoadingScreen message="Reindirizzamento..." timeout={2000} />;
};

// Componente per controllare il tipo di utente e reindirizzare di conseguenza
const UserTypeRedirect = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const isAuthenticated = safeStorage.getItem('isAuthenticated') === 'true';
    const userType = safeStorage.getItem('userType');
    const isRestaurantOwner = safeStorage.getItem('isRestaurantOwner') === 'true';
    
    setTimeout(() => {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }
      
      if (isRestaurantOwner || userType === 'restaurant') {
        navigate('/restaurant-dashboard?tab=home');
      } else {
        navigate('/home');
      }
    }, 100);
  }, [navigate]);
  
  return <LoadingScreen message="Reindirizzamento in corso..." timeout={2000} />;
};

// Configurazione migliorata del query client con gestione offline
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minuti
      retryOnMount: navigator.onLine,
      meta: {
        // Spostato onError dentro meta per compatibilità con nuove versioni di react-query
        errorHandler: (error: Error) => {
          console.error("Query error:", error);
        }
      }
    },
  },
});

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = safeStorage.getItem('isAuthenticated') === 'true';
  const userType = safeStorage.getItem('userType') || 'customer';
  const [initComplete, setInitComplete] = useState(false);

  // Aggiungiamo un breve delay iniziale per garantire che localStorage sia caricato
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      console.log("Inizializzazione completata");
    }, 300);
    
    // Segnalare quando l'app è completamente inizializzata
    window.addEventListener('load', () => {
      setInitComplete(true);
      console.log("App completamente caricata");
    });
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('load', () => setInitComplete(true));
    };
  }, []);

  // Log per debug
  useEffect(() => {
    console.log("Page view:", window.location.pathname);
    console.log("User type:", userType);
    console.log("Is authenticated:", isAuthenticated);
    console.log("Is restaurant owner:", safeStorage.getItem('isRestaurantOwner') === 'true');
    console.log("Network status:", navigator.onLine ? "online" : "offline");
  }, [userType, isAuthenticated]);

  // Se ancora in caricamento dopo 3 secondi, forziamo il completamento
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (isLoading) {
        console.log("Fallback: forzando il completamento dell'inizializzazione");
        setIsLoading(false);
      }
    }, 3000);
    
    return () => clearTimeout(fallbackTimer);
  }, [isLoading]);

  if (isLoading) {
    return <LoadingScreen message="Inizializzazione..." timeout={3000} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Rotte pubbliche */}
          <Route path="/" element={<Index />} />
          <Route path="/home" element={<Index />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/restaurants/:id" element={<RestaurantPage />} />
          <Route path="/restaurant/:id" element={<RestaurantPage />} />
          
          {/* Rotte per utenti normali */}
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          
          {/* Rotte per ristoratori */}
          <Route path="/restaurant-register" element={<RestaurantRegister />} />
          <Route path="/restaurant-login" element={<RestaurantLogin />} />
          <Route path="/restaurant-registration" element={<RestaurantRegistrationPage />} />
          <Route path="/restaurant-home" element={<RestaurantHomePage />} />
          <Route path="/restaurant-dashboard" element={<RestaurantDashboard />} />
          <Route path="/restaurant-dashboard/*" element={<RestaurantDashboard />} />
          <Route path="/restaurants/dashboard" element={<RestaurantRedirect />} />
          <Route path="/restaurant/dashboard" element={<RestaurantRedirect />} />
          
          {/* Rotta di reindirizzamento in base al tipo di utente */}
          <Route path="/user-redirect" element={<UserTypeRedirect />} />
          
          {/* Pagina 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
