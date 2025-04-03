
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import RestaurantDashboard from "./pages/RestaurantDashboard";
import { BookingProvider } from "./context/BookingContext";

// Add routes for restaurant dashboard sections
import RestaurantGallery from "./pages/restaurant/RestaurantGallery";
import RestaurantVideos from "./pages/restaurant/RestaurantVideos";
import RestaurantBookings from "./pages/restaurant/RestaurantBookings";
import RestaurantReviews from "./pages/restaurant/RestaurantReviews";
import RestaurantProfile from "./pages/restaurant/RestaurantProfile";

// Create a new QueryClient instance
const queryClient = new QueryClient();

const App = () => (
  // Fix the order of providers - React Router must be outside QueryClient
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
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
            
            {/* Restaurant Dashboard Routes */}
            <Route path="/restaurant-dashboard" element={<RestaurantDashboard />} />
            <Route path="/restaurant-dashboard/gallery" element={<RestaurantGallery />} />
            <Route path="/restaurant-dashboard/videos" element={<RestaurantVideos />} />
            <Route path="/restaurant-dashboard/bookings" element={<RestaurantBookings />} />
            <Route path="/restaurant-dashboard/reviews" element={<RestaurantReviews />} />
            <Route path="/restaurant-dashboard/profile" element={<RestaurantProfile />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </BookingProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
