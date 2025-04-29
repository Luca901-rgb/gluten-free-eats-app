
import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import RestaurantLogin from '@/pages/RestaurantLogin';
import ForgotPassword from '@/pages/ForgotPassword';
import RestaurantPage from '@/pages/RestaurantPage';
import RestaurantDashboard from '@/pages/RestaurantDashboard';
import RestaurantRegister from '@/pages/RestaurantRegister';
import { Toaster } from 'sonner';

function App() {
  const location = useLocation();

  useEffect(() => {
    // Track page view
    console.log('Page view:', location.pathname);
  }, [location]);

  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/restaurant-register" element={<RestaurantRegister />} />
        <Route path="/restaurant-login" element={<RestaurantLogin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/restaurant/:id" element={<RestaurantPage />} />
        <Route path="/restaurant-dashboard" element={<RestaurantDashboard />} />
      </Routes>
    </>
  );
}

export default App;
