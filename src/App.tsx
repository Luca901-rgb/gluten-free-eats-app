
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import RestaurantPage from "./pages/RestaurantPage";
import ProfilePage from "./pages/ProfilePage";
import SearchPage from "./pages/SearchPage";
import BookingsPage from "./pages/BookingsPage";
import FavoritesPage from "./pages/FavoritesPage";
import VideoRecipesPage from "./pages/VideoRecipesPage";
import PaymentsPage from "./pages/PaymentsPage";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import { BookingProvider } from "./context/BookingContext";
import { AdminProvider } from "./context/AdminContext";
import { Button } from "./components/ui/button";
import { ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";

// Admin pages
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

// Add routes for restaurant dashboard sections
import RestaurantGallery from "./pages/restaurant/RestaurantGallery";
import RestaurantVideos from "./pages/restaurant/RestaurantVideos";
import RestaurantBookings from "./pages/restaurant/RestaurantBookings";
import RestaurantReviews from "./pages/restaurant/RestaurantReviews";
import RestaurantProfile from "./pages/restaurant/RestaurantProfile";

// Admin Access Button Component
const AdminAccessButton = () => {
  const [showButton, setShowButton] = useState(false);
  
  useEffect(() => {
    // Mostra il pulsante solo nella homepage
    const isHomepage = window.location.pathname === '/';
    setShowButton(isHomepage);
    
    const handleRouteChange = () => {
      const isHomepage = window.location.pathname === '/';
      setShowButton(isHomepage);
    };
    
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);
  
  if (!showButton) return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Link to="/admin-login">
        <Button className="flex items-center gap-2 shadow-lg">
          <ShieldCheck size={18} />
          Area Admin
        </Button>
      </Link>
    </div>
  );
};

// Create a new QueryClient instance
const queryClient = new QueryClient();

const App = () => (
  // Fix the order of providers - React Router must be outside QueryClient
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AdminProvider>
        <BookingProvider>
          <TooltipProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/restaurant/:id" element={<RestaurantPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/bookings" element={<BookingsPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/videos" element={<VideoRecipesPage />} />
              <Route path="/payments" element={<PaymentsPage />} />
              
              {/* Restaurant Dashboard Routes */}
              <Route path="/restaurant-dashboard" element={<RestaurantDashboard />} />
              <Route path="/restaurant-dashboard/gallery" element={<RestaurantGallery />} />
              <Route path="/restaurant-dashboard/videos" element={<RestaurantVideos />} />
              <Route path="/restaurant-dashboard/bookings" element={<RestaurantBookings />} />
              <Route path="/restaurant-dashboard/reviews" element={<RestaurantReviews />} />
              <Route path="/restaurant-dashboard/profile" element={<RestaurantProfile />} />
              
              {/* Admin Routes */}
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <AdminAccessButton />
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </BookingProvider>
      </AdminProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
