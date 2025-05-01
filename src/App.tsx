
import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./lib/firebase";
import Index from "./pages/Index";
import SearchPage from "./pages/SearchPage";
import FavoritesPage from "./pages/FavoritesPage";
import BookingsPage from "./pages/BookingsPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RestaurantPage from "./pages/RestaurantPage";
import RestaurantLoginPage from "./pages/RestaurantLoginPage";
import RestaurantDashboardPage from "./pages/RestaurantDashboardPage";
import LoadingScreen from "./components/LoadingScreen";
import NotFoundPage from "./pages/NotFoundPage";
import AuthGuard from "./components/Auth/AuthGuard";

const App: React.FC = () => {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Index />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/restaurant/:id" element={<RestaurantPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/restaurant-login" element={<RestaurantLoginPage />} />

          {/* Protected Customer Routes */}
          <Route path="/favorites" element={
            <AuthGuard allowedUserTypes={["customer"]}>
              <FavoritesPage />
            </AuthGuard>
          } />
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
              <RestaurantDashboardPage />
            </AuthGuard>
          } />
          <Route path="/dashboard/*" element={
            <AuthGuard allowedUserTypes={["restaurant"]}>
              <RestaurantDashboardPage />
            </AuthGuard>
          } />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
