
import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./lib/firebase";
import Index from "./pages/Index";
import SearchPage from "./pages/SearchPage";
import FavoritesPage from "./pages/FavoritesPage";
import BookingsPage from "./pages/BookingsPage";
import ProfilePage from "./pages/ProfilePage";
import LoadingScreen from "./components/LoadingScreen";
import AuthGuard from "./components/Authentication/AuthGuard";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import RestaurantLogin from "./pages/RestaurantLogin";

// Import existing pages or create placeholder components for those that don't exist
const RegisterPage = () => <div className="container mx-auto p-6">Register Page</div>;
const RestaurantPage = () => <div className="container mx-auto p-6">Restaurant Page</div>;
const RestaurantDashboardPage = () => <div className="container mx-auto p-6">Restaurant Dashboard Page</div>;

const App: React.FC = () => {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Index />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/restaurant/:id" element={<RestaurantPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/restaurant-login" element={<RestaurantLogin />} />

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

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default App;
