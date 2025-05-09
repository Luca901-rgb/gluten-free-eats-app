
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ClientHome from './pages/ClientHome'; 
import RestaurantDashboard from './pages/RestaurantDashboard';
import UserRedirect from './pages/UserRedirect';
import RestaurantRegistrationPage from './pages/RestaurantRegistrationPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { auth } from './lib/firebase';
import SearchPage from './pages/SearchPage';
import BookingsPage from './pages/BookingsPage';
import ProfilePage from './pages/ProfilePage';
import RestaurantPage from './pages/RestaurantPage';
import UserSettingsPage from './pages/UserSettingsPage';
import RestaurantSettingsPage from './pages/RestaurantSettingsPage';

function AppContent() {
  const { isLoading, isAuthenticated, userType } = useAuth();

  // Mostra un loader mentre verifichiamo lo stato di autenticazione
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#a3e0a8]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-green-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Caricamento...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Rotte pubbliche accessibili a tutti */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/user-redirect" /> : <Home />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/user-redirect" /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/user-redirect" /> : <Register />} />
        
        {/* Rotta per registrazione ristorante */}
        <Route path="/restaurant-registration" element={<RestaurantRegistrationPage />} />
        
        {/* Rotta per visualizzare un ristorante specifico */}
        <Route path="/restaurant/:id" element={<RestaurantPage />} />
        
        {/* Rotte protette condivise */}
        <Route 
          path="/profile" 
          element={
            isAuthenticated ? <ProfilePage /> : <Navigate to="/login" replace />
          } 
        />
        
        {/* Rotte specifiche per impostazioni */}
        <Route 
          path="/user-settings" 
          element={
            isAuthenticated && userType === 'customer' ? <UserSettingsPage /> : <Navigate to="/login" replace />
          } 
        />
        
        <Route 
          path="/restaurant-settings" 
          element={
            isAuthenticated && userType === 'restaurant' ? <RestaurantSettingsPage /> : <Navigate to="/login" replace />
          } 
        />
        
        {/* Rotta protetta per la dashboard ristorante */}
        <Route 
          path="/restaurant-dashboard/*" 
          element={
            isAuthenticated && userType === 'restaurant' ? 
              <RestaurantDashboard /> : 
              <Navigate to="/login" replace />
          } 
        />
        
        {/* Rotte protette per i clienti */}
        <Route 
          path="/home" 
          element={
            isAuthenticated && userType === 'customer' ? 
              <ClientHome /> : 
              <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/search" 
          element={
            isAuthenticated && userType === 'customer' ? 
              <SearchPage /> : 
              <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/bookings" 
          element={
            isAuthenticated && userType === 'customer' ? 
              <BookingsPage /> : 
              <Navigate to="/login" replace />
          } 
        />
        
        {/* Reindirizzamento utente */}
        <Route path="/user-redirect" element={<UserRedirect />} />
        
        {/* Redirect per rotte non trovate */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
