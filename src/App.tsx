
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

import './App.css';

import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Register from './pages/Register';
import Login from './pages/Login';
import RestaurantPage from './pages/RestaurantPage';
import RestaurantDashboard from './pages/RestaurantDashboard';
import RestaurantRegistrationPage from './pages/RestaurantRegistrationPage';
import SearchPage from './pages/SearchPage';
import BookingsPage from './pages/BookingsPage';
import ProfilePage from './pages/ProfilePage';
import FavoritesPage from './pages/FavoritesPage';

// Configure the query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userType = localStorage.getItem('userType') || 'customer';

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/home" element={<Index />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/restaurant-register" element={<RestaurantRegistrationPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/restaurants/:id" element={<RestaurantPage />} />
          <Route path="/restaurant/:id" element={<RestaurantPage />} />
          <Route
            path="/restaurant-dashboard/*"
            element={
              <RestaurantDashboard />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
