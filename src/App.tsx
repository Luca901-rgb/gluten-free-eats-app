
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
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

// Componente per reindirizzare gli utenti ristoratore alla dashboard
const RestaurantRedirect = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log("Reindirizzamento alla dashboard ristorante");
    navigate("/restaurant-dashboard");
  }, [navigate]);
  
  return <LoadingScreen message="Reindirizzamento..." />;
};

// Configure the query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minuti
    },
  },
});

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userType = localStorage.getItem('userType') || 'customer';

  // Aggiungiamo un breve delay iniziale per garantire che localStorage sia caricato
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  // Log per debug
  useEffect(() => {
    console.log("Page view:", window.location.pathname);
    console.log("User type:", userType);
    console.log("Is authenticated:", isAuthenticated);
  }, [userType, isAuthenticated]);

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
          <Route path="/restaurant-home" element={<RestaurantHomePage />} />
          <Route path="/restaurant-dashboard" element={<RestaurantDashboard />} />
          <Route path="/restaurant-dashboard/*" element={<RestaurantDashboard />} />
          <Route path="/restaurants/dashboard" element={<RestaurantRedirect />} />
          <Route path="/restaurant/dashboard" element={<RestaurantRedirect />} />
          
          {/* Pagina 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
