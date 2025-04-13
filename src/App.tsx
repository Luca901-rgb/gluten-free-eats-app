
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { BookingProvider } from './context/BookingContext';
import { TableProvider } from './context/TableContext';
import { Toaster } from './components/ui/sonner';
import AuthGuard from './components/Authentication/AuthGuard';
import RestaurantDashboard from './pages/RestaurantDashboard';
import RestaurantLogin from './pages/RestaurantLogin';
import RestaurantPage from './pages/RestaurantPage';
import Register from './pages/Register';
import Login from './pages/Login';
import Index from './pages/Index';
import SearchPage from './pages/SearchPage';
import ProfilePage from './pages/ProfilePage';
import BookingsPage from './pages/BookingsPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import VideoRecipesPage from './pages/VideoRecipesPage';
import { AdminProvider } from './context/AdminContext';
import FavoritesPage from './pages/FavoritesPage';
import './App.css';

function App() {
  return (
    <Router>
      <BookingProvider>
        <TableProvider>
          <AdminProvider>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/home" element={<Index />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/restaurant/:id" element={<RestaurantPage />} />
              <Route path="/restaurant-login" element={<RestaurantLogin />} />
              <Route 
                path="/restaurant-dashboard" 
                element={
                  <AuthGuard requiredUserType="restaurant">
                    <RestaurantDashboard />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <AuthGuard requiredUserType="restaurant">
                    <RestaurantDashboard />
                  </AuthGuard>
                } 
              />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/bookings" element={<BookingsPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route 
                path="/admin-dashboard" 
                element={
                  <AuthGuard requiredUserType="admin">
                    <AdminDashboard />
                  </AuthGuard>
                } 
              />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/videos" element={<VideoRecipesPage />} />
              <Route path="/register" element={<Register />} />
            </Routes>
            <Toaster />
          </AdminProvider>
        </TableProvider>
      </BookingProvider>
    </Router>
  );
}

export default App;
