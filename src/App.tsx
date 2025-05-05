import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./lib/firebase";
import Index from "./pages/Index";
import SearchPage from "./pages/SearchPage";
import BookingsPage from "./pages/BookingsPage";
import ProfilePage from "./pages/ProfilePage";
import LoadingScreen from "./components/LoadingScreen";
import AuthGuard from "./components/Authentication/AuthGuard";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import RestaurantLogin from "./pages/RestaurantLogin";
import RestaurantPage from "./pages/RestaurantPage"; 
import RestaurantDashboard from "./pages/RestaurantDashboard";
import { BookingProvider } from "./context/BookingContext";
import Register from "./pages/Register";
import RestaurantRegister from "./pages/RestaurantRegister";
import FavoritesPage from "./pages/FavoritesPage";
import { TableProvider } from "./context/TableContext";

const App: React.FC = () => {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      <BookingProvider>
        <TableProvider>
          <Routes>
            {/* Redirect root to restaurant-login instead of search */}
            <Route path="/" element={<Navigate to="/restaurant-login" replace />} />
            
            {/* Public Routes */}
            <Route path="/home" element={<Index />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/restaurant/:id" element={<RestaurantPage />} />
            <Route path="/login" element={
              !user ? <Login /> : <Navigate to="/home" replace />
            } />
            <Route path="/register" element={
              !user ? <Register /> : <Navigate to="/home" replace />
            } />
            <Route path="/restaurant-register" element={
              !user ? <RestaurantRegister /> : <Navigate to="/restaurant-dashboard" replace />
            } />
            <Route path="/restaurant-login" element={
              !user ? <RestaurantLogin /> : <Navigate to="/restaurant-dashboard" replace />
            } />
            
            {/* Favorites page */}
            <Route path="/favorites" element={<FavoritesPage />} />

            {/* Protected Customer Routes */}
            <Route path="/bookings" element={
              <AuthGuard allowedUserTypes={["customer"]}>
                <BookingsPage />
              </AuthGuard>
            } />
            <Route path="/profile" element={
              <AuthGuard allowedUserTypes={["customer", "restaurant"]}>
                <ProfilePage />
              </AuthGuard>
            } />

            {/* Protected Restaurant Routes */}
            <Route path="/restaurant-dashboard/*" element={
              <AuthGuard allowedUserTypes={["restaurant"]}>
                <RestaurantDashboard />
              </AuthGuard>
            } />
            <Route path="/dashboard/*" element={
              <AuthGuard allowedUserTypes={["restaurant"]}>
                <RestaurantDashboard />
              </AuthGuard>
            } />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </TableProvider>
      </BookingProvider>
    </Suspense>
  );
};

export default App;
