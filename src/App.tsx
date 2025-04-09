
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { BookingProvider } from './context/BookingContext';
import { TableProvider } from './context/TableContext';
import { Toaster } from './components/ui/sonner';
import RestaurantDashboard from './pages/RestaurantDashboard';
import RestaurantPage from './pages/RestaurantPage';
import Index from './pages/Index';
import SearchPage from './pages/SearchPage';
import ProfilePage from './pages/ProfilePage';
import BookingsPage from './pages/BookingsPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import { AdminProvider } from './context/AdminContext';
import './App.css';

function App() {
  return (
    <Router>
      <BookingProvider>
        <TableProvider>
          <AdminProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/restaurant/:id" element={<RestaurantPage />} />
              <Route path="/restaurant-dashboard" element={<RestaurantDashboard />} />
              <Route path="/dashboard" element={<RestaurantDashboard />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/bookings" element={<BookingsPage />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/admin-login" element={<AdminLogin />} />
            </Routes>
            <Toaster />
          </AdminProvider>
        </TableProvider>
      </BookingProvider>
    </Router>
  );
}

export default App;
